//app.js

new Vue({
	el: "#app",
	data: {
		words: []
	},
	methods: {
		getWords: function(){
			this.$http.get('/get_words').then(function(res){
                    console.log(res);    
                },function(){
                    console.log('请求失败处理');
                });
		},
		addWords: function(){
			this.$http.post('/add_words', 
					{
				jap_hanzi: "漢字",
				jap_jaming: "かんじ",
				jap_yisi: "汉字",
				jap_juzi: "漢字は面白いです。（汉字是很有意思的。）",
			}, 
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

