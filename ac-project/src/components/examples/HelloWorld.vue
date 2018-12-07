//App.vue中的初始化代码

<template>
<div id="app">
  <div>
    <product-list-one></product-list-one>
    <product-list-two></product-list-two>
  </div>
  <div>
    <edit-page></edit-page>
  </div>
</div>
</template>

<script>
import ProductListOne from './ProductListOne.vue'
import ProductListTwo from './ProductListTwo.vue'
import editPage from './../utils/editPage.vue'

export default {
  name: 'app',
  components: {
    'product-list-one': ProductListOne,
    'product-list-two': ProductListTwo,
    'edit-page': editPage
  },
  data() {
    return {

    }
  }
}
</script>

<style>
body {
  font-family: Ubuntu;
  color: #555;
}
</style>
