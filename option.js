new Vue({
  el: "#app",
  data: {
    word: '(空)'
  },
  methods: {
    query: function(){
      //发送get请求
      this.$http.get('/get').then(function(res){
        console.log(res);
      },function(){
        console.log('请求失败处理');
      });
    }
  }
});
