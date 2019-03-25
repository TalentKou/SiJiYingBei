var mysql=require("mysql");
var express=require("express");

var bodyParser=require("body-parser");
var multer=require("multer");
var upload=multer();// for parsing multipart/form-data

var app=express();
var connection=mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "159-357-Talent",
  database: "WORDS"
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

connection.connect();
const mainDir = "/root/SiJiYingBei/";

app.get("/", function(req, res){
  console.log("Somebody accessed" + req.url);
 
  res.sendFile(mainDir + "front/index.html");
});

app.get("*app.*", function(req, res){
  console.log("request app.*" + req.url);
  res.sendFile(mainDir + "front/" + req.url);
});

app.get("*vue*", function(req, res){
  console.log("request vue*" + req.url);
  var moduleName = req.url.split(".")[0];
  res.sendFile(mainDir + "node_modules/"+ moduleName  +"/dist/" + moduleName + ".min.js");
});

app.get("/get_words", function(req, res){
  console.log("Somebody want words");
  
  connection.query("SELECT * FROM jap_words", function(error, results, fields){
    if(error){
      console.log(error);
      return;
    }
    res.send(results);
    //console.log(results);
  });
  
});

app.post("/add_words", upload.array(), function(req, res){
  console.log("Somebody want add words" + req.body.jap_hanzi);
  var addSql='INSERT INTO jap_words(jap_hanzi, jap_jaming, jap_yisi, jap_juzi) VALUES(?,?,?,?)';
  var d=req.body;
  var addSqlParams=[d.jap_hanzi,d.jap_jaming,d.jap_yisi,d.jap_juzi];
  connection.query(addSql, addSqlParams,
                   function(error, result){
                     if(error){
                       console.log('[INSERT ERROR] - ',error.message);
                       return;
                     }
    
                     console.log('INSERT ID:',result.insertId);
                     res.send(result);
  });
});

app.listen(80);

console.log("47.104.67.32");

