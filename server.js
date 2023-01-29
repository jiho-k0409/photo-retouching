const express = require('express');
const helmet = require('helmet');
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const fetch = require('node-fetch')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session)
const connection = require('./db')
require('dotenv').config();
const fs = require('fs')
const checkLogin = require('./checklogin');

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
        maxAge:1000*60*5,
        //secure:true,
        httpOnly:true,
        signed:true
    }
}));

app.use(express.static('public'));
app.use(express.static('client_uploads'))
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

app.get('/my',checkLogin,(req,res)=>{
    if(req.session.user===undefined){
        res.redirect('/login')
    }else{
        const query=`select name from member_table where user_unique='${req.session.user.id}'`
        const result = connection.query(query,function(err,result,fields){
            if(err) throw err
            console.log(result[0].name)
            const folders=fs.readdirSync(`client_uploads/${req.session.user.id}`);
            console.log(folders)
            let fileList = []
            const path = folders.forEach(file=>fileList.push(`/${req.session.user.id}/${file}`))
            console.log(fileList)
            res.render('my',{name:result[0].name,fileList:fileList})
        })
    }
});

app.get('/login',(req,res)=>{
    res.render('login');
});



app.get('/login/callback', async (req,res)=>{
    try{
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
        console.log(result)
        connection.query(`select id from member_table where user_unique='${result.response.id}'`,(err,outcome,fields)=>{
            if(outcome.length===0){
                req.session.user = {
                    id:result.response.id,
                    authenticated : true
                }
                console.log(result.response.id)
                connection.query(`insert into member_table (name,gender,email,age_group, user_unique) values ('${result.response.name}','${result.response.gender}','${result.response.email}','${result.response.age}','${result.response.id}')`);
                req.session.save(function(){
                    console.log(req.session.user)
                    res.redirect('/')
                })    
            }else{
                console.log(result.response.id)
                req.session.user = {
                    id:result.response.id,
                    authenticated : true
                }
                req.session.save(function(){
                    console.log(req.session.user)
                    res.redirect('/')
                })
            }
        })  
    }catch{
        res.redirect('/login')
    }

})

app.listen(port,()=>{
    console.log("listening on 3000");
});

