function checkLogin(req,res,next){
    if(req.session.user===undefined){
        if(req.url=='/login'||req.url=='/login/callback'){
            next()
        }else{
            res.redirect('/login');
        }
    }else{
        console.log(req.session)
        next()
    }
}

module.exports = checkLogin;