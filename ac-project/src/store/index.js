import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import users from './modules/user'
import demo from './modules/demo'
import echart from './modules/echarge'


export default new Vuex.Store({
    modules:{
        users,
        demo,
        echart
    }
})
