var dbOption = new (require("./dbOption"))();
var express=require("express");

var bodyParser=require("body-parser");
var multer=require("multer");
var upload=multer();// for parsing multipart/form-data

var app=express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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

//请求获取所有单词信息
app.get("/get_words", function(req, res){
  console.log("Somebody want words");
  
  dbOption.selectMoreOrigin(function(err, results){
    if(err === 0){
      res.send(results);
      return;
    }
    
    res.send(err);
    console.log(err);
  });  
});

//请求删除某条单词信息
app.get("/del_words/:jap_id", function(req, res){
  console.log("Somebody want delete words");
  
  dbOption.deleteOrigin(req.params.jap_id[1], function(err, results){
    if(err === 0){
      res.send(results);
      return;
    }
    
    res.send(err);
    console.log(err);
  });   
});

//请求插入新的单词信息
app.post("/add_words", upload.array(), function(req, res){
  console.log("Somebody want add words" + req.body.word_meaning);
  
  dbOption.addOrigin({
    word_type: req.body.word_type,
    word_meaning: req.body.word_meaning,
    mutant_ids: req.body.mutant_ids||[],
    sentence_ids: req.body.sentence_ids||[],
  }, function(err, results){
    if(err === 0){
      res.send(results);
      return;
    }
    
    res.send(err);
    console.log(err);
  }); 
});


//请求修改相关单词信息
app.post("/update_words", upload.array(), function(req, res){
  console.log("Somebody want update words" + req.body.word_meaning);
  
  dbOption.updateOrigin ({
    origin_id: req.body.origin_id,
    word_type: req.body.word_type,
    word_meaning: req.body.word_meaning,
    mutant_ids: req.body.mutant_ids||[],
    sentence_ids: req.body.sentence_ids||[],
  }, function(err, results){
    if(err === 0){
      res.send(results);
      return;
    }
    
    res.send(err);
    console.log(err);
  }); 
});

app.listen(80);

console.log("47.104.67.32");

