//app.js
const CONST_WORD_TYPES = [
{
	 id: 1,
	 name: '名词',
	 mutants: []
},
{
	id: 2,
	name: '动词',
	mutants: [
	{
		id: 1,
		name: '基本型'
	},
	{
		id: 2,
		name: 'ます型'
	},
	{
		id: 3,
		name: 'て型'
	},
	{
		id: 4,
		name: 'た型'
	},
	{
		id: 5,
		name: 'ない型'
	}
	]
},
{
	id: 3,
	name: '形容词',
	mutants: [
	{
		id: 1,
		name: 'い形容词'
	},
	{
		id: 2,
		name: 'な形容词'
	}
	]
}
];
new Vue({
	el: "#app",
	data: {
		words: [],
		newWord: {
			origin_id: 0,
			word_type: 1,
			word_meaning: '',
			cur_mutant:  {
			  mutant_id: 1,
			  mutant_word: '',
			  mutant_fake: ''	
			},
			cur_sentence: {
			  sentence_id: 1,
			  content: '',
			  translation: ''	
			},
			mutant_ids: [],
			sentence_ids: [],
		},
		WORD_TYPES: CONST_WORD_TYPES
	},
	computed: {
		mutantTypes: function(){
			var word_type = this.newWord.word_type;
			for(i in CONST_WORD_TYPES){
				if(word_type == CONST_WORD_TYPES[i].id){
				  return CONST_WORD_TYPES[i].mutants;
				}
			}
			return [];
		}
	},
	methods: {
		/*getMutant: function(mutant_id){
		  return {
		    word: '痛い',
	            fakeName: 'いたい',
		  };
		},
                getSentence: function(){ 
			return {
				sentence: '痛いです。',
				translation: '好痛。'
			};
		},*/
		getWords: function(){
			this.$http.get('/get_words').then(function(res){
				var m_words = res.body;
				for(var i in m_words){
				  m_words[i].mutant_ids = m_words[i].mutant_ids.split(',')||[];
				}
				this.words = m_words;
                    console.log(res);    
                },function(){
                    console.log('请求失败处理');
                });
		},
		//添加新原始单词 或者 修改原始单词
		addWords: function(){
			var newW = this.newWord;
			if(newW.word_meaning.trim() == ''){
				alert("请输入完整的单词意思!");
				return;
			}
			if(newW.origin_id == 0){
			this.$http.post('/add_words', 
					{word_type: newW.word_type,
					 word_meaning: newW.word_meaning}, 
					{emulateJSON:true}).then(
				function(res){
					//this.newWord.word_type=1;
					newW.word_meaning='';
					this.getWords();
					console.log(res.body);
				},
				function(res){
					console.log(res.status);
				});
			}else{
			this.$http.post('/update_words', 
					{origin_id: newW.origin_id,
				         word_type: newW.word_type,
					 word_meaning: newW.word_meaning}, 
					{emulateJSON:true}).then(
				function(res){
					//this.newWord.word_type=1;
					newW.origin_id=0;
					newW.word_meaning='';
					this.getWords();
					console.log(res.body);
				},
				function(res){
					console.log(res.status);
				});
			}
			
		},
		//修改原始单词
		updateWord: function(index){
			var upWord = this.words[index];
			this.newWord.origin_id = upWord.origin_id;
			this.newWord.word_type = upWord.word_type;
			this.newWord.word_meaning = upWord.word_meaning;
		},
		//删除原始单词
		deleteWord: function(index){
			var word = this.words[index];
			this.$http.get('/del_words/:' + word.origin_id).then(function(res){
				this.getWords();
                    console.log(res);    
                },function(){
                    console.log('请求失败处理');
                });
		}
	}
});

