// Define Schema Needed for SQL Query
const comDispAttributes = [
    ['Internships_Jobs', ['ID', 'Name', 'Deadline', 'Location', 'URL', 'Company'     , 'Job_Type', 'Details', 'Wage', 'Ed_Level']],
    ['Apprenticeships' , ['ID', 'Name', 'Deadline', 'Location', 'URL', 'Organization', 'Reqs'    , 'Details', 'Wage', 'Ed_Level']],
    ['Mentorships'     , ['ID', 'Name', 'Deadline', 'Location', 'URL', 'Organization', 'Reqs'    , 'Details']],
    ['Scholarships'    , ['ID', 'Name', 'Deadline', 'Award',    'URL', 'Organization', 'Reqs'    , 'Details', 'Ed_Level']],
    ['Bootcamps'       , ['ID', 'Name', 'Deadline', 'Location', 'URL', 'Organization', 'Pricing' , 'Details', 'Certification']],
];

// Create Single Query
const comDispQuery = (tableName) => {
    const tableAttributes = comDispAttributes.find(([table]) => table == tableName);
  
    if(tableAttributes){
        const [table, attributes] = tableAttributes;
        const attriClauses = `${attributes.join(', ')}`;
        const query = `SELECT ${attriClauses} FROM ${table}`;
        return query;
    } else{
      console.error(`searchQuery: Table Name ${tableName} not found in comDispAttributes!`);
      return;
    }
  }
  
  const getAttributesNum = (tableName) => {
    const tableAttributes = comDispAttributes.find(([table]) => table === tableName);
    
    if (tableAttributes) {
      const [, attributes] = tableAttributes; // Destructure to get the attributes array
      return attributes.length;
    } else {
      console.error(`getAttributesNum: Table '${tableName}' not found in comDispAttributes.`);
      return;
    }
  };

  export { comDispQuery, getAttributesNum };