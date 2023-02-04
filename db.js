const mysql = require("mysql2/promise");



const dbConf = async () => {
  try{
    let connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "devjiho1!2!3!4",
      database: "session_test",
    });
    return connection
  }catch(err){
    throw err
  }
};

module.exports = dbConf;
