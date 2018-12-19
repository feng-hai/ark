import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/examples/HelloWorld'
import line from '@/components/examples/line'
import store from '@/components/examples/store'
import taskManager from '@/components/examples/taskManager'
import editTable0 from '@/components/utils/editTable0'
import line2 from '@/components/examples/line2'
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
    },
    {
      path: '/taskManager',
      name: 'taskManager',
      component: taskManager
    },
    {
      path:'/historyData',
      name:'historyData',
      component:line2
    }

  ]
})
