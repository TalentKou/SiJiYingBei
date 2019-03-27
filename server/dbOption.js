//数据库操作模块
var mysql=require("mysql");

var connection=mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "159-357-Talent",
  database: "japanese_db"
});

connection.connect();

function dbOption(){
  
  //原始单词表操作方法
 
  //添加原始数据
  /*data = {
    word_type: 1,
    word_meaning: '痛苦的',
    mutant_ids: [0001, 0002, ...],
    sentence_ids: [0001, 0002, ...],
  }*/
  this.addOrigin = function(data, callback){
    var addSql='INSERT INTO origin_table(word_type, word_meaning, mutant_ids, sentence_ids) VALUES(?,?,?,?)';
    var addSqlParams=[data.word_type,
    data.word_meaning,
    data.mutant_ids.join(","),
    data.sentence_ids.join(",")];
    connection.query(addSql, addSqlParams,
                   function(error, result){
                     if(error){
                       console.log('[INSERT ERROR] - ',error.message);
                       callback(error);
                       return;
                     }
    
                     console.log('INSERT ID:',result.insertId);
                     callback(0, result);
                   });
  };
  
  //删除原始数据
  this.deleteOrigin = function(origin_id, callback){
    connection.query("DELETE FROM origin_table where origin_id=" + origin_id, function(error, result){
    if(error){
      console.log('[DELETE ERROR] - ',error.message);
      callback(error);
      return;
    }
    console.log('DELETE SUCCEED');
    callback(0, result);
   });
  };
  
  //修改原始数据
  /*data = {
    origin_id: 1,
    word_type: 1,
    word_meaning: '痛苦的',
    mutant_ids: [0001, 0002, ...],
    sentence_ids: [0001, 0002, ...],
  }*/
  this.updateOrigin = function(data, callback){
    var modSql = 'UPDATE origin_table SET word_type = ?,word_meaning = ?,mutant_ids = ?,sentence_ids = ? WHERE origin_id = ?';
    var modSqlParams = [data.word_type, 
    data.word_meaning,
    ((data.mutant_ids instanceof String) ? data.mutant_ids : data.mutant_ids.join(',')),
    ((data.sentence_ids instanceof String) ? data.sentence_ids : data.sentence_ids.join(',')),
    data.origin_id];
    //改
    connection.query(modSql, modSqlParams, function (err, result) {
      if(err){
         console.log('[UPDATE ERROR] - ',err.message);
         callback(err);
         return;
      }        
      
      console.log('UPDATE affectedRows',result.affectedRows);
      callback(0, result);
     });
  };
  
  //查询单条原始数据
  this.selectOneOrigin = function(origin_id, callback){
    connection.query("SELECT * FROM origin_table where origin_id=" + origin_id, function(error, result){
    if(error){
      console.log('[SELECT ERROR] - ',error.message);
      callback(error);
      return;
    }
    
    callback(0, result);
   });
  };
  
  //查询多条原始数据
  this.selectMoreOrigin = function(callback){
    connection.query("SELECT * FROM origin_table", function(error, result){
    if(error){
      console.log('[SELECT ERROR] - ',error.message);
      callback(error);
      return;
    }
    
    callback(0, result);
   });
  };

    //添加变形单词数据
  /*data = {
    origin_id: 1,
    mutant_type: 1,
    mutant_word: '私',
    mutant_fake: 'わたし',
    mutant_sentence_ids: [0001, 0002, ...],
  }*/
  this.addMutant = function(data, callback){
    var addSql='INSERT INTO mutant_table(origin_id, mutant_type, mutant_word, mutant_fake, mutant_sentence_ids) VALUES(?,?,?,?,?)';
    var addSqlParams=[data.origin_id,
    data.mutant_type,
    data.mutant_word,
    data.mutant_fake,
    data.mutant_sentence_ids.join(","),];
    var that = this;
    connection.query(addSql, addSqlParams,
                   function(error, result){
                     if(error){
                       console.log('[INSERT ERROR] - ',error.message);
                       callback(error);
                       return;
                     }
    
                     console.log('INSERT ID:',result.insertId);
                     var insertMutId = result.insertId+"";

                     //添加变形单词成功，则查询相关原型单词，并写入该变形单词的id
                     that.selectOneOrigin(addSqlParams[0], function(err, res){
                       if(err === 0){
                         var mutant_ids = res[0].mutant_ids;
                         if(mutant_ids.indexOf(insertMutId) < 0){
                           mutant_ids += "," + insertMutId;
                           res[0].mutant_ids = mutant_ids;
                           that.updateOrigin(res[0], function(){});
                         }
                         console.log(mutant_ids);
                       }
                     });

                     callback(0, result);
                   });
  };

    //删除变形单词数据
    this.deleteMutant = function(mutant_id, callback){
      connection.query("DELETE FROM mutant_table where mutant_id=" + mutant_id, function(error, result){
      if(error){
        console.log('[DELETE ERROR] - ',error.message);
        callback(error);
        return;
      }
      console.log('DELETE SUCCEED');
      callback(0, result);
     });
    };

    //修改变形单词数据
  /*data = {
    mutant_id: 1,
    mutant_type: 1,
    mutant_word: '私',
    mutant_fake: 'わたし',
    mutant_sentence_ids: [0001, 0002, ...],
  }*/
  this.updateMutant = function(data, callback){
    var modSql = 'UPDATE mutant_table SET mutant_type = ?,mutant_word = ?,mutant_fake = ?,mutant_sentence_ids = ? WHERE mutant_id = ?';
    var modSqlParams = [data.mutant_type, 
    data.mutant_word,
    data.mutant_fake,
    data.mutant_sentence_ids.join(','),
    data.mutant_id];
    //改
    connection.query(modSql, modSqlParams, function (err, result) {
      if(err){
         console.log('[UPDATE ERROR] - ',err.message);
         callback(err);
         return;
      }        
      
      console.log('UPDATE affectedRows',result.affectedRows);
      callback(0, result);
     });
  };

    //查询单条变形单词数据
    this.selectOneMutant = function(mutant_id, callback){
      connection.query("SELECT * FROM mutant_table where mutant_id=" + mutant_id, function(error, result){
      if(error){
        console.log('[SELECT ERROR] - ',error.message);
        callback(error);
        return;
      }
      
      callback(0, result);
     });
    };
    
    //查询相应原始单词的多条变形单词数据
    this.getMorMutsByOrgn = function(origin_id, callback){
      connection.query("SELECT * FROM mutant_table where origin_id=" + origin_id, function(error, result){
      if(error){
        console.log('[SELECT ERROR] - ',error.message);
        callback(error);
        return;
      }
      
      callback(0, result);
     });
    };
}

module.exports = dbOption;
