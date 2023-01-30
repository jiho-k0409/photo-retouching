const express =require('express');
const fs = require('fs')
const router = express.Router();
const contentDisposition = require('content-disposition');
const checkLogin = require('../checklogin');
const connection = require('../db');
const { fields } = require('../admin_multer_conf');
const path =require('path')

router.get('/upload',checkLogin,(req,res)=>{
    let user = req.query.user;
    let email = req.query.email;
    let file = req.query.file;
    console.log(user,email)
    connection.query(`select user_unique from member_table where name='${user}' AND email='${email}';`,(err,result,fields)=>{
        if (err) throw err
        console.log(result)
        res.setHeader('Content-Disposition', contentDisposition(file));
        const filestream = fs.createReadStream(`./client_uploads/${result[0].user_unique}/${file}`);
        filestream.pipe(res);
    })
    
}).get('/outcome',checkLogin,async (req,res)=>{
    let name = req.query.name;
    let email = req.query.email;
    connection.query(`select user_unique from member_table where name='${name}' AND email='${email}';`,(err,result,fields)=>{
        console.log(result[0].user_unique)
        if (err) throw err
        let directory = fs.readdirSync(path.join(__dirname,'..',`admin_uploads/${result[0].user_unique}`));
        res.setHeader('Content-Disposition', contentDisposition(directory[0]));
        const filestream = fs.createReadStream(`./admin_uploads/${result[0].user_unique}/${directory[0]}`);
        filestream.pipe(res);
        
    })
})


module.exports = router;