const express =require('express');
const fs = require('fs')
const router = express.Router();
const contentDisposition = require('content-disposition');
const checkLogin = require('../checklogin');
const dbConf = require('../db');
const { fields } = require('../admin_multer_conf');
const path =require('path')

router.get('/upload',checkLogin,async (req,res)=>{
    const connection = await dbConf();
    let user = req.query.user;
    let email = req.query.email;
    let file = req.query.file;
    console.log(user,email)
    let [results] = await connection.query(`select user_unique from member_table where name='${user}' AND email='${email}';`)
    res.setHeader('Content-Disposition', contentDisposition(file));
    const filestream = fs.createReadStream(`./client_uploads/${results[0].user_unique}/${file}`);
    filestream.pipe(res);
}).get('/outcome',checkLogin,async (req,res)=>{
    const connection = await dbConf();
    let name = req.query.name;
    let email = req.query.email;
    let [result] = await connection.query(`select user_unique from member_table where name='${name}' AND email='${email}';`);
    let directory = fs.readdirSync(path.join(__dirname,'..',`admin_uploads/${result[0].user_unique}`));
    res.setHeader('Content-Disposition', contentDisposition(directory[0]));
    const filestream = fs.createReadStream(`./admin_uploads/${result[0].user_unique}/${directory[0]}`);
    filestream.pipe(res);
})


module.exports = router;