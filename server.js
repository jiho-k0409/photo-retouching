const express = require('express');
const helmet = require('helmet');
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const dbConf = require("./db");
const fetch = require('node-fetch');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session)
require('dotenv').config();

const app = express();

const options = {
    host:'localhost',
    port:'3306',
    user:'root',
    password:'devjiho1!2!3!4',
    database:'session_test',
    expiration:1000*60*10
}

const sessionStore = new MySQLStore(options);

const port = 3000;

app.set('view engine','ejs');
app.set('views',__dirname+'/views');

app.use(session({
	key: 'authenticated',
	secret: 'aefhgfalejf43w',
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
    cookie : {
        maxAge:1000*60*60*24*3,
        //secure:true,
        httpOnly:true,
        signed:true
    }
}));

app.use(express.static('public'));
app.use(express.static('client_uploads'));
app.use(express.static('admin_uploads'));
app.use(express.urlencoded({extended:true}));
app.use(helmet());
app.use(expressCspHeader({
    directives: {
        'script-src': [SELF, INLINE, "http://openapi.map.naver.com","http://nrbe.map.naver.net","http://dapi.kakao.com","http://t1.daumcdn.net","http://nid.naver.com"],
    }
}));

const root = require('./routes/root')
const submit = require('./routes/submit');
const profile = require('./routes/profile');
const admin = require('./routes/admin');
const download = require('./routes/download');
const my = require('./routes/my');
const login = require('./routes/login');
const { json } = require('express');

app.use('/',root);
app.use('/login',login)
app.use('/submit',submit);
app.use('/profile',profile);
app.use('/admin',admin);
app.use('/download',download)
app.use('/my',my)


app.get('/invitation',(req,res)=>{
    res.header("Cross-Origin-Embedder-Policy", "credentialless");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    res.render('test')
});

app.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/login');
})

app.listen(port,()=>{
    console.log("listening on 3000");
});