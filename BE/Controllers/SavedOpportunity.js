import { getConnection } from "../config.js";
import { SavedOppQuery, AddOppQuery , DeleteOppQuery, DeleteOppFromUserQuery } from "../Queries/SavedOpportunity_SQL.js";

// Route Logic
export const getSavedOppInfo = (req, res) => {
    // URL samples: http://localhost:3000/savedopportunity?userid=1

    //Handle Request
    const ID = parseInt(req.query.userid);

    if(!ID){
        res.status(400).json([{Error: "The request is undefined"}])
    }
    else{
        // Database Query Operations
        const tablesToDisplay = ['Internships_Jobs', 'Apprenticeships', 'Mentorships', 'Scholarships', 'Bootcamps'];
        const type = 'g';
        performOnAllTables(tablesToDisplay, res, ID, type);
    }
}

export const addSavedOppInfo = (req, res) => {
    // URL samples: http://localhost:3000/savedopportunity/addsaved
    // Data samples: {userID: 1, oppID: 9, savedDate: "2023-11-18", table: "Internships_Jobs"}

    // Handle Request
    const contentBody = req.body;
    const userID = parseInt(contentBody.userID);
    const oppID = parseInt(contentBody.oppID);
    const savedDate = contentBody.savedDate;
    const tableName = contentBody.table;

    if(!userID || !oppID || !savedDate || !tableName){
        res.status(400).json([{Error: "The request is undefined"}])
    }
    else{
        // Handle Data & Operation Type
        const data = {
            "userID": userID, 
            "oppID": oppID, 
            "savedDate": savedDate, 
        };
        const type = 'a';
        // Perform Operation
        performOnAllTables([tableName], res, data, type);
    }
}

export const deleteSavedOppInfo = (req, res) => {
    // URL samples: http://localhost:3000/savedopportunity/deletesaved
    // Data samples: {userID: 1, oppID: 9, table: "Internships_Jobs"}

    // Handle Request
    const contentBody = req.body;
    console.log("Content Body: ", contentBody);
    const userID = parseInt(contentBody.userID);
    const oppID = parseInt(contentBody.oppID);
    const tableName = contentBody.table;

    if(!userID || !oppID || !tableName){
        res.status(400).json([{Error: "The request is undefined"}])
    } else{
        // Handle Data & Operation Type
        const data = {
            "userID": userID, 
            "oppID": oppID, 
        };
        const type = 'd';
        // Perform Operation
        performOnAllTables([tableName], res, data, type);
    }
}

export const deleteSavedOppFromUser = (req, res)=>{
    // URL samples: http://localhost:3000/savedopportunity/deleteoppfromuser

    // Handle Request
    const userID = parseInt(req.body.userID);

    if(!userID){
        res.status(400).json([{Error: "The request is undefined"}]);
    } else{
        // Handle Data, Table Names, Operation Types
        const data = {"userID": userID};
        const type = 'dfu';
        const tablesToDisplay = ['Internships_Jobs', 'Apprenticeships', 'Mentorships', 'Scholarships', 'Bootcamps'];
        // Perform Operation
        performOnAllTables(tablesToDisplay, res, data, type);
    }
}

// Database Logic

// Function Definition to perform a display query for a specific table
/* Input Data: 
    1. tableName: Name of each database table
    2. res: server response
    3. data: input data
    4. types: type of query operation (a: Insert, g: Select)

    Output Data:
    1. if result exists --> result with Promise Resolved
    2. if result DO NOT exist --> no result or error
    3. if connection is not successfully --> error
*/
const performOnTable = (tableName, res, data, type) => {
    return new Promise((resolve, reject) => {
        getConnection()
        .then((connection) => {
            console.log('Successfully connecting to MySQL')

            // Prepare query and placeholder filler
            let params = '';
            let query = '';

            // For Getting Opp Data
            if(type.toLowerCase() === 'g'){
                params = Array(1).fill(data);
                console.log("ID: ", params);
                query = SavedOppQuery(tableName);
            }
            // For Adding Opp Data
            else if(type.toLowerCase() === 'a'){
                params = [data.userID, data.oppID, data.savedDate];
                console.log("data: ", params);
                query = AddOppQuery(tableName);
            }
            // For Deleting Opp Data
            else if(type.toLowerCase() === 'd'){
                params = [data.userID, data.oppID];
                console.log("data: ", params);
                query = DeleteOppQuery(tableName);
            }
            // For Deleting Opp Data Based On Users
            else if(type.toLowerCase() === 'dfu'){
                params = [data.userID];
                console.log("data: ", params);
                query = DeleteOppFromUserQuery(tableName);
            }
            else{
                console.error("Invalid type. Neither search nor filter query operations.");
                reject(error);
            }

            // Perform query
            connection.execute(query, params, (error, results) => {
                if (error) {
                    console.error(`Failed to execute insertion/select/delete query for table ${tableName}:`, error);
                    reject(error);
                } else {
                    console.log(`Executed insertion/select/delete query successfully for table ${tableName}!`);
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

// Function Definition to Wrap performOnTable() ss Asynchronous Function AND
// to perform a display query for a specific table
/* Input Data: 
    1. tablesToDisplay: List of Database Tables
    2. res: server response
    3. data: input data
    4. types: type of query operation

    Output Data:
    1. if result exists --> All Tables result with Promise Resolved
    2. if result DO NOT exist --> no result or error
*/
const performOnAllTables = async (tablesToDisplay, res, data, type) => {
    const results = {};
    let currentTableName = "";
    try{
        // Iterate all tables to perform operations
        for (const tableName of tablesToDisplay){
            currentTableName = tableName;
            const tableResults = await performOnTable(tableName, res, data, type);
            if(type.toLowerCase() === 'g'){
                const modTableResults = tableResults.map((element) => {
                    element.oppCategory = tableName;
                    return element;
                });
                results[tableName] = modTableResults;
            }
            console.log("All search queries copleted.");
        }

        // Send different responses based on the type
        if (type.toLowerCase() === 'g') {
            res.json(results);
        } else if (type.toLowerCase() === 'a') {
            res.status(200).json([{ "Message": "Opportunity is saved!" }]);
        } else if (type.toLowerCase() === 'd') {
            res.status(200).json([{ "Message": "Opportunity is deleted!" }]);
        } else if (type.toLowerCase() === 'dfu') {
            res.status(200).json([{ "Message": "Opportunity is deleted based on specific user!" }]);
        } else {
            console.error("Invalid type. Neither search nor filter query operations.");
            res.status(500).json([{ "Error": "Server is unclear what query operation to perform!" }]);
        }
    } catch (error){
        console.error(`Error while querying on table ${currentTableName}:`, error);
        if (type.toLowerCase() === 'g') {
            res.status(500).json([{ Error: "Internal Server Error" }]);
        } else if (type.toLowerCase() === 'a') {
            res.status(400).json([{ "Warning": "Opportunity Already Saved!" }]);
        } else if (type.toLowerCase() === 'd') {
            res.status(500).json([{ "Warning": "Cannot Delete Opportunity That Does Not Exist!" }]);
        } else if (type.toLowerCase() === 'dfu') {
            res.status(500).json([{ "Warning": "Cannot Delete Opportunity From User That Does Not Exist!" }]);
        }else {
            res.status(500).json([{ Error: "Internal Server Error" }]);
        }
    }
};