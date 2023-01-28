const express = require('express');

const router = express.Router();


router.get('/',(req,res)=>{
    if(req.session.user===undefined){
      res.redirect('/login')
    }else{
      res.render('index');
    }
  });

module.exports =router;