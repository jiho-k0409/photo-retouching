const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const contentDisposition = require('content-disposition')

const app = express();


const port = 3000;

app.set('view engine','ejs');
app.set('views',__dirname+'/views');

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser('akdfjeia'));

const root = require('./routes/root');
const auth = require('./routes/auth');
const profile = require('./routes/profile');

app.use('/',root);
app.use('/auth',auth);
app.use('/profile',profile);

app.get('/admin',(req,res)=>{
  folders=fs.readdirSync('uploads');
  console.log(folders)
  let fileList = []
  for(let i =0;i<folders.length;i++){
    let file = fs.readdirSync(`./uploads/${folders[i]}`);
    fileList.push({folder : folders[i],files:file})
  }
  console.log(fileList)
  res.render('admin',{fileList:fileList});
})
/**
 * 내일 완성
 */
app.get('/download',(req,res)=>{
  let user = req.query.user;
  let file = req.query.file
  console.log(file)
  res.setHeader('Content-Disposition', contentDisposition(file));
  const filestream = fs.createReadStream(`./uploads/${user}/${file}`);
  filestream.pipe(res);
})

app.listen(port,()=>{
    console.log("listening on 3000");
});