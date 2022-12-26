require("dotenv").config();

const maria = require('mysql');

console.log(process.env.DB_PASS,'pospot?')
const conn = maria.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 8080,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

module.exports = conn;