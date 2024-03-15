import { gotScraping } from 'got-scraping';
import * as cheerio from 'cheerio';
import mysql from 'mysql2/promise';
import cron from 'node-cron';
import fs from 'fs';

import { dbConfig } from './config.js';

cron.schedule("* * * * * *", async function () {
    try {
        const url = 'https://program.mentornet.org/login';

        const response = await gotScraping(url);
        const html = response.body;
        const $ = cheerio.load(html);

        // Extract information from HTML
        const name = 'Mentornet';
        const deadline = null;

        // Summarize the schedule
        const scheduleDetails = $('p.eplus-wGu723.eplus-wrapper').text().trim();
        const summarizedSchedule = summarizeSchedule(scheduleDetails);

        const field = 'STEM';
        const location = 'Virtual';

        // Extract details from specific section
        const details = $('p.eplus-msR369.eplus-wrapper').text().trim();

        // Create a result object
        const result = {
            ID: '', // You may generate an ID if needed
            Name: name,
            Deadline: deadline,
            Field: field,
            Reqs: '',
            Schedule: summarizedSchedule,
            Location: location,
            Details: details,
            URL: url,
            Organization: 'Great Minds in STEM',
        };

        // Insert the result into the MySQL table
        const connection = await mysql.createConnection(dbConfig);
        await connection.query('INSERT INTO Mentorships SET ?', result);

        console.log(`Data for URL ${url} has been processed.`);
        console.log('Data has been inserted into the database.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Function to summarize the schedule information
function summarizeSchedule(details) {
    // Your logic to summarize the schedule information goes here
    // For now, let's just return the first 100 characters as an example
    return details.substring(0, 100);
}
