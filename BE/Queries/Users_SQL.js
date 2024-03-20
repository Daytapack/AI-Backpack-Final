// Define Schema Needed for SQL Query
const userAttribute = ['ID', 'Name', 'Password', 'Ed_Level', 'Field', 'Bio', 'Link_Acct', 'Organization', 'Location', 'Username'];

const getUsersQuery = () => {
    try{
        const query = 'SELECT * FROM Users WHERE ID = ?';
        console.log(query);
        return query;
    } catch(error){
        console.error('Error building the GetUser SQL query:', error);
    }
}

// This is a temporary testing function
const getIDQuery = () => {
    try{
        const query = 'SELECT ID FROM Users WHERE Username = ?';
        console.log(query);
        return query;
    } catch(error){
        console.error('Error building the GetID SQL query:', error);
    }
}

const createUsersQuery = () => {
    try{
        const attributeList = userAttribute.join(', ');
        const query = `INSERT INTO Users(${attributeList}) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        console.log(query);
        return query;
    } catch(error) {
        console.error('Error building the AddUser SQL query:', error);
        throw error;
    }
}

const deleteUserQuery = () => {
    try{
        const query = "DELETE FROM Users WHERE Users.ID = ?";
        console.log(query);
        return query;
    } catch(error) {
        console.error('Error building the DeleteUser SQL query:', error);
    }
}

const updateUserQuery = (profileData) => {
    try{
        const setClause = profileData.
        map((key) => `${key} = ?`).
        join(', ');
        const query = `UPDATE Users SET ${setClause} WHERE Users.ID = ?`;
        console.log(query);
        return query;

    } catch(error){
        console.error('Error building the UpdateUser SQL query:', error);
    }
};

export{ getUsersQuery, getIDQuery, createUsersQuery, deleteUserQuery, updateUserQuery};