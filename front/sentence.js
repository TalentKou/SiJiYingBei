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
	el: "#sentence",
	data: {
		originWord: {
			origin_id: 0,
			word_type: 0,
			word_meaning: ''
		},
		mutantWord: {
			mutant_id: 0,
			mutant_type: 1,
			mutant_word: '',
			mutant_fake: '',
                        mut_sentc_ids: []
		},
                newSentence: {
                        sentence_id: 0,
			origin_id: 0,
			mutant_id: 0,
                        content: '',
                        translation: "",
                },
		sentences: [],
		WORD_TYPES: CONST_WORD_TYPES
	},
	beforeMount: function(){
		  var mutantId = window.location.href.split("=")[1];
			this.mutantWord.mutant_id = mutantId;
		        this.newSentence.mutant_id = mutantId;
		
				//获取变形单词信息
			this.$http.get('/get_mutant:' + mutantId).then(function(res){
				var m_words = res.body;
				for(var i in m_words){
                                  if(m_words[i].mutant_sentence_ids.trim() == ""){
                                    m_words[i].mutant_sentence_ids = [];
                                  }else{
				    m_words[i].mutant_sentence_ids = m_words[i].mutant_sentence_ids.split(',');
				  }
                                } 
				this.mutantWord = m_words[0] || {};
				this.newSentence.origin_id = this.mutantWord.origin_id;
                                console.log(res);    
				
				//获取原始单词信息
				this.$http.get('/get_origin:' + this.mutantWord.origin_id).then(function(res){
				var mm_words = res.body;
				for(var i in mm_words){
                                  if(mm_words[i].mutant_ids.trim() == ""){
                                    mm_words[i].mutant_ids = [];
                                  }else{
				    mm_words[i].mutant_ids = mm_words[i].mutant_ids.split(',');
				  }
                                } 
				this.originWord = mm_words[0] || {};
                    console.log(res);    
								
                },function(){
                    console.log('请求失败处理:获取原始单词信息失败');
                });
				
                },function(){
                    console.log('请求失败处理:获取变形单词信息失败');
                });
		},
	computed: {
		mutantTypes: function(){
			var word_type = this.originWord.word_type;
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
    //以下为操作句子的方法
		/************************************/

		//获取大量句子
		getSentences: function(){
		this.$http.get('/get_sents_by_mut:' + this.mutantWord.mutant_id).then(function(res){
			this.sentences =  res.body;
                        console.log(res);
		},function(){
			console.log('请求失败处理');
                });
		},
		
		//添加句子 或者 修改句子
		addSentence: function(){
			var sentence = this.newSentence;
			if(sentence.content.trim() == '' || 
			   sentence.translation.trim() == ''){
				alert("请输入完整的句子(翻译)!");
				return;
			}

			var url = '';

			if(sentence.sentence_id == 0){
				url = '/add_sentence';
			}else{
				url = '/update_sentence';
			}

			this.$http.post(url, sentence, {emulateJSON:true}).then(
				function(res){
					this.resetNewSentence();
					this.getSentences();
					console.log(res.body);
				},
				function(res){
					console.log(res.status);
				});
		},
		
		//修改句子
		updateSentence: function(index){
			this.newSentence = this.sentences[index];
		},
		//删除句子
		deleteSentence: function(index){
			var sentence = this.sentences[index];
			this.$http.get('/del_sentence:' + sentence.sentence_id).then(function(res){
				this.getSentences();
                    console.log(res);    
                },function(){
                    console.log('请求失败处理');
                });
		},

		/***********************************/
    //以下为数据还原的方法
		/************************************/

		//彻底重置新变形数据
		resetNewSentence: function(){
			this.newSentence = {
                        sentence_id: 0,
			origin_id: this.originWord.origin_id,
			mutant_id: this.mutantWord.mutant_id,
                        content: '',
                        translation: ""
		};
		}
	}
});
