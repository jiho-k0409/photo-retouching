const mysql = require('mysql');

const dbConf = {
    host : 'localhost',
    user : 'root',
    password : 'devjiho1!2!3!4',
    database : 'session_test',
}

const connection = mysql.createConnection(dbConf)
module.exports = connection;