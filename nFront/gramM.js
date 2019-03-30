//gramM.js

new Vue({
    el: '#gramM',
    data: {
        sum: 0,
        grammar: {
            gram_id: 0,
            gram_title: '',
            gram_detail: '',
            rel_wd_ids: '',
            rel_juzi_ids: '',
            rel_grm_ids: '',
            notes: '',
        },
        grammars: [],
        pagin: {
            start: 0,//从第一页开始
            pages: 1,//只返回一页
            number: 10, //每页十个单词
        }
    },
	beforeMount: function(){
		this.getGrams();
	},
    methods: {
        //添加新语法
        addGram: function(){
            var gram = this.grammar;
            if(gram.gram_title.trim() == '' ||
            gram.gram_detail.trim() == ''){
				alert("请输入完整的语法名称和语法详情!");
				return;
            }
            
			this.$http.post('/add_gram', gram, 
					{emulateJSON:true}).then(
				function(res){
					this.resetGram();
					this.getGrams();
					console.log(res.body);
				},
				function(res){
					console.log(res.status);
				});
        },

        //删除语法
        deleteGram: function(id){
            this.$http.post('/del_gram', 
            {gram_id: id}, 
            {emulateJSON:true}).then(
                function(res){
                    this.getGrams();
                    console.log(res);    
                },function(res){
                    console.log(res);
                });
        },

        //修改旧语法
        updateGram: function(index){
            this.grammar = this.grammars[index];
        },

        //提交修改
        submitUpdate: function(){
            var gram = this.grammar;
            if(gram.gram_title.trim() == '' ||
            gram.gram_detail.trim() == ''){
				alert("请输入完整的语法名称和语法详情!");
				return;
            }
            
			this.$http.post('/update_gram', gram, 
					{emulateJSON:true}).then(
				function(res){
					this.resetGram();
					this.getGrams();
					console.log(res.body);
				},
				function(res){
					console.log(res.status);
				});
        },

        //查询语法
        getGrams: function(){
            var that = this;
            this.$http.post('/get_gram', this.pagin,
            {emulateJSON:true}).then(
                function(res){
                    that.grammars = res.body;
                    console.log(res);    
                },function(res){
                    console.log(res);
                });
        },

        //向上翻页
        pageUp:function(){
            --this.pagin.start;
            this.getGrams();
        },

        //向下翻页
        pageDown:function(){
            ++this.pagin.start;
            this.getGrams();
        },

        //重置grammar对象
        resetGram: function(){
            this.grammar = {
                gram_id: 0,
                gram_title: '',
                gram_detail: '',
                rel_wd_ids: '',
                rel_juzi_ids: '',
                rel_grm_ids: '',
                notes: '',
            };
        }
    }
});
