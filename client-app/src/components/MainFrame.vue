<template>
  <div class="main-frame">
    <div class="top-frame">
      
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
export default {
  name: 'MainFrame',
  data: function(){
    return {
      isActive: 1
    };
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
</style>
