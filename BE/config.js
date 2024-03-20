import mysql from 'mysql2';

// Define Database Configuration (Enter your info)
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Ab23870931331108!',
    database: 'new_BP',
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Function to establish a connection from the pool
const getConnection = () => {
  return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
          if (err) {
              reject(err);
          } else {
              resolve(connection);
          }
      });
  });
};

// Export the pool
export { getConnection };