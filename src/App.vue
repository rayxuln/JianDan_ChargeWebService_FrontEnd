<template>
  <div id="app">
    <div id="title"> 简单的大标题 </div>
    <FirstPage />
  </div>
</template>

<script>
import FirstPage from './components/FirstPage.vue'

export default {
  name: 'App',
  components: {
    FirstPage
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#title {
  font-size: 72px;
}
</style>
