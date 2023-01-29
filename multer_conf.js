const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { connect } = require('http2');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(!fs.existsSync(path.join(__dirname,`/client_uploads/${req.session.user.id}`))){
      fs.mkdirSync(path.join(__dirname,`/client_uploads/${req.session.user.id}`))
    }
        
    cb(null, __dirname+`/client_uploads/${req.session.user.id}`);
  },
  filename: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null,file.originalname);
  }
});

const fileFilter=(req,file,cb)=>{
    const fileType = file.mimetype;
    if(fileType.split('/')[0]=="image"){
      cb(null,true);
    }else{
      console.log("이상한 파일!");
      cb(null,false);
    }
}

const upload = multer({ storage: storage, fileFilter:fileFilter });

module.exports = upload;