<template>
  <div class="word-frame">
    <div class="top-bar">
      <div class="back">历史</div>
      <div class="relate">关联</div>
    </div>
    <div class="content">
        <div>{{word.word_self}}</div>
        <div>{{WORD_TYPES[word.word_type]}}</div>
        <div>{{word.word_meang}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WordFrame',
  props: ['word'],
  data: function (){
      return {
        WORD_TYPES: ['名词','动词基本型','动词ます型','动词て型','动词た型','动词ない型','い形容词','な形容词','副词','助词'],
      };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.word-frame {
    height: 100%;
}

.top-bar {
    height: 7%;
    font-size: 20px;
    position: relative;
}

.top-bar .back{
    position: absolute;
    left: 0;
    width: 33%;
    height: 100%;
    line-height: 200%;
    border-bottom: 1px solid green;
    border-right: 1px solid green;
}

.top-bar .relate{
    position: absolute;
    right: 0;
    width: 33%;
    height: 100%;
    line-height: 200%;
    border-bottom: 1px solid green;
    border-left: 1px solid green;
}
</style>
