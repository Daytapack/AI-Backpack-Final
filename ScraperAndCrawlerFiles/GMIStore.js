import { gotScraping } from 'got-scraping';
import * as cheerio from 'cheerio';
import mysql from 'mysql2/promise';
import cron from 'node-cron';
import fs from 'fs';

import { dbConfig } from '../config.js';

cron.schedule("* * * * * *", async function () {
    try {
        const url = 'https://globalmentorship.org/mentorship-program';

        const response = await gotScraping(url);
        const html = response.body;
        const $ = cheerio.load(html);

        // Extract information from HTML
        const name = 'GMI Mentorship Model'; // Updated name
        const deadline = null;
        const schedule = '14 one hour sessions';
        const location = 'Virtual';
        const field = 'All';

        // Extract requirements from specific section
        const requirements = $('div.et_pb_module.et_pb_text.et_pb_text_7.et_pb_text_align_left.et_pb_bg_layout_light p')
            .text()
            .trim();

        // Extract details from specific section
        const details = $('div.et_pb_section.et_pb_section_5.et_section_regular div.et_pb_module.et_pb_text.et_pb_text_6.et_pb_text_align_left.et_pb_bg_layout_light p')
            .text()
            .trim();

        // Create a result object
        const result = {
            ID: '', // You may generate an ID if needed
            Name: name,
            Deadline: deadline,
            Field: field,
            Reqs: requirements,
            Schedule: schedule,
            Location: location,
            Details: details,
            URL: url,
            Organization: 'Global Mentorship Initiative', // Updated organization
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
