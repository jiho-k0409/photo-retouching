const express = require('express');
const checkLogin = require('../checklogin');

const router = express.Router();


router.get('/',checkLogin,(req,res)=>{
  res.render('index');
});

module.exports =router;