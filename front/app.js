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
	}
});

