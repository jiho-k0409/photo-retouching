const express = require('express');
const multer  = require('multer');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(!fs.existsSync(__dirname+`/uploads/${req.body.name}_${req.body.phone}`)){
      fs.mkdirSync(__dirname+`/uploads/${req.body.name}_${req.body.phone}`)
    }
    cb(null, __dirname+`/uploads/${req.body.name}_${req.body.phone}`)
  },
  filename: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    cb(null,file.originalname);
  }
});

const fileFilter=(req,file,cb)=>{
  const fileType = file.mimetype

  if(fileType.split('/')[0]=="image"){
    cb(null,true);
  }else{
    console.log("이상한 파일!")
    cb(null,false);
  }
}

const upload = multer({ storage: storage, fileFilter:fileFilter })

const app = express();

const port = 3000;

app.set('view engine','ejs');
app.set('views',__dirname+'/views');

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser('akdfjeia'));

app.get('/',(req,res)=>{
  let authorized = false
  if(req.signedCookies.id!==undefined){
    authorized = true
  }else{
    authorized = false;
  }

  res.render('index',{authorized:authorized});
});



app.post('/profile', upload.array('wedding', 12), function (req, res, next) {
  console.log(res.statusCode)
  res.redirect(`/`);
});

let secretNum=000000

app.post('/auth',(req,res)=>{
  if(req.body.pw==secretNum){
    res.cookie('id','국지호',{maxAge:600000,httpOnly:true,signed:true});
    res.cookie('tel','01042852048',{maxAge:600000,httpOnly:true,signed:true});
  }
  res.redirect('/')
})

app.listen(port,()=>{
    console.log("listening on 3000");
});