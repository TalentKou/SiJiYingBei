<template>
  <div class="main-frame">
    <div class="top-frame"></div>
    <table class="bottom-frame">
        <tr>
            <td v-bind:class="{ active: isActive == 1 }">单词</td>
            <td v-bind:class="{ active: isActive == 2 }">句子</td>
            <td v-bind:class="{ active: isActive == 3 }">语法</td>
        </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'MainFrame',
  props: {
    isActive: 1
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.active{
    color: white;
    background-color: #42b983;
    font-size: 15px;
}
.bottom-frame td{
    color: #42b983;
    background-color: white;
    font-size: 10px;
}
</style>
