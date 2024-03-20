// Define Schema Needed for SQL Query
const SavedOppAttributes = [
    ['Internships_Jobs', ['ID', 'Name', 'Deadline', 'Location', 'URL', 'Company'     , 'Job_Type', 'Details', 'Wage', 'Ed_Level']],
    ['Apprenticeships' , ['ID', 'Name', 'Deadline', 'Location', 'URL', 'Organization', 'Reqs'    , 'Details', 'Wage', 'Ed_Level']],
    ['Mentorships'     , ['ID', 'Name', 'Deadline', 'Location', 'URL', 'Organization', 'Reqs'    , 'Details']],
    ['Scholarships'    , ['ID', 'Name', 'Deadline', 'Award',    'URL', 'Organization', 'Reqs'    , 'Details', 'Ed_Level']],
    ['Bootcamps'       , ['ID', 'Name', 'Deadline', 'Location', 'URL', 'Organization', 'Pricing' , 'Details', 'Certification']],
];

// Create Single Query
const SavedOppQuery = (tableName) => {
    const tableAttributes = SavedOppAttributes.find(([table]) => table == tableName);
  
    if(tableAttributes){
      const [table, attributes] = tableAttributes;
      // Concatenate Saved_ to TableName --> Saved_Bootcamps
      const savedTable = `Saved_${table}`;
      // Collect All Tables
      const allTables = [table, savedTable, 'Users'];
      // Define All Clauses
      const attriClauses = `${attributes.map(attr => `${table}.${attr} AS ${attr}`).join(', ')}`;
      const fromClauses = `${allTables.join(', ')}`;
      const joinClauses = `User_ID = Users.ID AND Opp_ID = ${table}.ID`;
      const whereClauses = 'Users.ID = ?';
      // Combine Clauses to Queries
      const query = `SELECT ${attriClauses} FROM ${fromClauses} WHERE ${joinClauses} AND ${whereClauses}`;
      return query;
    } else{
      console.error(`SavedQuery: Table Name ${tableName} not found in SavedOppAttributes!`);
      return;
    }
  };

  const AddOppQuery = (tableName) => {
    const tableAttributes = SavedOppAttributes.find(([table]) => table == tableName);

    if(tableAttributes){
      const [table,] = tableAttributes;
      // Concatenate Saved_ to TableName --> Saved_Bootcamps
      const savedTable = `Saved_${table}`;
      // Define query
      const query = `INSERT INTO ${savedTable}(User_ID, Opp_ID, Saved_Date) VALUES(?,?,?)`;
      return query;
    } else{
      console.error(`AddQuery: Table Name ${tableName} not found in SavedOppAttributes!`);
    }
  }

  const DeleteOppQuery = (tableName) => {
    const tableAttributes = SavedOppAttributes.find(([table]) => table == tableName);

    if(tableAttributes){
      const [table,] = tableAttributes;
      // Concatenate Saved_ to TableName --> Saved_Bootcamps
      const savedTable = `Saved_${table}`;
      // Define query
      const query = `DELETE FROM ${savedTable} WHERE User_ID = ? AND Opp_ID = ?`;
      return query;
    } else{
      console.error(`DeleteQuery: Table Name ${tableName} not found in SavedOppAttributes!`);
    }
  }

  const DeleteOppFromUserQuery = (tableName) => {
    try{
        const savedTable = `Saved_${tableName}`;
        // Define query
        const query = `DELETE FROM ${savedTable} WHERE User_ID = ?`;
        return query;
    } catch(error){
        console.error('Error building the deleteOppFromUser SQL query:', error);
    }
}

  export { SavedOppQuery , AddOppQuery , DeleteOppQuery, DeleteOppFromUserQuery };