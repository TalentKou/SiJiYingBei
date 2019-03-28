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
 
  res.sendFile(mainDir + "front/origin.html");// index.html");
});

app.get("*app.*", function(req, res){
  console.log("request app.*" + req.url);
  res.sendFile(mainDir + "front/" + req.url);
});
app.get("*origin.*", function(req, res){
  console.log("request origin.*" + req.url);
  res.sendFile(mainDir + "front/" + req.url);
});
app.get("*mutant.*", function(req, res){
  var realUrl = req.url.split('?')[0].split('/')[1];
  console.log("request " + realUrl);
  res.sendFile(mainDir + "front/" + realUrl);
});
app.get("*sentence.*", function(req, res){
  var realUrl = req.url.split('?')[0].split('/')[1];
  console.log("request " + realUrl);
  res.sendFile(mainDir + "front/" + realUrl);
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

//请求获取某条单词信息
app.get("/get_origin:origin_id", function(req, res){
  console.log("Somebody want some origin word" + req.params.origin_id);
  
  dbOption.selectOneOrigin(req.params.origin_id.split(":")[1], function(err, results){
    if(err === 0){
      res.send(results);
      return;
    }
    
    res.send(err);
    console.log(err);
  });  
});

//请求删除某条单词信息
app.get("/del_words:jap_id", function(req, res){
  console.log("Somebody want delete words");
  
  dbOption.deleteOrigin(req.params.jap_id.split(":")[1], function(err, results){
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

/*****************************/
//以下是操作变形单词表的接口内容
/*****************************/

//请求获取相应原始单词的所有变形单词信息
app.get("/get_muts_by_orgn:origin_id", function(req, res){
  console.log("Somebody want mutants for some origin word" + req.params.origin_id);
  
  dbOption.getMorMutsByOrgn(req.params.origin_id.split(":")[1], function(err, results){
    if(err === 0){
      res.send(results);
      return;
    }
    
    res.send(err);
    console.log(err);
  });  
});

//请求获取某条变形单词信息
app.get("/get_mutant:mutant_id", function(req, res){
  console.log("Somebody want some mutant word");
  
  dbOption.selectOneMutant(req.params.mutant_id.split(":")[1], function(err, results){
    if(err === 0){
      res.send(results);
      return;
    }
    
    res.send(err);
    console.log(err);
  });  
});

//请求删除某条变形单词信息
app.get("/del_mutant:mutant_id", function(req, res){
  console.log("Somebody want delete some mutant word");
  var mutant_id = req.params.mutant_id.split(":")[1];
  
  //先根据mutant_id查出相关变形单词
  /*dbOption.selectOneMutant(mutant_id, function(err, results){
    if(err === 0){
      var origin_id = results.body.origin_id;
      return;
    }
    
    res.send(err);
    console.log(err);
  });  */
  
  dbOption.deleteMutant(mutant_id, function(err, results){
    if(err === 0){
      res.send(results);
      return;
    }
    
    res.send(err);
    console.log(err);
  });   
});

//请求插入新的变形单词信息
app.post("/add_mutant", upload.array(), function(req, res){
  console.log("Somebody want add mutant" + req.body.mutant_word);
  
  dbOption.addMutant({
    origin_id: req.body.origin_id,
    mutant_type: req.body.mutant_type,
    mutant_word: req.body.mutant_word,
    mutant_fake: req.body.mutant_fake,
    mutant_sentence_ids: req.body.mut_sentc_ids||[],
  }, function(err, results){
    if(err === 0){
      res.send(results);
      return;
    }
    
    res.send(err);
    console.log(err);
  }); 
});


//请求修改相关变形单词信息
app.post("/update_mutant", upload.array(), function(req, res){
  console.log("Somebody want update some mutant" + req.body.mutant_word);
  
  dbOption.updateMutant ({
    mutant_id: req.body.mutant_id,
    mutant_type: req.body.mutant_type,
    mutant_word: req.body.mutant_word,
    mutant_fake: req.body.mutant_fake,
    mutant_sentence_ids: req.body.mut_sentc_ids||[],
  }, function(err, results){
    if(err === 0){
      res.send(results);
      return;
    }
    
    res.send(err);
    console.log(err);
  }); 
});

/*****************************/
//以下是操作句子表的接口内容
/*****************************/

//请求获取相应原始单词的所有句子信息
app.get("/get_sents_by_orgn:origin_id", function(req, res){
  console.log("Somebody want sentences for some origin word" + req.params.origin_id);
  
  dbOption.getMorSentsByOrgn(req.params.origin_id.split(":")[1], function(err, results){
    if(err === 0){
      res.send(results);
      return;
    }
    
    res.send(err);
    console.log(err);
  });  
});

//请求获取相应变形单词的所有句子信息
app.get("/get_sents_by_mut:mutant_id", function(req, res){
  console.log("Somebody want sentences for some mutant word" + req.params.mutant_id);
  
  dbOption.getMorSentsByMut(req.params.mutant_id.split(":")[1], function(err, results){
    if(err === 0){
      res.send(results);
      return;
    }
    
    res.send(err);
    console.log(err);
  });  
});

//请求获取某条句子信息
app.get("/get_sentence:sentence_id", function(req, res){
  console.log("Somebody want some sentence");
  
  dbOption.selectOneSentence(req.params.sentence_id.split(":")[1], function(err, results){
    if(err === 0){
      res.send(results);
      return;
    }
    
    res.send(err);
    console.log(err);
  });  
});

//请求删除某条句子信息
app.get("/del_sentence:sentence_id", function(req, res){
  console.log("Somebody want delete some sentence");
  
  dbOption.deleteSentence(req.params.sentence_id.split(":")[1], function(err, results){
    if(err === 0){
      res.send(results);
      return;
    }
    
    res.send(err);
    console.log(err);
  });   
});

//请求插入新的句子信息
app.post("/add_sentence", upload.array(), function(req, res){
  console.log("Somebody want add sentence" + req.body.content);
  
  dbOption.addSentence ({
    origin_id: req.body.origin_id,
    mutant_id: req.body.mutant_id,
    content: req.body.content,
    translation: req.body.translation,
    origin_ids: req.body.origin_ids||[],
    mutant_ids: req.body.mutant_ids||[],
    grammar_ids: req.body.grammar_ids||[],
    other_ids: req.body.other_ids||[],
  }, function(err, results){
    if(err === 0){
      res.send(results);
      return;
    }
    
    res.send(err);
    console.log(err);
  }); 
});


//请求修改相关句子信息
app.post("/update_sentence", upload.array(), function(req, res){
  console.log("Somebody want update some sentence" + req.body.content);
  
  dbOption.updateSentence  ({
    sentence_id: req.body.sentence_id,
    content: req.body.content,
    translation: req.body.translation,
    origin_ids: req.body.origin_ids||[],
    mutant_ids: req.body.mutant_ids||[],
    grammar_ids: req.body.grammar_ids||[],
    other_ids: req.body.other_ids||[],
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

