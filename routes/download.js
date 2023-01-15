const express =require('express');
const fs = require('fs')
const router = express.Router();
const contentDisposition = require('content-disposition');

router.get('/',(req,res)=>{
    let user = req.query.user;
    let file = req.query.file;
    res.setHeader('Content-Disposition', contentDisposition(file));
    const filestream = fs.createReadStream(`./uploads/${user}/${file}`);
    filestream.pipe(res);
})

module.exports = router;