import { getConnection } from "../config.js";
import { getUsersQuery, getIDQuery, createUsersQuery, deleteUserQuery, updateUserQuery } from "../Queries/Users_SQL.js";

export const getUsers = (req, res)=>{
    // URL samples: http://localhost:3000/users?ID=1

    // Handle Request
    const ID = parseInt(req.query.ID);

    if(!ID){
        res.status(400).json([{Error: "The request is undefined"}]);
    } else{
        // Handle Data & Operation Type
        const data = [ID];
        const type = 'g';
        // Perform Operation
        performQuery(res, data, type);
    }
}

// This is a temporary testing function
export const getID = (req, res) => {
    // URL samples: http://localhost:3000/users/getid?Username=SGUO

    // Handle Request
    const username = req.query.Username;

    if(!username){
        res.status(400).json([{Error: "The request is undefined"}]);
    } else {
        // Handle Data & Operation Type
        const data = [username];
        const type = 'gid';
        // Perform Operation
        performQuery(res, data, type);
    }
}

export const createUsers = (req, res)=> {
    // URL samples: http://localhost:3000/users/create
    // Data samples: 
    // {ID: 2,                         Name: "Steven",            Password: "Pass", 
    //  Ed_Level: "Undergraduate",     Field: "Computer Science", Bio: "N/A",
    //  Link_Acct: "steven@gmail.com", Organization: "UC Merced", Location: "Bay Area"}

    // Handle Request
    const user = req.body["data"];
    const ID = parseInt(user.ID);
    const Name = user.Name;
    const Password = user.Password;
    const Ed_Level = user.Ed_Level;
    const Field = user.Field;
    const Bio = user.Bio;
    const Link_Acct = user.Link_Acct;
    const Organization = user.Organization;
    const Location = user.Location;
    const Username = user.Username;

    // Handle Condition
    const user_keys = Object.keys(user);
    const badReqCond = user_keys.length === 0 || user_keys.some((key) => !user[key]);
    if(badReqCond){
        res.status(400).json([{Error: "The request is undefined"}]);
    } else{
        // Handle Data & Operation Type
        const data = [
            ID,
            Name,
            Password,
            Ed_Level,
            Field,
            Bio,
            Link_Acct,
            Organization,
            Location,
            Username,
        ];
        const type = 'a';
        // Perform Operation
        performQuery(res, data, type);
    }
    return;
}

export const deleteUser = (req,res)=>{
    // URL samples: http://localhost:3000/users/delete
    // Data sample: {ID: 1}

    // Handle Request
    const ID = parseInt(req.body.ID);

    if(!ID){
        res.status(400).json([{Error: "The request is undefined"}]);
    } else{
        // Handle Data & Operation Type
        const data = [ID];
        const type = 'd';
        // Perform Operation
        performQuery(res, data, type);
    }
    return;
}

export const updateUser = (req, res)=>{
    // URL samples: http://localhost:3000/users/update
    // Data samples: 
    // {ID: 2,                         Name: "Steven",            Password: "Pass", 
    //  Ed_Level: "Undergraduate",     Field: "Computer Science", Bio: "N/A",
    //  Link_Acct: "steven@gmail.com", Organization: "UC Merced", Location: "Bay Area"}

    // Handle Request
    const user = req.body;

    // Handle SQL Operation Input
    const userKeys = Object.keys(user);

    // Handle Condition
    const badReqCond = userKeys.length === 0 || userKeys.some((key) => !user[key]);
    if(badReqCond){
        res.status(400).json([{Error: "The request is undefined"}]);
    } else{
        // Handle Data & Operation Type
        const data = Object.values(user);
        const type = 'u';

        // Perform Operation
        performQuery(res, data, type, userKeys);
        // Just For Testing
        // res.status(200).json(["Passing Testing"]);
    }
    return;
}

// Function Definition to perform a display query for a specific table
/* Input Data: 
    1. res: server response
    2. data: input data
    3. types: type of query operation (a: Insert, g: Select)

    Output Data:
    1. if result exists --> send results
    2. if result DO NOT exist --> no result or error
    3. if connection is not successfully --> error
*/
const performQuery = (res, data, type, userKeys = null) => {
    // Connect to the Pool
    getConnection()
    .then((connection) => {
        console.log('Successfully connecting to MySQL')

        // Prepare query and placeholder filler
        let params = '';
        let query = '';

        // For Getting Users Data
        if(type.toLowerCase() === 'g'){
            params = data;
            query = getUsersQuery();
        }
        // For Getting Users ID
        else if(type.toLowerCase() === 'gid'){
            params = data;
            query = getIDQuery();
        }
        // For Adding Users Data
        else if(type.toLowerCase() === 'a'){
            params = data;
            query = createUsersQuery();
        }
        // For Deleting Users Data
        else if(type.toLowerCase() === 'd'){
            params = data;
            query = deleteUserQuery();
        }
        // For Updating/Patching Users Data
        else if(type.toLowerCase() === 'u'){
            // Get the ID index
            if(!userKeys.includes('ID')){
                console.error("ID attribute is missing!");
                res.status(400).json([{Error: "Client does not include ID when sending request!"}]);
            }
            const indexOfID = userKeys.indexOf('ID');
            const ID = data[indexOfID];
            // Reorder the ID value position
            data.splice(indexOfID, 1);
            data.push(ID);
            userKeys.splice(indexOfID, 1);

            params = data;
            // Check if userKeys Exists
            if(!userKeys){
                console.error("This type requires valid userkeys!");
                res.status(500).json([{Error: "Server does not have specific well-defined input to perform!"}]);
                return;
            }
            query = updateUserQuery(userKeys); // Input user attributes except ID
        }
        // Type Exception Handling
        else{
            console.error("This is NOT a valid type, neither search or filter query operations!");
            res.status(500).json([{Error: "Server is unclear what query operation to perform!"}]);
            return;
        }
        // Output data value
        console.log("data: ", params);

        // Perform query
        const queryResults = [];
        connection.execute(query, params, (error, results) => {
            if (error) {
                if(error.code === 'ER_DUP_ENTRY'){
                    console.error('Failed to execute insertion/select/delete query of table Users: ID or Username already taken!')
                    res.status(400).json([{Error: `ID or Username already taken!`}]);
                }
                else{
                    console.error(`Failed to execute insertion/select/delete query for table Users:`, error);
                    res.status(500).json([{Error: `Failed to execute insertion/select/delete query for table Users:`}]);
                }
            } else {
                console.log(`Executed insertion/select/delete query successfully for table Users!`);
                queryResults.push(results);

                // Release the connection to the pool after query
                connection.release((error) => {
                    if (error) {
                        console.error(`Failed to release connection`, error);
                        res.status(500).json([{Error: 'Failed to release connection'}]);
                        return;
                    } else {
                        console.log(`Successfully release the connection`);
                    }
                });

                // Return Query Results
                if (type.toLowerCase() === 'g') {
                    res.json(queryResults);
                } else if (type.toLowerCase() === 'gid'){
                    res.json(queryResults);
                } else if (type.toLowerCase() === 'a') {
                    res.status(200).json([{"Message": "User Data is inserted!"}]);
                } else if (type.toLowerCase() === 'd') {
                    res.status(200).json([{"Message": "User Data is deleted!"}]);
                } else if (type.toLowerCase() === 'u') {
                    res.status(200).json([{"Message": "User Data is updated!"}]);
                }
            }
        });
    })
    .catch((error) => {
        console.error('Error connecting to MySQL:', error);
        res.status(500).json([{Error:'Failure to release Connection'}]);
    });
    return;
};
