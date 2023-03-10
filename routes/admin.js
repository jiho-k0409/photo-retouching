const express = require("express");
const fs = require("fs");
const dbConf = require("../db");
const multerConf = require("../admin_multer_conf");

const router = express.Router();

router
  .get("/", async (req, res) => {
    if(req.session.user.id==='E-Fwnqc0BxL-kckC91PQlxo9Vcms1TDkgPWi6h8diyA'||req.session.user.id==='_QqIFPWdImO5-vawEln5tW0wpeknPKbd2UNeLAC8Kvg'){
      console.log("good");
      folders = fs.readdirSync("client_uploads");
      let fileList = [];
      for (let i = 0; i < folders.length; i++) {
        let file = fs.readdirSync(`./client_uploads/${folders[i]}`);
        const result = await searchNameEmail(folders,i);
        console.log(result);
        fileList.push({
          name: result[0].name,
          files: file,
          email: result[0].email,
        });
      }
      res.render("admin" , { fileList: fileList });
    }else{
      console.log(req.get('X-Real-IP'))
      res.redirect('/my')
    }
    
  })
  .post("/", multerConf.array("result", 12), (req, res) => {
    res.redirect("/admin");
  });

const searchNameEmail = async(folders,i)=>{
  const connection = await dbConf();
  let[result] = await connection.query(`select name,email from member_table where user_unique='${folders[i]}'`)
  return result
}


module.exports = router;
