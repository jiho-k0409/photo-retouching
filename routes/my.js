const express = require("express");
const fs = require("fs");
const dbConf = require("../db");
const checkLogin = require('../checklogin');
const path = require('path')
const dirName = require('../dir');

const router = express.Router();



router.get('/',checkLogin,async(req,res)=>{
    if(req.session.user===undefined){
        res.redirect('/login')
    }else{
        try {
            const connection = await dbConf();
            const query=`select name, email from member_table where user_unique='${req.session.user.id}'`
            let [selected] = await connection.query(query);
            let fileList = [];
            let outcome = [];
            //const folders=fs.readdirSync(path.join('..'+__dirname+`/client_uploads/${req.session.user.id}`));
            const folders=fs.readdirSync(path.join(dirName,`/client_uploads/${req.session.user.id}`));
            folders.forEach(file=>fileList.push(`/${req.session.user.id}/${file}`));    
            const outcomeFolders = fs.readdirSync(path.join(dirName+`/admin_uploads/${req.session.user.id}`));
            if(outcomeFolders.length!==0){
                outcomeFolders.forEach(file=>outcome.push(`/${req.session.user.id}/${file}`))
            }
            res.render('my',{name:selected[0].name,email:selected[0].email,fileList:fileList,outcome:outcome});   
        } catch (err) {
            if(err) throw err
        }
        
    }
});

module.exports = router;