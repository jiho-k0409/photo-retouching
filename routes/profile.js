const express = require('express');
const multerConf = require('../multer_conf');
const dbConf = require('../db')
const checkLogin = require('../checklogin');

const router = express.Router();

router.post('/',checkLogin ,multerConf.array('wedding', 12), async function (req, res, next) {
  try{
    const connection = await dbConf();
    let [result] = await connection.query(`update member_table set done='false',submit_time=NOW() where user_unique='${req.session.user.id}'`);
    res.redirect(`/`);
  }catch(err){
    res.redirect('/login')
  }

});

module.exports =router;