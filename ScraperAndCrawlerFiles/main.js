import { gotScraping } from 'got-scraping';
import * as cheerio from 'cheerio';
import { writeFile } from 'fs/promises';
import cron from 'node-cron';

const storeUrl = 'https://www.indeed.com/jobs?l=merced&radius=50';

const scrapeJobListings = async () => { 
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
            let title = 'unavailable';
            let wage = 'unavailable';
            let company = 'unavailable';
            let address = 'unavailable';
            let hours = 'unavailable';
            let additionalInfo = 'unavailable';

            const titleElement = $(jobListing).find('li.css-5lfssm.eu4oa1w0 h2.jobTitle a span[title]');
            const titleText = titleElement.text().trim();
            if (titleText) {
                title = titleText;
            }

            // ... (Rest of the scraping logic)
             // Download HTML with Got Scraping

            jobListings.each((index, jobListing) => {
            const titleElement = $(jobListing).find('li.css-5lfssm.eu4oa1w0 h2.jobTitle a span[title]');
            let title = titleElement.text().trim();
            if (title === '') {
                title = 'unavailable';
            }


            const wageElement = $(jobListing).find('div[data-testid="attribute_snippet_testid"].css-1ihavw2.eu4oa1w0');
            let wage = wageElement.text().trim();
            if (wage === '') {
                wage = 'unavailable';
            }


            const companyElement = $(jobListing).find('span[data-testid="company-name"].css-1x7z1ps');
            let company = companyElement.text().trim();
            if (company === '') {
                company = 'unavailable';
            }


            const addressElement = $(jobListing).find('div[data-testid="text-location"].css-t4u72d');
            let address = addressElement.text().trim();
            if (address === '') {
                address = 'unavailable';
            }


            const hoursElement = $(jobListing).find('div.css-1ihavw2.eu4oa1w0:contains("Full-time"), div.css-1ihavw2.eu4oa1w0:contains("Part-time")');
            let hours = hoursElement.text().trim();
            if (hours === '') {
                hours = 'unavailable';
            }


            const additionalInfoElement = $(jobListing).find('.job-snippet li');
            let additionalInfo = additionalInfoElement.text().trim();
            if (additionalInfo === '') {
                additionalInfo = 'unavailable';
            }

            results.push({ title, wage, company, address, hours, additionalInfo });
            console.log(results);
        });

            results.push({ title, wage, company, address, hours, additionalInfo });
        });

        // Save the scraped data to a JSON file
        const jsonFile = 'scrapedData.json';
        await writeFile(jsonFile, JSON.stringify(results, null, 2));
        console.log(`Scraped data saved to ${jsonFile}`);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Schedule the scraping function to run every 2 minutes
cron.schedule('*/2 * * * *', scrapeJobListings);

// You can also run the scraping function immediately to get the initial data.
scrapeJobListings();
