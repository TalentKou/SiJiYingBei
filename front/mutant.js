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
	el: "#mutant",
	data: {
		originWord: {
			origin_id: 0,
			word_type: 1,
			word_meaning: '',
			mutant_ids: [],
			sentence_ids: []
		},
		newMutant: {
			mutant_id: 0,
			mutant_type: 1,
			mutant_word: '',
			mutant_fake: '',
			mut_sentc_ids: []
		},
		WORD_TYPES: CONST_WORD_TYPES
	},
	computed: {
		originWordCom: function(){
		  var originId = window.location.href.split("=")[1];
			this.originWord.origin_id = originId;
			this.$http.get('/get_origin:' + originId).then(function(res){
				var m_words = res.body;
				for(var i in m_words){
                                  if(m_words[i].mutant_ids.trim() == ""){
                                    m_words[i].mutant_ids = [];
                                  }else{
				    m_words[i].mutant_ids = m_words[i].mutant_ids.split(',');
				  }
                                } 
				this.originWord = m_words;
                    console.log(res);    
                },function(){
                    console.log('请求失败处理');
                });
		},
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
		/***********************************/
    //以下为操作变形单词的方法
		/************************************/

		//获取大量变形单词
		getMutants: function(){},
		
		//添加变形单词 或者 修改变形单词
		addMutant: function(){
			var mutant = this.newMutant;
			if(mutant.mutant_word.trim() == '' || 
			mutant.mutant_fake.trim() == ''){
				alert("请输入完整的单词(假名)意思!");
				return;
			}

			var url = '', data = {
				mutant_type: mutant.mutant_type,
				mutant_word: mutant.mutant_word,
				mutant_fake: mutant.mutant_fake,
				mut_sentc_ids: mutant.mut_sentc_ids,
			};

			if(mutant.mutant_id == 0){
				url = '/add_mutant';
				data.origin_id = this.originWord.origin_id;
			}else{
				url = '/update_mutant';
				data.mutant_id = mutant.mutant_id;
			}

			this.$http.post(url, data, {emulateJSON:true}).then(
				function(res){
					this.resetNewMutant();
					this.getMutants();
					console.log(res.body);
				},
				function(res){
					console.log(res.status);
				});
		},


		/***********************************/
    //以下为数据还原的方法
		/************************************/

		//彻底重置新变形数据
		resetNewMutant: function(){
		}
	}
});
