import puppeteer from "puppeteer";
import { gotScraping } from 'got-scraping';
import * as cheerio from 'cheerio';
import { writeFile } from 'fs/promises';
import cron from 'node-cron';

const storeUrl = 'https://www.indeed.com/jobs?l=merced&radius=50';

const determineOpportunityType = (sourceUrl) => {
    if (sourceUrl.includes('internship')) {
        return 'Internship';
    } else if (sourceUrl.includes('mentorship')) {
        return 'Mentorship';
    } else if (sourceUrl.includes('bootcamp')) {
        return 'Bootcamp';
    } else if (sourceUrl.includes('apprenticeship')) {
        return 'Apprenticeship';
    } else if (sourceUrl.includes('scholarship')) {
        return 'Scholarship';
    } else {
        return 'Job';
    }
};

const insertOpportunityIntoSQL = (opportunityData) => {
    // Implement SQL insert statements for different opportunity types
    // Insert data into the appropriate SQL tables based on the opportunity type
    switch (opportunityData.type) {
        case 'Internship':
            // Insert into Internships_Jobs table
            break;
        case 'Mentorship':
            // Insert into Mentorships table
            break;
        case 'Bootcamp':
            // Insert into Bootcamps table
            break;
        case 'Apprenticeship':
            // Insert into Apprenticeships table
            break;
        case 'Scholarship':
            // Insert into Scholarships table
            break;
        case 'Job':
        default:
            // Insert into Internships_Jobs table as a job or the appropriate default table
            break;
    }
};

const scrapeOpportunities = async () => {
    try {
        // Download HTML with Got Scraping
        const response = await gotScraping(storeUrl);
        const html = response.body;

        // Parse HTML with Cheerio
        const $ = cheerio.load(html);

        // Find all job listings on the page
        const jobListings = $('li.css-5lfssm.eu4oa1w0');

        const results = [];

        jobListings.each((index, jobListing) => {
            const titleElement = $(jobListing).find('li.css-5lfssm.eu4oa1w0 h2.jobTitle a span[title]');
            const title = titleElement.text().trim() || 'unavailable';

            // Get the source URL of the job listing
            const sourceUrl = $(jobListing).find('a.jobLink').attr('href') || '';

            // Determine the opportunity type based on the source URL
            const opportunityType = determineOpportunityType(sourceUrl);

            // Create an object with the opportunity data
            const opportunityData = {
                title,
                type: opportunityType,
                sourceUrl,
            };

            // Insert the opportunity data into the SQL table
            insertOpportunityIntoSQL(opportunityData);

            // Push the opportunity data to the results array
            results.push(opportunityData);
        });

        // Save the scraped data to a JSON file (you can remove this part when inserting into SQL)
        const jsonFile = 'scrapedData.json';
        await writeFile(jsonFile, JSON.stringify(results, null, 2));
        console.log(`Scraped data saved to ${jsonFile}`);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Schedule the scraping function to run every 2 minutes
cron.schedule('*/2 * * * *', scrapeOpportunities);

// You can also run the scraping function immediately to get the initial data.
scrapeOpportunities();
