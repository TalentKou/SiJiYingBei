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
  
  //插入新数据
  /*参数说明:
   *data = [table_name, //表名
   *        [field1, field2, field3, ...], //字段名 
   *        [value1, value2, value3, ...]]; //字段值
   *callback = function(error, result){}; //回调函数：参数传回为数据库模块返回的不加修改的值。
   */
  this.insert = function(data, callback){

    var sql='INSERT INTO ' + data[0] + '(' + data[1].join(',') + ') VALUES(';
    for(var i in data[1]){
        sql += '?,';
    }
    sql = sql.substr(0, sql.length-1) + ')';

    connection.query(sql, data[2],
        function(error, result){
            
            callback&&callback(error, result);

            if(error){
                console.log('[FROM DATABASE: INSERT ERROR] - ',error.message);
                return;
            }

            console.log('[FROM DATABASE: INSERT ID: ',result.insertId +' ]');
        });
  };

  //删除指定数据
  /*参数说明:
   *data = [table_name, //表名
   *        [field1, field2, field3, ...], //查找字段名 
   *        [value1, value2, value3, ...]]; //查找字段值
   *callback = function(error, result){}; //回调函数：参数传回为数据库模块返回的不加修改的值。
   */
  this.delete = function(data, callback){

    var sql='DELETE FROM ' + data[0] + ' WHERE ';

    for(var i in data[1]){
        sql += data[1][i] + '=' + data[2][i] + ' AND ';
    }
    sql = sql.substr(0, sql.length-5);

    connection.query(sql, function(error, result){
        callback&&callback(error, result);

        if(error){
            console.log('[FROM DATABASE: DELETE ERROR] - ',error.message);
            return;
        }

        console.log('[FROM DATABASE: DELETE SUCCEED]');
    });
  };
  
  //修改旧数据
  /*参数说明:
   *data = [table_name, //表名
   *        [field1, field2, field3, ...], //修改字段名 
   *        [value1, value2, value3, ...], //修改字段值
   *        [field1, field2, field3, ...], //查找字段名 
   *        [field1, field2, field3, ...], //查找字段名
   *callback = function(error, result){}; //回调函数：参数传回为数据库模块返回的不加修改的值。
   */
  this.update = function(data, callback){

    var sql='UPDATE ' + data[0] + ' SET ' + data[1].join(' = ?,') + ' = ? WHERE ' + data[3].join(' = ?,') + ' = ?';

    connection.query(sql, data[2].concat(data[4]),
        function(error, result){
            
            callback&&callback(error, result);

            if(error){
                console.log('[FROM DATABASE: UPDATE ERROR] - ',error.message);
                return;
            }

            console.log('[FROM DATABASE: UPDATE affectedRows: ' + result.affectedRows +' ]');
        });
  };

  //查找指定数据
  /*参数说明:
   *data = [table_name, //表名 
   *        start, //开始页数, 必须>=0，且start=0为第一页
   *        pages, //查询页数, 必须>=0，且pages=0表示查询从start开始的所有数据
   *        number, //每页单词数，必须>=1
   *@useless[field1, field2, field3, ...], //查找字段名 
   *@useless[value1, value2, value3, ...]]; //查找字段值
   *callback = function(error, result){}; //回调函数：参数传回为数据库模块返回的不加修改的值。
   */
  this.select = function(data, callback){

    var sql = '';
    if(data[1] == 0){
        if(data[2] == 0){
            sql = 'SELECT * FROM ' + data[0];
        }else{
            sql = 'SELECT * FROM ' + data[0] + ' LIMIT 0,' + data[2]*data[3];
        }
    }else{
        if(data[2] == 0){
            sql = 'SELECT * FROM ' + data[0] + ' LIMIT ' + data[1]*data[3] + ',10000';
        }else{
            sql = 'SELECT * FROM ' + data[0] + ' LIMIT ' + data[1]*data[3] + ',' + data[2]*data[3];
        }
    }

    connection.query(sql, function(error, result){
        callback&&callback(error, result);

        if(error){
            console.log('[FROM DATABASE: SELECT ERROR] - ',error.message);
            return;
        }

        console.log('[FROM DATABASE: SELECT SUCCEED]');
    });
  };

  //根据ID查找指定数据
  /*参数说明:
   *table_type, //表类型：0，单词；1，句子；2，语法。
   *        id, //查询ID
   *callback = function(error, result, tableName, fieldName){}; //回调函数：参数传回为数据库模块返回的不加修改的值。
   */
  this.selectById = function(table_type, id, callback){

    var sql = 'SELECT * FROM ', tableName = '', fieldName = '';
    switch(table_type){
        case 0: sql += (tableName='word_tb') + ' WHERE ' + (fieldName='word_id');break;
        case 1: sql += (tableName='sentence_tb') + ' WHERE ' + (fieldName='sentc_id');break;
        case 2: sql += (tableName='grammar_tb') + ' WHERE ' + (fieldName='gram_id');break;
    }

    sql += '=' + id;

    connection.query(sql, function(error, result){
        callback&&callback(error, result&&result[0], tableName, fieldName);

        if(error){
            console.log('[FROM DATABASE: SELECT ERROR] - ',error.message);
            return;
        }

        console.log('[FROM DATABASE: SELECT SUCCEED]');
    });
  };

  //根据类型关联数据
  /**参数说明：
   * data: [type, //表类型：0，单词；1，句子；2，语法。
   *        myself_id, //关联者ID
   *        other_id] //被关联者ID
   * callback: function(error, result){}
   */
  this.relate = function(data, callback){
    var state = [0, 0], 
        myself = null, 
        other = null;  
    this.selectById(data[0], data[1], function(error, result){
    
        state[0] = (error ? -1 : 1);
        myself = result;
        proc(error);
    });

    this.selectById(data[0], data[2], function(error, result){
       
        state[1] = (error ? -1 : 1);
        other = result;
        proc(error);
    });

    var that = this;
    function proc(error){
        if(state[0] == 1 && state[1] == 1){
            var fieldName = '', tableName = '', updateField = '';
            switch(data[0]){
                case 0: {
                    fieldName='word_id';
                    tableName='word_tb';
                    updateField='rel_wd_ids';
                    break;
                }
                case 1: {
                    fieldName='sentc_id';
                    tableName='sentence_tb';
                    updateField='rel_juzi_ids';
                    break;
                }
                case 2: {
                    fieldName='gram_id';
                    tableName='grammar_tb';
                    updateField='rel_grm_ids';
                    break;
                }
            }
            myself[updateField] += (myself[updateField] == '' ? '' : ',') + data[2];
            other[updateField] += (other[updateField] == '' ? '' : ',') + data[1];

            that.update([tableName, 
                [updateField], 
                [myself[updateField]], 
                [fieldName], [data[1]]], callback);

            that.update([tableName, 
                [updateField], 
                [other[updateField]], 
                [fieldName], [data[2]]], callback);
        }else if(state[0] == -1 || state[1] == -1){
            callback(error);
        }else{
            //still waiting ... 
        }
    }
  };

  //从指定表中随机获取一条数据
  this.getAnyRecord = function(table_name, callback){
      var sql = "SELECT FLOOR(RAND()*COUNT(*)) AS offset FROM " + table_name;
      console.log("[DATABASE SQL: ]" + sql);
      connection.query(sql, function(error, result){
          if(error){
            console.log("[DATABASE ERROR: ]" + error);
            callback&&callback(error);
            return;
          }

          sql = "SELECT * FROM " + table_name + " LIMIT 1 OFFSET " + result[0].offset;
          console.log("[DATABASE SQL: ]" + sql);
          connection.query(sql, callback);
      });
  };
}

module.exports = dbOption;
