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

app.get("/", function(req, res){
  console.log("Somebody accessed");
  
  res.sendFile("/root/SiJiYingBei/SiJiYingBei/test.html");
  /*
  connection.query("SELECT * FROM jap_words", function(error, results, fields){
    if(error){
      console.log(error);
      return;
    }
    
    console.log(results);
  });*/
});

app.listen(80);
