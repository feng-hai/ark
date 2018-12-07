// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
Vue.config.productionTip = false
import Vuex from 'vuex'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store/index.js'
Vue.use(ElementUI);
import VCharts from 'v-charts'/*全部引入，后续需要优化*/
Vue.use(VCharts)
import axios from './httpConfig/http'



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
