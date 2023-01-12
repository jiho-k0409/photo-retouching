let authNum = prompt('인증번호를 입력하세요');

function propmptRoop(){
    if(authNum==null){
        authNum=prompt('인증번호를 입력하세요')
    }
}

function auth(){
    fetch('/auth',{
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({number:authNum})
    })
}

auth()