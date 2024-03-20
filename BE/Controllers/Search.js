//import {v4 as uuidv4} from 'uuid';
import { getConnection } from '../config.js' 
import { getAttributesNum, searchQuery } from '../Queries/Search_SQL.js'
import { filterQuery} from '../Queries/Filter_SQL.js'

// Routine Logic
export const getSearchInfo = (req, res) => {
    // URL Sample: http://localhost:3000/search?keyword=Manager

    // Extract request data
    const keyword = req.query.keyword;
    if(!keyword){
        res.status(400).json([{Error: "The request is undefined"}])
    }
    else if(keyword == ""){
        res.status(400).json([{Error: "The request is empty"}])
    }
    else{
        // Database Query Operations
        const tablesToSearch = ['Internships_Jobs', 'Apprenticeships', 'Mentorships', 'Scholarships', 'Bootcamps'];
        const type = 's' // Symbolize as Search Request
        searchAllTables(tablesToSearch, keyword, searchQuery, type, res);
    }
}

export const getFilterMonthInfo = (req, res) => {
    // URL samples: http://localhost:3000/search/filtermonth?filterDate=11

    // Extract request data
    const filter = req.query.filterDate; // !!! Subject to Change Depends on Frontend
    if(!filter){
        res.status(400).json([{Error: "The request is undefined"}]);
    }
    else if(filter === ""){
        res.status(400).json([{Error: "The request is empty"}]);
    }
    else{
        console.log(filter);
        // Database Query Operations
        const tablesToSearch = ['Internships_Jobs', 'Apprenticeships', 'Mentorships', 'Scholarships', 'Bootcamps'];
        const type = 'f' // Symbolize as Search Request
        searchAllTables(tablesToSearch, filter, filterQuery, type, res);
    }
}

export const getFilterDateInfo = (req, res) => {
    // URL samples: http://localhost:3000/search/filterdate?filterMonth=11&filterDay=8

    // Extract request data
    const month = req.query.filterMonth;
    const day = req.query.filterDay;

    if(!month || !day){
        res.status(400).json([{Error: "The request is undefined"}]);
    }
    else if(month === "" || day === ""){
        res.status(400).json([{Error: "The request is empty"}]);
    }
    else{
        // Prepare Data for Query Operation
        const words = {"month": month, "day": day};
        console.log(words);
        const tablesToSearch = ['Internships_Jobs', 'Apprenticeships', 'Mentorships', 'Scholarships', 'Bootcamps'];
        const type = 'fd' // Symbolize as Search Request
        // Database Query Operations
        searchAllTables(tablesToSearch, words, filterQuery, type, res);
    }
}

// Database Logic
// Function Definition to perform a search query for a specific table
/* Input Data: 
    1. tableName: Name of each database table
    2. word: search keyword or filter word
    3. queryFunc: Search query function or Filter query Function
    4. type: search request or filter request
    5. res: server response

    Output Data:
    1. if result exists --> result with Promise Resolved
    2. if result DO NOT exist --> no result or error
    3. if connection is not successfully --> error
*/
const searchTable = (tableName, word, queryFunc, type, res) => {
    return new Promise((resolve, reject) => {
        getConnection()
        .then((connection) => {
            console.log('Successfully connecting to MySQL')
            // Prepare query and placeholder filler
            let query = '';
            let params = '';
            // For keyword search query
            if(type.toLowerCase() === 's'){
                query = queryFunc(tableName);
                params = Array(getAttributesNum(tableName)).fill(`%${word.toLowerCase()}%`);
            } 
            // For filter query by Month
            else if(type.toLowerCase() === 'f'){
                query = queryFunc(tableName);
                params = Array(1).fill(`%-${word}-%`);

                console.log(query);
                console.log(params);
            } 
            // For filter query by Calendar Day
            else if(type.toLowerCase() === 'fd'){
                query = queryFunc(tableName);
                params = Array(1).fill(`%-${word.month}-${word.day}`);

                console.log(query);
                console.log(params);
            } 
            // Caught Exception 
            else{
                console.error("This is NOT a valid type, neither search or filter query operations!");
                reject(error);
            }

            // SQL Statemet Debugging Functions
            /*
            console.log(searchQuery);
            console.log(params);
            */

            // Perform query
            connection.execute(query, params, (error, results) => {
                if (error) {
                    console.error(`Failed to execute search query for table ${tableName}:`, error);
                    reject(error);
                } else {
                    console.log(`Executed search query successfully for table ${tableName}!`);
                    resolve(results);
                }
                
                // Release the connection to the pool after query
                connection.release((error) => {
                    if(error){
                        console.error(`Failed to release connection`, error);
                        reject(error);
                    } else {
                        console.log(`Successfully release the connection`);
                    }
                });
            });
        })
        .catch((error) => {
            console.error('Error connecting to MySQL:', error);
            res.status(500).json([{Error:'Failure to release Connection'}]);
            reject(error);
        });
    });
};

// Function Definition to Wrap searchTable() ss Asynchronous Function AND
// to perform a search query for a specific table
/* Input Data: 
    1. tableToSearch: List of Database Tables
    2. word: search keyword or filter word
    3. queryFunc: Search query function or Filter query Function
    4. type: search request or filter request
    5. res: server response

    Output Data:
    1. if result exists --> All Tables result with Promise Resolved
    2. if result DO NOT exist --> no result or error
*/
const searchAllTables = async (tablesToSearch, word, queryFunc, type, res) => {
    const results = {};
    // Iterate All Tables
    for (const tableName of tablesToSearch) {
        try {
            // Return and Append Query Results
            const tableResults = await searchTable(tableName, word, queryFunc, type, res);
            const modTableResults = tableResults.map((element) => {
                element.oppCategory = tableName;
                return element;
            })
            results[tableName] = modTableResults;
        } catch (error) {
            console.error(`Error while searching table ${tableName}:`, error);
            res.status(500).json([{Error: "Internal Server Error"}])
        }
    }

    // Display search result to terminal 
    console.log("All search queries completed.");
    console.log(results);

    // Send the search results back to the client
    res.json(results);
};