//app.js

new Vue({
	el: "#app",
	data: {
		words: [],
		newWord: {
			jap_hanzi: '',
			jap_jaming: '',
			jap_yisi: '',
			jap_juzi: '',
		}
	},
	methods: {
		getWords: function(){
			this.$http.get('/get_words').then(function(res){
				this.words = res.body;
                    console.log(res);    
                },function(){
                    console.log('请求失败处理');
                });
		},
		addWords: function(){
			for(attr in this.newWord){
			    if(this.newWord[attr].trim() == ""){
			        alert("请补全字段！");
				return;
			    }
			}
			this.$http.post('/add_words', 
					this.newWord, 
					{emulateJSON:true}).then(
				function(res){
					this.newWord={
			jap_hanzi: '',
			jap_jaming: '',
			jap_yisi: '',
			jap_juzi: '',
		}
					console.log(res.body);
				},
				function(res){
					console.log(res.status);
				});
		},
		deleteWord: function(index){
			var word = this.words[index];
			this.$http.get('/del_words?jap_id=' + word.jap_id).then(function(res){
				this.getWords();
                    console.log(res);    
                },function(){
                    console.log('请求失败处理');
                });
		}
	}
});

