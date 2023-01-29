const express =require('express');
const fs = require('fs');
const connection = require('../db');

const router = express.Router();


router.get('/',async (req,res)=>{
    folders=fs.readdirSync('client_uploads');
    console.log(folders)
    let fileList = []

    for(let i =0;i<folders.length;i++){
      let file = fs.readdirSync(`./client_uploads/${folders[i]}`);
      connection.query(`select name from member_table where user_unique='${folders[i]}'`,function(err,result,fields){
        console.log(result[0].name)
        fileList.push({folder : result[0].name,files:file})
        console.log(fileList)
        res.render('admin',{fileList:fileList});
      })
    }

})

module.exports = router;