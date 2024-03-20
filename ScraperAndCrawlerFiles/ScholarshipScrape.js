import { gotScraping } from 'got-scraping';
import * as cheerio from 'cheerio';
import mysql from 'mysql2/promise';
import cron from 'node-cron';
import fs from 'fs';

import { dbConfig } from '../config.js';

let resultSize = 0;

cron.schedule("* * * * * *", async function () {
    try {
        const urlsData = fs.readFileSync('urlsScholarship.json', 'utf-8');
        const urls = JSON.parse(urlsData).urls;

        const connection = await mysql.createConnection(dbConfig);

        // Define an array of keywords representing the absence of major information
        const noMajorKeywords = ['all grade levels', 'any major', 'high school students', 'All Grade Levels' /* add more keywords as needed */];

        // Define an array of keywords representing "any STEM major"
        const stemKeywords = ['stem', 'steam', 'STEM', 'STEAM' /* add more keywords as needed */];

        // Define an array of keywords representing high school levels (converted to lowercase)
        const highSchoolKeywords = ['high school freshman', 'high school sophomore', 'high school junior', 'high school senior', 'high school', 'HS upperclassmen', 'HS senior', 'HS junior', 'HS sophomore', 'HS freshman' /* add more keywords as needed */].map(keyword => keyword.toLowerCase());

        // Iterate through the URLs
        for (let i = 0; i < urls.length; i++) {
            // Download HTML with Got Scraping
            const response = await gotScraping(urls[i]);
            const html = response.body;

            // Parse HTML with Cheerio
            const $ = cheerio.load(html);

            // Find all scholarship cards on the page
            const scholarshipCards = $('div.re-scholarship-card');

            const results = [];

            // Use a for loop to handle the asynchronous nature of each
            for (let index = 0; index < scholarshipCards.length; index++) {
                const scholarshipCard = scholarshipCards[index];

                const scholarshipNameElement = $(scholarshipCard).find('h5 a');
                const scholarshipName = scholarshipNameElement.text().trim();

                const offeredByElement = $(scholarshipCard).find('p').eq(0);
                const offeredBy = offeredByElement.text().trim();

                const scholarshipLink = scholarshipNameElement.attr('href');

                // Extract award information directly from the scholarship card info section
                const awardInfoSection = $(scholarshipCard).find('div.re-scholarship-card-info');

                const awardInfoElement = awardInfoSection.find('span.re-scholarship-card-info-name:contains("award")');
                const awardText = awardInfoElement.text().trim();
                const awardAmount = awardText.replace(/[^0-9.]/g, ''); // Extract numerical values

                const deadlineValueElement = $(scholarshipCard).find('span.re-scholarship-card-info-name:contains("Deadline")').next();
                const deadlineText = deadlineValueElement.text().trim();

                // Format the deadline in "year-month-date" format
                const parsedDeadline = new Date(deadlineText);
                const formattedDeadline = `${parsedDeadline.getFullYear()}-${(parsedDeadline.getMonth() + 1).toString().padStart(2, '0')}-${parsedDeadline.getDate().toString().padStart(2, '0')}`;

                // Extract additional details
                const hiddenDetails = $(scholarshipCard).find('.re-scholarship-card-main-hidden p');

                // Extract "Grade Level," "Academic Interest," and "Background" from "Details"
                const detailsText = hiddenDetails.text();
                const gradeLevelMatch = detailsText.match(/Grade Level:\s*([^,]+)/);
                const academicInterestMatch = detailsText.match(/Academic Interest:\s*([^,]+)/);
                const backgroundMatch = detailsText.match(/Race\/Ethnicity:\s*([^,]+)/); // Modify this line for background information

                const gradeLevel = gradeLevelMatch ? gradeLevelMatch[1].trim() : '';
                const academicInterest = academicInterestMatch ? academicInterestMatch[1].trim() : '';
                const background = backgroundMatch ? backgroundMatch[1].trim() : ''; // Add this line for background

                // Remove "Grade Level," "Academic Interest," and "Background" from "Details" with a more robust regular expression
                const cleanedDetails = detailsText
                    .replace(/Grade Level:\s*[^,]+/i, '')
                    .replace(/Academic Interest:\s*[^,]+/i, '')
                    .replace(/Race\/Ethnicity:\s*[^,]+/i, '') // Add this line for background
                    .trim();

                // Check if "Ed_Level" contains information that should be in "Details" (e.g., citizenship status, GPA requirements, minimum, race/ethnicity, academic) and exclude it
                const excludedKeywords = ['Citizenship', 'GPA', 'Minimum', 'Race/Ethnicity', 'Academic'];
                const updatedEdLevel = excludedKeywords.reduce((edLevel, keyword) => {
                    const keywordRegex = new RegExp(keyword + ':\\s*[^,]+', 'i');
                    return edLevel.replace(keywordRegex, '');
                }, gradeLevel);

                // Generate a unique identifier for the scholarship (e.g., using a timestamp)
                const scholarshipId = `SCHO${resultSize}`;

                // Extract 'Field,' 'Award,' 'Amount,' and 'Background' specifically
                const fieldElement = $(scholarshipCard).find('.re-scholarship-card-main-info:contains("Academic Interest:")');
                const fieldFromDescription = $(scholarshipCard).find('.re-text p:contains("Academic Interest:")').text().replace('Academic Interest:', '').trim();
                const fieldFromDetails = stemKeywords.some(keyword => detailsText.toLowerCase().includes(keyword.toLowerCase())) ? 'any STEM major' : null;
                const fieldFromEdLevel = highSchoolKeywords.some(keyword => updatedEdLevel.toLowerCase().includes(keyword)) || updatedEdLevel.toLowerCase().includes('all grade levels') ? 'N/A' : null;
                const field = fieldElement.text().replace('Academic Interest:', '').trim() || fieldFromDescription || fieldFromDetails || fieldFromEdLevel;

                const awardElement = awardInfoSection.find('span.re-scholarship-card-info-name:contains("award")');
                const award = awardElement.text().replace('1 award worth', '').trim();

                const amountElement = awardElement.next();
                const amount = amountElement.text().trim();

                results.push({
                    ID: scholarshipId,
                    Name: scholarshipName,
                    Deadline: formattedDeadline,
                    Field: field || academicInterest,
                    Background: background, // Add this line for background
                    Award: award || awardText,
                    Amount: amount || awardAmount,
                    Reqs: '',
                    Schedule: '',
                    Details: cleanedDetails,
                    Ed_Level: updatedEdLevel.trim(),
                    URL: scholarshipLink,
                    Organization: offeredBy,
                });

                resultSize++;
            }

            // Insert scraped data into the MySQL table
            for (const result of results) {
                // Insert the modified result into the 'Scholarships' table
                await connection.query('INSERT INTO Scholarships SET ?', result);
            }

            console.log(`Data for URL ${i + 1} has been inserted into the database.`);
        }

        // Terminate the script
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
    }
});
