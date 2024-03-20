// Define Schema Needed for SQL Query
const searchAttributes = [
    ['Internships_Jobs', ['ID', 'Name', 'Job_Field', 'Job_Type', 'Location', 'Ed_Level', 'Benefits']],
    ['Apprenticeships' , ['ID', 'Name', 'Field', 'Location', 'Reqs', 'Ed_Level']],
    ['Mentorships'     , ['ID', 'Name', 'Field', 'Location', 'Reqs']],
    ['Scholarships'    , ['ID', 'Name', 'Field', 'Background', 'Reqs', 'Ed_Level']],
    ['Bootcamps'       , ['ID', 'Name', 'Field', 'Location', 'Certification']],
];

// Create Single Query
const searchQuery = (tableName) => {
  const tableAttributes = searchAttributes.find(([table]) => table == tableName);

  if(tableAttributes){
      const [table, attributes] = tableAttributes;
      const whereClauses = attributes.map((attribute) => `${table}.${attribute} LIKE ?`);
      const fromClause = `SELECT * FROM ${table}`;
      const query = `${fromClause} WHERE ${whereClauses.join(' OR ')}`;
      return query;
  } else{
    console.error(`searchQuery: Table Name ${tableName} not found in searchAttributes!`);
    return;
  }
}

const getAttributesNum = (tableName) => {
  const tableAttributes = searchAttributes.find(([table]) => table === tableName);
  
  if (tableAttributes) {
    const [, attributes] = tableAttributes; // Destructure to get the attributes array
    return attributes.length;
  } else {
    console.error(`getAttributesNum: Table '${tableName}' not found in searchAttributes.`);
    return;
  }
};

export{ getAttributesNum, searchQuery };

// Debugging Code
//console.log(searchQuery)