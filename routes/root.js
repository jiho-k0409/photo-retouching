const express = require('express');

const router = express.Router();


router.get('/',(req,res)=>{
    let authorized = false;
    if(req.signedCookies.id!==undefined){
      authorized = true;
    }else{
      authorized = false;
    };
  
    res.render('index',{authorized:authorized});
  });

module.exports =router;