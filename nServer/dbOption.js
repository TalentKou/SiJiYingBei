//只服务于数据库操作
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
            
            callback(error, result);

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
        callback(error, result);

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
            
            callback(error, result);

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
   *        [field1, field2, field3, ...], //查找字段名 
   *        [value1, value2, value3, ...]]; //查找字段值
   *callback = function(error, result){}; //回调函数：参数传回为数据库模块返回的不加修改的值。
   */
  this.select = function(data, callback){

    var sql='SELECT * FROM ' + data[0];

    if(data.length > 1 && data[1].length >= 1){
        sql +=  ' WHERE ';
        for(var i in data[1]){
            sql += data[1][i] + '=' + data[2][i] + ' AND ';
       }
       sql = sql.substr(0, sql.length-5);
    }

    connection.query(sql, function(error, result){
        callback(error, result);

        if(error){
            console.log('[FROM DATABASE: SELECT ERROR] - ',error.message);
            return;
        }

        console.log('[FROM DATABASE: SELECT SUCCEED]');
    });
  };
}

module.exports = dbOption;