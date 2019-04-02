<template>
  <div class="main-frame">
    <div class="top-frame">
      <WordFrame :word="curWord" />
    </div>
    <table class="bottom-frame">
        <tr>
            <td :class="{ chosed: isActive == 1 }" @click="chooseThis(1)">单词</td>
            <td :class="{ chosed: isActive == 2 }" @click="chooseThis(2)">句子</td>
            <td :class="{ chosed: isActive == 3 }" @click="chooseThis(3)">语法</td>
        </tr>
    </table>
  </div>
</template>

<script>
import WordFrame from './WordFrame.vue'
export default {
  name: 'MainFrame',
  components: {
    WordFrame
  },
  data: function(){
    return {
      isActive: 1,
      curWord: {
            word_id: 0,
            word_type: 0,
            word_self: '大家一起来嗨aaaa',
            word_meang: '大家一起来嗨aaaa',
            rel_wd_ids: '',
            rel_juzi_ids: '',
            rel_grm_ids: '',
            notes: '',
            create_time: '',
            update_time: ''
        }
    };
  },
  mounted: function () {
      var that = this;
      //随机获取一个单词
      this.$http.get('/get_any_word').then(
          function(res){
              that.curWord = res.body[0];
              console.log(res);    
          },function(res){
              console.log(res);
          });
  },
  methods: {
    chooseThis: function(index){
      this.isActive = index;
    } 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-frame {
  width: 100%;
  height: 100%;
}

.bottom-frame {
  position: absolute;
  width: 100%;
  bottom: 0;
  margin: 0;
  padding: 0;
  border: 0;
  border-collapse: collapse;
  height: 7%;
}
.bottom-frame tr{
  margin: 0;
  padding: 0;
  border: 0;
  border-top: 1px solid green;
}
.bottom-frame td{
  margin: 0;
  padding: 0;
  border: 0;
  border-left: 1px solid green;
  width: 33%;
  color: #42b983;
  background-color: white;
  font-size: 25px;    
}

.bottom-frame td:first-child{
  border-left: 0px;
}

.bottom-frame td.chosed{
  color: white;
  background-color: #42b983;
  font-size: 20px;
}

.top-frame {
  height: 93%;
}
</style>
