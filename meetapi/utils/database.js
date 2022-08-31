const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "localhost",
    user: process.env.USERDB,
    password:process.env.PASS,
    database: process.env.DB,
    port: process.env.MYSQL_PORT
});
module.exports = pool.promise();