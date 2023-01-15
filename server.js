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
const admin = require('./routes/admin');
const download = require('./routes/download');

app.use('/',root);
app.use('/auth',auth);
app.use('/profile',profile);
app.use('/admin',admin);
app.use('/download',download)

app.listen(port,()=>{
    console.log("listening on 3000");
});