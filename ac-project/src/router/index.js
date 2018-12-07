import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/examples/HelloWorld'
import line from '@/components/examples/line'
import store from '@/components/examples/store'
import editTable0 from '@/components/utils/editTable0'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'store',
      component: store
    }, {
      path: '/chart',
      name: 'line',
      component: line
    },
    {
      path: '/login',
      name: 'store',
      component: store
    },
    {
      path: '/editTable',
      name: 'editTable0',
      component: editTable0
    }

  ]
})
