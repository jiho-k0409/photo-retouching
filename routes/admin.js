const express =require('express');
const fs = require('fs');
const connection = require('../db');
const multerConf = require('../admin_multer_conf');

const router = express.Router();


router.get('/',async (req,res)=>{
    folders=fs.readdirSync('client_uploads');
    console.log(folders)
    let fileList = []

    for(let i =0;i<folders.length;i++){
      let file = fs.readdirSync(`./client_uploads/${folders[i]}`);
      connection.query(`select name,email from member_table where user_unique='${folders[i]}'`,function(err,result,fields){
        fileList.push({name : result[0].name,files:file,email:result[0].email})
        console.log(fileList[0].email)
        res.render('admin',{fileList:fileList});
      })
    }
}).post('/',multerConf.array('result',12),(req,res)=>{
  
  res.redirect('/')
})

module.exports = router;