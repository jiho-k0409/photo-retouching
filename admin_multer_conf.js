const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { connect } = require('http2');
const connection = require('./db');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const name = req.body.name;
    const email = req.body.email;
    connection.query(`select user_unique from member_table where name='${name}' AND email='${email}'`,(err,result,fields)=>{
      if(err) throw err;
      const unique= result[0].user_unique
      if(!fs.existsSync(path.join(__dirname,`/admin_uploads/${unique}`))){
        fs.mkdirSync(path.join(__dirname,`/admin_uploads/${unique}`));
        cb(null, __dirname+`/admin_uploads/${unique}`);
      }
    })
    
  },
  filename: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null,file.originalname);
  }
});

const fileFilter=(req,file,cb)=>{
    const fileType = file.mimetype;
    if(fileType.split('/')[1]=="zip"){
      cb(null,true);
    }else{
      console.log("이상한 파일!");
      cb(null,false);
    }
}

const upload = multer({ storage: storage, fileFilter:fileFilter });

module.exports = upload;