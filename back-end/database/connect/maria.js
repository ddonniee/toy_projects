require("dotenv").config();

const maria = require('mysql');

const conn = maria.createConnection({
    // host: process.env.DB_HOST,
    // port: process.env.DB_PORT || 8080,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // database: process.env.DB_NAME
    host: "localhost",
    port: 3306,
    user: "pospot",
    password: "pospot0504!",
    database: "myboard"
})

module.exports = conn;