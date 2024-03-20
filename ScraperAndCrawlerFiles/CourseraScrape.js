import { gotScraping } from 'got-scraping';
import * as cheerio from 'cheerio';
import mysql from 'mysql2/promise';
import cron from 'node-cron';
import fs from 'fs';

import { dbConfig } from './config.js';

let resultSize = 0;

cron.schedule("* * * * * *", async function () {
    try {
        const urlsData = fs.readFileSync('urlsCoursera.json', 'utf-8');
        const urls = JSON.parse(urlsData).urls;

        const connection = await mysql.createConnection(dbConfig);

        const allResults = [];

        // Iterate through the URLs
        for (const storeUrl of urls) {
            // Download HTML with Got Scraping
            const response = await gotScraping(storeUrl);
            const html = response.body;

            // Parse HTML with Cheerio
            const $ = cheerio.load(html);

            // Find all product cards on the page
            const productCards = $('li.cds-9.css-0.cds-11.cds-grid-item.cds-56.cds-64.cds-76');

            const results = [];

            productCards.each((index, productCard) => {
                const productLinkElement = $(productCard).find('a.cds-119.cds-113.cds-115.cds-CommonCard-titleLink');
                const productName = productLinkElement.text().trim();

                const partnerElement = $(productCard).find('p.cds-121.cds-ProductCard-partnerNames');
                const organization = partnerElement.text().trim();

                const durationCertText = $(productCard).find('.cds-CommonCard-metadata p.cds-119.cds-Typography-base.css-dmxkm1.cds-121').text().trim();

                // Extract duration and certification using regular expressions
                const durationMatch = durationCertText.match(/\d+ - \d+ (Months|Weeks)|\d+ \d+ (Months|Weeks)/i);
                const duration = durationMatch ? durationMatch[0] : '';

                const certificationMatch = durationCertText.match(/(Course|Specialization|Professional Certificate|MasterTrack™ Certificate|Online Degree|Bachelor's Degree|Master's Degree|Doctoral Degree)/i);
                const certification = certificationMatch ? certificationMatch[0] : '';

                // Extract star rating from the reviews section
                const starRatingElement = $(productCard).find('.product-reviews p.css-11uuo4b');
                const starRating = starRatingElement.text().trim();

                // Extract level information
                const levelElement = $(productCard).find('.cds-CommonCard-metadata p.cds-119.cds-Typography-base.css-dmxkm1.cds-121');
                const levelMatch = levelElement.text().match(/Beginner|Intermediate|Advanced/i);
                const level = levelMatch ? levelMatch[0] : '';

                // Extract the actual URL from the href attribute
                const productLink = productLinkElement.attr('href');

                // Add the prefix to the URL
                const fullURL = `https://www.coursera.org${productLink}`;

                // Generate a unique identifier for the bootcamp
                const bootcampId = resultSize;

                results.push({
                    ID: `BOOT${bootcampId}`,  // Assign the generated ID to the 'ID' field
                    Name: productName,
                    Schedule: duration,
                    Field: '',
                    Certification: certification,
                    Pricing: '',
                    Details: '',
                    Location: '',
                    URL: fullURL, // Use the full URL with the prefix
                    Organization: organization,
                    Level: level,
                    Rating: starRating,
                });

                resultSize++;
            });

            // Append the results for this URL to the common results array
            allResults.push(...results);

            console.log(`Data for URL ${resultSize} has been processed.`);
        }

        // Sort the results by ID in ascending order
        allResults.sort((a, b) => a.ID - b.ID);

        // Insert scraped data into the MySQL table
        for (const result of allResults) {
            // Insert the modified result into the 'Bootcamps' table
            await connection.query('INSERT INTO Bootcamps SET ?', result);
        }

        console.log('Data has been inserted into the database.');

        // Terminate the script
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
    }
});
