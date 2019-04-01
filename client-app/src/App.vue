<template>
  <div id="app">
    <MainFrame/>
  </div>
</template>

<script>
import MainFrame from './components/MainFrame.vue'

export default {
  name: 'app',
  components: {
    MainFrame
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
