
<template>
<div id="product-list-one">
  <h2>Product List One</h2>
  <ul>
    <li v-for="product in products">
      <span class="name">{{ product.name }}</span>
      <span class="price">${{ product.price }}</span>
    </li>
      <button @click="minusPrice">减少价格</button>
  </ul>
</div>
</template>
<script>
export default {
  //props: ['products'],
  data() {
    return {
      products:  this.$store.getters.saleProducts  //获取store中state的数据,不会随state中值改变而改变，如果要改变必须重新对products进行赋值
    }
  }  ,
  methods: {
         minusPrice() {
             this.$store.commit('minusPrice', 2); //提交`minusPrice,payload为2
             this.products=   this.$store.getters.saleProducts;
         },
         minusPriceAsync() {
             this.$store.dispatch('minusPriceAsync', 5); //分发actions中的minusPriceAsync这个异步函数
         }
     }
}
</script>

<style scoped>
#product-list-one {
  background: #FFF8B1;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;
  padding: 10px 20px;
}

#product-list-one ul {
  padding: 0;
}

#product-list-one li {
  display: inline-block;
  margin-right: 10px;
  margin-top: 10px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.7);
}

.price {
  font-weight: bold;
  color: #E8800C;
}
</style>
