const express = require('express');

const router = express.Router();


router.post('/',(req,res)=>{
    if(req.body.pw==000000){
        res.cookie('id','국지호',{maxAge:600000,httpOnly:true,signed:true});
        res.cookie('tel','01042852048',{maxAge:600000,httpOnly:true,signed:true});
      };
      res.redirect('/');
})

module.exports = router;