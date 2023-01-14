const express = require('express');
const multerConf = require('../multer_conf');

const router = express.Router();

router.post('/', multerConf.array('wedding', 12), function (req, res, next) {
    console.log(res.statusCode,req.body.name,req.body.phone);
    res.redirect(`/`);
  });

module.exports =router;