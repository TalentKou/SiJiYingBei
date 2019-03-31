//wordM.js
const CONST_WORD_TYPES = [
    {id: 1, name: '名词'},
    {id: 2, name: '动词基本型'},
    {id: 3, name: '动词ます型'},
    {id: 4, name: '动词て型'},
    {id: 5, name: '动词た型'},
    {id: 6, name: '动词ない型'},
    {id: 7, name: 'い形容词'},
    {id: 8, name: 'な形容词'},
    {id: 9, name: '副词'},
    {id: 10, name: '助词'},
];

new Vue({
    el: '#wordM',
    data: {
        sum: 0,
        word: {
            word_id: 0,
            word_type: 1,
            word_self: '',
            word_meang: '',
            rel_wd_ids: '',
            rel_juzi_ids: '',
            rel_grm_ids: '',
            notes: '',
        },
        words: [],
        pagin: {
            start: 0,//从第一页开始
            pages: 1,//只返回一页
            number: 10, //每页十个单词
        },
        WORD_TYPES: CONST_WORD_TYPES
    },
    directives: {
        // 注册一个局部的自定义指令 v-relevid
        relevid: {
          // 指令的定义
          inserted: function (el) {
            el.onkeyup = function(elem){
		if(isNaN(parseInt(elem.key))){
		    elem.key = "";
		}
            };
            el.onblur = function(elem){
                var value = elem.target.value.trim();
                if(value.length > 0){
                    var strArr = value.split(',');
                    for(var i = 0; i < strArr.length;){
                        if(strArr[i].trim() == ''){
                            strArr.splice(i, 1);
                            continue;
                        }
                        strArr[i] = new Number(strArr[i]);
                        i++;
                    }
                    elem.target.value = strArr.join(',');
                }else{
                    elem.target.value = value;
                }
            };
          }
        }
    },
	beforeMount: function(){
		this.getWords();
	},
    methods: {
        //添加新单词
        addWord: function(){
            var word = this.word;
            if(word.word_self.trim() == '' ||
               word.word_meang.trim() == ''){
				alert("请输入完整的单词和意思!");
				return;
            }
            
			this.$http.post('/add_word', word, 
					{emulateJSON:true}).then(
				function(res){
					this.resetWord();
					this.getWords();
					console.log(res.body);
				},
				function(res){
					console.log(res.status);
				});
        },

        //删除单词
        deleteWord: function(id){
            this.$http.post('/del_word', 
            {word_id: id}, 
            {emulateJSON:true}).then(
                function(res){
                    this.getWords();
                    console.log(res);    
                },function(res){
                    console.log(res);
                });
        },

        //修改旧单词
        updateWord: function(index){
            this.word = this.words[index];
        },

        //提交修改
        submitUpdate: function(){
            var word = this.word;
            if(word.word_self.trim() == '' ||
               word.word_meang.trim() == ''){
				alert("请输入完整的单词和意思!");
				return;
            }
            
			this.$http.post('/update_word', word, 
					{emulateJSON:true}).then(
				function(res){
					this.resetWord();
					this.getWords();
					console.log(res.body);
				},
				function(res){
					console.log(res.status);
				});
        },

        //查询单词
        getWords: function(){
            var that = this;
            this.$http.post('/get_words', this.pagin,
            {emulateJSON:true}).then(
                function(res){
                    that.words = res.body;
                    console.log(res);    
                },function(res){
                    console.log(res);
                });
        },

        //向上翻页
        pageUp:function(){
            --this.pagin.start;
            this.getWords();
        },

        //向下翻页
        pageDown:function(){
            ++this.pagin.start;
            this.getWords();
        },

        //重置word对象
        resetWord: function(){
            this.word = {
                word_id: 0,
                word_type: 1,
                word_self: '',
                word_meang: '',
                rel_wd_ids: '',
                rel_juzi_ids: '',
                rel_grm_ids: '',
                notes: '',
            };
        }
    }
});
