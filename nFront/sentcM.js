//sentcM.js

new Vue({
    el: '#sentcM',
    data: {
        sum: 0,
        sentence: {
            sentc_id: 0,
            sentc_self: '',
            sentc_meang: '',
            rel_wd_ids: '',
            rel_juzi_ids: '',
            rel_grm_ids: '',
            notes: '',
        },
        sentences: [],
        pagin: {
            start: 0,//从第一页开始
            pages: 1,//只返回一页
            number: 10, //每页十个单词
        }
    },
	beforeMount: function(){
		this.getSentcs();
	},
    methods: {
        //添加新句子
        addSentc: function(){
            var sentc = this.sentc;
            if(sentc.sentc_self.trim() == '' ||
               sentc.sentc_meang.trim() == ''){
				alert("请输入完整的日语句子和中文翻译!");
				return;
            }
            
			this.$http.post('/add_sentc', sentc, 
					{emulateJSON:true}).then(
				function(res){
					this.resetSentc();
					this.getSentcs();
					console.log(res.body);
				},
				function(res){
					console.log(res.status);
				});
        },

        //删除句子
        deleteSentc: function(id){
            this.$http.post('/del_sentc', 
            {sentc_id: id}, 
            {emulateJSON:true}).then(
                function(res){
                    this.getSentcs();
                    console.log(res);    
                },function(res){
                    console.log(res);
                });
        },

        //修改旧句子
        updateSentc: function(index){
            this.sentence = this.sentences[index];
        },

        //提交修改
        submitUpdate: function(){
            var sentc = this.sentence;
            if(sentc.sentc_self.trim() == '' ||
               sentc.sentc_meang.trim() == ''){
				alert("请输入完整的日语句子和中文翻译!");
				return;
            }
            
			this.$http.post('/update_sentc', sentc, 
					{emulateJSON:true}).then(
				function(res){
					this.resetSentc();
					this.getSentcs();
					console.log(res.body);
				},
				function(res){
					console.log(res.status);
				});
        },

        //查询句子
        getSentcs: function(){
            var that = this;
            this.$http.post('/get_sentcs', this.pagin,
            {emulateJSON:true}).then(
                function(res){
                    that.sentences = res.body;
                    console.log(res);    
                },function(res){
                    console.log(res);
                });
        },

        //向上翻页
        pageUp:function(){
            --this.pagin.start;
            this.getSentcs();
        },

        //向下翻页
        pageDown:function(){
            ++this.pagin.start;
            this.getSentcs();
        },

        //重置sentence对象
        resetSentc: function(){
            this.sentence = {
                sentc_id: 0,
                sentc_self: '',
                sentc_meang: '',
                rel_wd_ids: '',
                rel_juzi_ids: '',
                rel_grm_ids: '',
                notes: '',
            };
        }
    }
});
