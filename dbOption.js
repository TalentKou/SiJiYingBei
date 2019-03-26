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
    data.mutant_ids.join(','),
    data.sentence_ids.join(','),
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
}

module.exports = dbOption;
