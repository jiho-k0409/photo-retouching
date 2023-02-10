const express = require('express');

const router = express.Router()

router.get('/',(req,res)=>{
    res.send(`
        <h1>상호명</h1>
        <a href="#" onClick="alert('구매페이지로 이동될지도')">사진보정 신청하기</a>
        <a href="https://retouch.pictures.kro.kr/login">로그인&회원가입</a>
    `)
})

module.exports = router;