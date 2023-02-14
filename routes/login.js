const express = require("express");
const dbConf = require("../db");
const router = express.Router();
const fetch = require('node-fetch');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session)

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

app.use(session({
	key: 'authenticated',
	secret: 'aefhgfalejf43w',
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
    cookie : {
        maxAge:1000*60*60*24*3,
        secure:true,
        httpOnly:true,
        signed:true
    }
}));

router.get('/',(req,res)=>{
    res.render('login');
}).get('/callback', async (req,res)=>{
    try{
        const connection = await dbConf();//DB connecton
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
        let [selected] = await connection.query(`select id from member_table where user_unique='${result.response.id}'`);
        console.log(selected)
        if(selected.length===0){
            req.session.user = {
                id:result.response.id,
                authenticated : true
            }
            await connection.query(`insert into member_table (name,gender,email,age_group, user_unique) values ('${result.response.name}','${result.response.gender}','${result.response.email}','${result.response.age}','${result.response.id}')`);
            req.session.save(function(){
                console.log(req.session)
                res.redirect('/my')
            })    
        }else{
            console.log('abcd'+result.response.id)
            req.session.user = {
                id:result.response.id,
                authenticated : true
            }
            req.session.save(function(){
                console.log(req.session)
                res.redirect('/my')
            })
        }
    }catch(err){
        console.log(err)
        res.redirect('/login')
    }
})

module.exports = router;