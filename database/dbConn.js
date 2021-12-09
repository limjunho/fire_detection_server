"use strict"

const mysql = require("mysql");
const connection = mysql.createConnection({ // 연결할 DB 정의
    host : "localhost",
    user : "test",
    password : "test123",
    database : "fire_detection",
    dateStrings: 'date'
});

module.exports = connection;
