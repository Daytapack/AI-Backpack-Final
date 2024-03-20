import { getConnection } from "../config.js";
import { comDispQuery } from "../Queries/CommunityDisplay_SQL.js";

// Route Logic
export const getComDispInfo = (req,res) => {
    // URL samples: http://localhost:3000/communitydisplay

    // Database Query Operations
    const tablesToDisplay = ['Internships_Jobs', 'Apprenticeships', 'Mentorships', 'Scholarships', 'Bootcamps'];
    displayAllTables(tablesToDisplay, res);
}

// Database Logic

// Function Definition to perform a display query for a specific table
/* Input Data: 
    1. tableName: Name of each database table
    5. res: server response

    Output Data:
    1. if result exists --> result with Promise Resolved
    2. if result DO NOT exist --> no result or error
    3. if connection is not successfully --> error
*/
const displayTable = (tableName, res) => {
    return new Promise((resolve, reject) => {
        getConnection()
        .then((connection) => {
            console.log('Successfully connecting to MySQL')
            // Prepare query and placeholder filler
            let query = comDispQuery(tableName);

            // SQL Statemet Debugging Functions
            // console.log(searchQuery);

            // Perform query
            connection.execute(query, (error, results) => {
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


// Function Definition to Wrap displayTable() ss Asynchronous Function AND
// to perform a display query for a specific table
/* Input Data: 
    1. tablesToDisplay: List of Database Tables
    5. res: server response

    Output Data:
    1. if result exists --> All Tables result with Promise Resolved
    2. if result DO NOT exist --> no result or error
*/
const displayAllTables = async (tablesToDisplay, res) => {
    const results = {};
    // Iterate All Tables
    for (const tableName of tablesToDisplay) {
        try {
            // Return and Append Query Results
            const tableResults = await displayTable(tableName, res);
            const modTableResults = tableResults.map((element) => {
                element.oppCategory = tableName;
                return element;
            })
            results[tableName] = modTableResults;
        } catch (error) {
            console.error(`Error while searching table ${tableName}:`, error);
        }
    }

    // Display search result to terminal 
    console.log("All search queries completed.");
    // console.log(results);

    // Send the search results back to the client
    res.json(results);
};