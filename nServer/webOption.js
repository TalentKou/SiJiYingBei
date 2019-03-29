//webOption.js
var dbOption = new (require("./dbOption"))();
var express=require("express");
var bodyParser=require("body-parser");

var app=express();
var multer=require("multer");
var upload=multer();// for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const mainDir = "/root/SiJiYingBei/";

app.get("/", function(req, res){
    console.log("Somebody accessed" + req.url);
    res.sendFile(mainDir + "nFront/wordM.html");
});

app.get("/wordM.html", function(req, res){
    console.log("Somebody accessed" + req.url);
    res.sendFile(mainDir + "nFront/wordM.html");
});
app.get("/wordM.js", function(req, res){
    console.log("Somebody accessed" + req.url);
    res.sendFile(mainDir + "nFront/wordM.js");
});

app.get("/vue.min.js", function(req, res){
    console.log("Somebody accessed" + req.url);
    res.sendFile(mainDir + "node_modules/vue/dist/vue.min.js");
});

//请求添加新单词
app.post("/add_word", upload.array(), function(req, res){
    console.log("Somebody want add new word: " + req.body.word_self);
    
    var data = req.body, 
        param = ['word_tb', [], []];
    delete data.word_id;
    for(var p in data){
        param[1].push(p);
        param[2].push(data[p]);
    }

    dbOption.insert(param, function(err, res){
        res.send(err || res);
    });
});

//请求删除单词
app.post("/del_word", upload.array(), function(req, res){
    console.log("Somebody want delete a word: " + req.body.word_id);
    
    var data = req.body, 
        param = ['word_tb', [], []];
    for(var p in data){
        param[1].push(p);
        param[2].push(data[p]);
    }

    dbOption.delete(param, function(err, res){
        res.send(err || res);
    });
});

//请求修改旧单词
app.post("/update_word", upload.array(), function(req, res){
    console.log("Somebody want update a word: " + req.body.word_id);
    
    var data = req.body, 
        param = ['word_tb', [], []];
    for(var p in data){
        param[1].push(p);
        param[2].push(data[p]);
    }

    dbOption.delete(param, function(err, res){
        res.send(err || res);
    });
});

//请求查询单词
app.post("/get_words", upload.array(), function(req, res){
    console.log("Somebody want get some words: " + req.body.number * req.body.pages);
    
    var data = req.body, 
        param = ['word_tb'];
    for(var p in data){
        param.push(data[p]);
    }

    dbOption.select(param, function(err, res){
        res.send(err || res);
    });
});
