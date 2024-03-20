// Define Schema Needed for SQL Query
const searchAttributes = [
    ['Internships_Jobs', ['Deadline']],
    ['Apprenticeships' , ['Deadline']],
    ['Mentorships'     , ['Deadline']],
    ['Scholarships'    , ['Deadline']],
    ['Bootcamps'       , ['Deadline']],
];

// Create Single Query
const filterQuery = (tableName) => {
  const tableAttributes = searchAttributes.find(([table]) => table == tableName);

  if(tableAttributes){
      const [table, attributes] = tableAttributes;
      console.log(attributes[0]);
      const whereClauses = attributes.map((attribute) => `${table}.${attribute} LIKE ?`);
      const fromClause = `SELECT * FROM ${table}`;
      const query = `${fromClause} WHERE ${whereClauses.join(' OR ')} ORDER BY ${attributes[0]} ASC`;
      return query;
  } else{
    console.error(`searchQuery: Table Name ${tableName} not found in searchAttributes!`);
    return;
  }
}

export{ filterQuery };

// Debugging Code
// console.log(filterQuery('Scholarships'))