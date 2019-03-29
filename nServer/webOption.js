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
app.get("/vue-resource.min.js", function(req, res){
    console.log("Somebody accessed" + req.url);
    res.sendFile(mainDir + "node_modules/vue-resource/dist/vue-resource.min.js");
});

//请求添加新单词
app.post("/add_word", upload.array(), function(req, res){
    console.log("Somebody want add new word: " + req.body.word_self);
    
    var data = req.body, 
        param = ['word_tb', [], []];
    delete data.word_id;
    delete data.create_time;
    delete data.update_time;
    for(var p in data){
        param[1].push(p);
        param[2].push(data[p]);
    }

    dbOption.insert(param, function(error, result){
        res.send(error || result);
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

    dbOption.delete(param, function(error, result){
        res.send(error || result);
    });
});

//请求修改旧单词
app.post("/update_word", upload.array(), function(req, res){
    console.log("Somebody want update a word: " + req.body.word_id);
    
    var data = req.body, 
        param = ['word_tb', [], [], [], []];
    delete data.create_time;
    delete data.update_time;
    
    param[3].push("word_id");
    param[4].push(data.word_id);
    
    delete data.word_id;
    for(var p in data){
        param[1].push(p);
        param[2].push(data[p]);
    }

    dbOption.update(param, function(error, result){
        res.send(error || result);
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

    dbOption.select(param, function(error, result){
        res.send(error || result);
    });
});

app.listen(80);

console.log("47.104.67.32");
