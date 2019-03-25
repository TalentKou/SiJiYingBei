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

app.listen(80);

console.log("47.104.67.32");

