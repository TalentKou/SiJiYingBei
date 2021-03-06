//webOption.js
var dbOption = new (require("./dbOption"))();
//var middleOption = new (require("./middleOption"))();
var express=require("express");
var bodyParser=require("body-parser");

var app=express();
//var multer=require("multer");
//var upload=multer();// for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var lIndex = __dirname.lastIndexOf("/") < 0 ? __dirname.lastIndexOf("\\") : __dirname.lastIndexOf("/");
const mainDir = __dirname.substr(0, lIndex + 1);

app.get("/", function(req, res){
    console.log("Somebody is accessing the homepage: " + mainDir + "client-app/dist/index.html");
    res.sendFile(mainDir + "client-app/dist/index.html");
});

app.get("*.*", function(req, res){
    console.log("Somebody accessed" + req.url);
    res.sendFile(mainDir + "client-app/dist/" + req.url);
});

app.get("/get_any_word", function(req, res){
    console.log("Somebody get a word randomly" + req.url);
    dbOption.getAnyRecord("word_tb", function(error, result){
        console.log("[DATEBASE LOG: ]" + result);
        if(error){
            res.send(error);
        }else{
            res.send(result);
        }
    });
});

/*
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

app.get("/sentcM.html", function(req, res){
    console.log("Somebody accessed" + req.url);
    res.sendFile(mainDir + "nFront/sentcM.html");
});
app.get("/sentcM.js", function(req, res){
    console.log("Somebody accessed" + req.url);
    res.sendFile(mainDir + "nFront/sentcM.js");
});

app.get("/gramM.html", function(req, res){
    console.log("Somebody accessed" + req.url);
    res.sendFile(mainDir + "nFront/gramM.html");
});
app.get("/gramM.js", function(req, res){
    console.log("Somebody accessed" + req.url);
    res.sendFile(mainDir + "nFront/gramM.js");
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
        param = ['word_tb', [
            "word_type",
            "word_self",
            "word_meang",
            "notes"
        ], []];

        for(var i in param[1]){
            param[2].push(data[param[1][i]]||'');
        }

        dbOption.insert(param, function(error, result){
            res.send(error || result);
        });
    }
);

//请求删除单词
app.post("/del_word", upload.array(), function(req, res){
    console.log("Somebody want delete a word: " + req.body.word_id);
    
    var param = ['word_tb', ['word_id'], [req.body.word_id]];

    dbOption.delete(param, function(error, result){
        res.send(error || result);
    });
});

//请求修改旧单词
app.post("/update_word", upload.array(), function(req, res){
    console.log("Somebody want update a word: " + req.body.word_id);
    
    var data = req.body, 
        param = ['word_tb', [
            "word_type",
            "word_self",
            "word_meang",
            "notes"
        ], [], ["word_id"], [data.word_id]];
    
    for(var i in param[1]){
        param[2].push(data[param[1][i]]||'');
    }

    dbOption.update(param, function(error, result){
        res.send(error || result);
    });
});

//请求查询单词
app.post("/get_words", upload.array(), function(req, res){
    console.log("Somebody want get some words: " + req.body.number * req.body.pages);
    
    var data = req.body, 
        param = ['word_tb', 
        data.start || 0, 
        data.pages || 0, 
        data.number || 10];

    dbOption.select(param, function(error, result){
        res.send(error || result);
    });
});

//请求关联单词
app.post("/relate_word", upload.array(), function(req, res){
    console.log("Somebody want relate other word: " + req.body.other_id);
    
    var myself_id = req.body.myself_id,
        other_id = req.body.other_id;

    dbOption.relate([0, myself_id, other_id], function(error, result){
        res.send(error || result);
    });
});

/////////////////////////////////////////////////////////////////////
////////////////句子操作////////////////////////////////////
////////////////////////////////////////////////////////////////////
//请求添加新句子
app.post("/add_sentc", upload.array(), function(req, res){
    console.log("Somebody want add new sentence: " + req.body.sentc_self);
    
    var data = req.body, 
        param = ['sentence_tb', [], []];
    delete data.sentc_id;
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

//请求删除句子
app.post("/del_sentc", upload.array(), function(req, res){
    console.log("Somebody want delete a sentence: " + req.body.sentc_id);
    
    var data = req.body, 
        param = ['sentence_tb', [], []];
    for(var p in data){
        param[1].push(p);
        param[2].push(data[p]);
    }

    dbOption.delete(param, function(error, result){
        res.send(error || result);
    });
});

//请求修改旧句子
app.post("/update_sentc", upload.array(), function(req, res){
    console.log("Somebody want update a sentence: " + req.body.sentc_id);
    
    var data = req.body, 
        param = ['sentence_tb', [], [], [], []];
    delete data.create_time;
    delete data.update_time;
    
    param[3].push("sentc_id");
    param[4].push(data.sentc_id);
    
    delete data.sentc_id;
    for(var p in data){
        param[1].push(p);
        param[2].push(data[p]);
    }

    dbOption.update(param, function(error, result){
        res.send(error || result);
    });
});

//请求查询句子
app.post("/get_sentcs", upload.array(), function(req, res){
    console.log("Somebody want get some sentences: " + req.body.number * req.body.pages);
    
    var data = req.body, 
        param = ['sentence_tb'];
    for(var p in data){
        param.push(data[p]);
    }

    dbOption.select(param, function(error, result){
        res.send(error || result);
    });
});

/////////////////////////////////////////////////////////////
//////////////////////语法操作///////////////////////////////
///////////////////////////////////////////////////////////
//请求添加新语法
app.post("/add_gram", upload.array(), function(req, res){
    console.log("Somebody want add new grammar: " + req.body.gram_title);
    
    var data = req.body, 
        param = ['grammar_tb', [], []];
    delete data.gram_id;
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

//请求删除语法
app.post("/del_gram", upload.array(), function(req, res){
    console.log("Somebody want delete a grammar: " + req.body.gram_id);
    
    var data = req.body, 
        param = ['grammar_tb', [], []];
    for(var p in data){
        param[1].push(p);
        param[2].push(data[p]);
    }

    dbOption.delete(param, function(error, result){
        res.send(error || result);
    });
});

//请求修改旧语法
app.post("/update_gram", upload.array(), function(req, res){
    console.log("Somebody want update a grammar: " + req.body.gram_id);
    
    var data = req.body, 
        param = ['grammar_tb', [], [], [], []];
    delete data.create_time;
    delete data.update_time;
    
    param[3].push("gram_id");
    param[4].push(data.gram_id);
    
    delete data.gram_id;
    for(var p in data){
        param[1].push(p);
        param[2].push(data[p]);
    }

    dbOption.update(param, function(error, result){
        res.send(error || result);
    });
});

//请求查询语法
app.post("/get_gram", upload.array(), function(req, res){
    console.log("Somebody want get some grammars: " + req.body.number * req.body.pages);
    
    var data = req.body, 
        param = ['grammar_tb'];
    for(var p in data){
        param.push(data[p]);
    }

    dbOption.select(param, function(error, result){
        res.send(error || result);
    });
});*/

app.listen(80);

console.log("App running at: \n \
- Local:   http://localhost:8080/ \n \
- Network: http://47.104.67.32:8080/");
