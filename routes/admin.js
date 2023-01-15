const express =require('express');
const fs = require('fs');

const router = express.Router();


router.get('/',(req,res)=>{
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

module.exports = router;