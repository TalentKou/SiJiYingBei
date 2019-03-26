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
			origin_id: 1,
			word_type: 1,
			word_meaning: '痛苦的',
			mutant_id: 1,
			mutant_ids: [1,2,3,4],
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
		getMutant: function(mutant_id){
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
		},
		getWords: function(){
			this.$http.get('/get_words').then(function(res){
				this.words = res.body;
                    console.log(res);    
                },function(){
                    console.log('请求失败处理');
                });
		},
		//添加新原始单词
		addWords: function(){
			this.$http.post('/add_words', 
					{word_type: this.newWord.word_type,
					 word_meaning: this.newWord.word_meaning}, 
					{emulateJSON:true}).then(
				function(res){
					//this.newWord.word_type=1;
					this.newWord.word_meaning='';
					console.log(res.body);
				},
				function(res){
					console.log(res.status);
				});
		},
		deleteWord: function(index){
			var word = this.words[index];
			this.$http.get('/del_words/:jap_id' + word.jap_id).then(function(res){
				this.getWords();
                    console.log(res);    
                },function(){
                    console.log('请求失败处理');
                });
		}
	}
});

