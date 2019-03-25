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
			this.$http.post('/add_words', 
					this.newWord, 
					{emulateJSON:true}).then(
				function(res){
					console.log(res.body);
				},
				function(res){
					console.log(res.status);
				});
		},
	}
});

