const mysql = require("mysql");

// Set database connection credentials
const config = {
  host: "localhost",
  user: "root",
  password: "",
  database: "imperium_rv",
  connectionLimit: 10,
};

// Create a MySQL pool
const pool = mysql.createPool(config);

// Export the pool
module.exports = pool;
