//纯逻辑处理操作
var dbOption = new (require("./dbOption"))();

function middleOption(){

    var that = this;

//关联检查
  /*参数说明:
   *type, //关联者类型：0，单词；1，句子；2，语法。
   *id, //关联者ID
   *relType, //被关联者类型：0，单词；1，句子；2，语法。
   *relIds, //被关联者们IDs
   *callback = function(error, //错误信息
                        newRelIds, //新增关联IDs
                        dumpRelIds){}; //销毁关联IDs
   */
    function relevsCheck(type, id, relType, relIds, callback){
        var fieldName = '',
        newRelIds = [], //新增关联IDs
        dumpRelIds = []; //销毁关联IDs

        switch(relType){
            case 0: fieldName = 'rel_wd_ids';break;
            case 1: fieldName = 'rel_juzi_ids';break;
            case 2: fieldName = 'rel_grm_ids';break;
        }

        //查询关联者
        console.log("call dbOption.selectById:"+type+':'+id);
        dbOption.selectById(type, id, function(error, result){
            if(error){
                console.log('[FROM DATABASE: relevant-' + id + ' NOT FOUND]');
                callback(error);
                return;
            }
            
            var observ = result,
                curRelIds = observ[fieldName].split(','); //当前已关联IDs
            for(var i in relIds){
                if(curRelIds.indexOf(relIds[i]) < 0){
                    newRelIds.push(relIds[i]);
                }
            }
            for(var j in curRelIds){
                if(relIds.indexOf(curRelIds[j]) < 0){
                    dumpRelIds.push(curRelIds[j]);
                }
            }

            callback(null, newRelIds, dumpRelIds);
        });
    }

    //检查大量数据是否存在
    /*参数说明
     *target，目标数组:[[word_id1, word_id2, word_id3, ...],
     *                 [sentc_id1, sentc_id2, sentc_id3, ...],
     *                 [gram_id1, gram_id2, gram_id3, ...]]
     *callback = function(exists){}; 参数为一个与target类似的存在ids的数组。
     */
    this.checkExistc = function(target, callback){
        var sum = target[0].length + target[1].length + target[2].length;
        for(var i = 0; i < 3; i++){
            for(var j = 0; j < target[i].length; j++){
                (function(){
                    var ii = i, jj = j;
                    dbOption.selectById(ii, target[ii][jj], function(error, result){
                        if(error || !result){
                            target[ii][jj] = -1;
                        }

                        --sum;
                        if(sum <= 0){
                            for(var m = 0; m < 3; m++){
                                for(var n = 0; n < target[m].length;){
                                    if(target[m][n] == -1){
                                        target[m].splice(n, 1);
                                    }else{
                                        ++n;
                                    }
                                }
                            }
                            callback(target);
                        }
                    });
                })()
            }
        }
        
    };
    
    
    //修改关联信息
  /*参数说明:
   *type, //关联者类型：0，单词；1，句子；2，语法。
   *id, //关联者ID
   *relType, //被关联者类型：0，单词；1，句子；2，语法。
   *relIds, //被关联者们IDs
   *callback = function(error, result){}; //回调函数：参数传回为数据库模块返回的不加修改的值。
   */
  this.updateRelevs = function(type, id, relType, relIds, callback, noCheck){
    //第一步：检查关联情况
    if(noCheck){
            //添加关联
            addOrRemvRelevs(0, relType, relIds, type, id, function(error){
                callback(error);
            });
            return;
    }

    console.log("call middleOption->relevsCheck:"+type+':'+id+':'+relType+':'+relIds);
    relevsCheck(type, id, relType, relIds, function(error, newRelIds, dumpRelIds){

        if(error == null && newRelIds.length > 0){
            //添加关联
            console.log("call middleOption->addOrRemvRelevs:"+0+':'+relType+':'+newRelIds+':'+type+":"+id);
            addOrRemvRelevs(0, relType, newRelIds, type, id, function(error){
                if(!error && dumpRelIds.length > 0){

                    //移除关联
                    addOrRemvRelevs(1, relType, dumpRelIds, type, id, function(){
                        callback();
                    });
                }else{
                    callback();
                }
            });
        }else{
            callback(error);
        }
    });
};

//添加或移除关联
/*参数说明:
   *opt, //0，添加；1，移除
   *type, //关联者类型：0，单词；1，句子；2，语法。
   *ids, //关联者们IDs
   *relType, //被关联者类型：0，单词；1，句子；2，语法。
   *relId, //被关联者ID
   *callback = function(error, result){}; //回调函数：参数传回为数据库模块返回的不加修改的值。
   */

   function addOrRemvRelevs(opt, type, ids, relType, relId, callback){
    var fieldName = '';
    relId += '';
    switch(relType){
        case 0: fieldName = 'rel_wd_ids';break;
        case 1: fieldName = 'rel_juzi_ids';break;
        case 2: fieldName = 'rel_grm_ids';break;
    }

    if(ids instanceof String){
        ids = ids.split(',');
    }

    if(ids.length <= 0){callback&&callback();}

       //轮流查询关联者
       for(var i in ids){
           (function(){
               var cId = ids[i];
               dbOption.selectById(type, cId, function(error, result, tableName, idFieldName){
                   if(error){
                       console.log('[FROM DATABASE: relevant NOT FOUND]');
                       callback&&callback(error);
                       return;
                    }
    
                    var observ = result;
                    if(opt == 0){
                        observ[fieldName] += ',' + relId;
                    }else{
                        var tempStr = ',' + observ[fieldName] + ',';
                        var index = tempStr.indexOf(',' + relId + ',');
                        if(index = 0){
                            observ[fieldName] = tempStr.substr(relId.length + 2);
                        }else if(index == (tempStr.length - relId.length - 2)){
                            observ[fieldName] = tempStr.substr(1, tempStr.length - relId.length - 3);
                        }else{
                            tempStr = tempStr.split(',' + relId + ',').join(',');
                            observ[fieldName] = tempStr.substr(1, tempStr.length - 2);
                        }
                    }
                    dbOption.update([tableName, [fieldName], [observ[fieldName]], [idFieldName], [cId]],
                        function(){
                            callback&&callback();
                        });
                });
            })();
       }
       
   }
}

module.exports = middleOption;
