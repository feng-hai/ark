<template>
<div id="app">
  <img src="./assets/logo.png">
  <p>
    <!-- 使用 router-link 组件来导航. -->
    <!-- 通过传入 `to` 属性指定链接. -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->

    <router-link to="/chart">图表管理</router-link>
    <router-link to="/login">登录页面</router-link>
    <router-link to="/editTable">数据视图</router-link>
    <router-link to="/taskManager">任务管理</router-link>
  </p>
  <router-view/>
</div>
</template>

<script>
export default {
  name: 'App'
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
