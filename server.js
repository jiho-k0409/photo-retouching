const express = require('express');
const helmet = require('helmet');
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const fetch = require('node-fetch')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session)
const mysql = require('mysql');
const db = require('./db')
require('dotenv').config();

const app = express();

const connection = mysql.createConnection(db)

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
        maxAge:1000*60*5,
        signed:true,
        httpOnly:true
    }
}));

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(helmet());
app.use(expressCspHeader({
    directives: {
        'script-src': [SELF, INLINE, "http://openapi.map.naver.com","http://nrbe.map.naver.net","http://dapi.kakao.com","http://t1.daumcdn.net","http://nid.naver.com"],
    }
}));

const root = require('./routes/root');
const profile = require('./routes/profile');
const admin = require('./routes/admin');
const download = require('./routes/download');
const { json } = require('express');

app.use('/',root);
app.use('/profile',profile);
app.use('/admin',admin);
app.use('/download',download)


app.get('/invitation',(req,res)=>{
    res.header("Cross-Origin-Embedder-Policy", "credentialless");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    res.render('test')
});

app.get('/my',(req,res)=>{
    res.render('my')
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/login/callback', async (req,res)=>{
    const code = req.query.code;
    const state = req.query.state;
    const options = {
        url: `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&state=${state}`,
        headers: {'X-Naver-Client-Id':process.env.CLIENT_ID, 'X-Naver-Client-Secret': process.env.CLIENT_SECRET,'Accept':'application/json'}
    };
    async function getResponseJSON(){
        const response = await fetch(options.url,{method:'GET',headers:options.headers})
        const jsonRes = await response.json()
        const getProfile = await fetch('https://openapi.naver.com/v1/nid/me',{method:'GET',headers:{'Authorization':`Bearer ${jsonRes.access_token}`}});
        const result = await getProfile.json();
        return result
    }
    const result = await getResponseJSON();
    const userQuery = connection.query(`select id from member_table where user_unique='${result.response.id}'`,(err,outcome,fields)=>{
        console.log(outcome.length)
        if(outcome.length===0){
            console.log('ur not in')
            req.session.user = {
                id:result.response.id,
                authenticated : true
            }
           // connection.query(`insert into member_table (name,gender,email,age_group, user_unique) values ('${result.response.name}','${result.response.gender}','${result.response.email},'${result.response.age}','${result.response.id})`);
        }else{
            console.log('u already in')
            req.session.user = {
                id:result.response.id,
                authenticated : true
            }
        }
    })
    //await console.log(userQuery);
    res.redirect('/')
})

app.listen(port,()=>{
    console.log("listening on 3000");
});