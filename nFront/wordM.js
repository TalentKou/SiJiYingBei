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
        WORD_TYPES: CONST_WORD_TYPES
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
            this.$http.get('/del_word:' + id).then(
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
