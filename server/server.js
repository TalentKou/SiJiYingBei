var mysql=require("mysql");
var express=require("express");
var app=express();
var connection=mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "159-357-Talent",
  database: "WORDS"
});

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
    console.log(results);
  });
  
});

app.get("/add_words", function(req, res){
  console.log("Somebody want add words");
  
  connection.query("INSERT INTO jap_words(jap_hanzi, jap_jiaming, jap_yisi, jap_juzi) VALUES(?,?,?,?)", 
                   ['漢字', 'かんじ','汉字', '漢字は面白いです。（汉字是很有意思的。）'],
                   function(error, result){
                     if(error){
                       console.log('[INSERT ERROR] - ',error.message);
                       return;
                     }
    
                     console.log('INSERT ID:',result.jap_id);
  });
});

app.listen(80);

console.log("47.104.67.32");

