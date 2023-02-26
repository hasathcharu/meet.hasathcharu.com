const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: process.env.USERDB,
  password: process.env.PASS,
  database: process.env.DB,
  port: process.env.MYSQL_PORT,
});
console.log(pool);
module.exports = pool.promise();
