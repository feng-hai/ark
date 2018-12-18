// 导入 types.js 文件
import types from "./../types";
import axios from 'axios'
import api from './../../httpConfig/api';
import cookie from './../../../static/js/cookie'
const state = {
  count: 5,
  name: '管理员',
  token: "1234454596783732432"
}

// 定义 getters
var getters = {
  count(state) {
    return state.count
  }
}

const actions = {
  increment({
    commit,
    state
  }) {
    // 此处提交的事件与下方 mutations 中的 types.INCREMENT 对应
    //与原来 commit('increment') 的原理相同，只是把类型名换成了常量
    commit(types.INCREMENT)
  },
  decrement({
    commit,
    state
  }) {
    if (state.count > 10) {
      // 此处提交的事件与下方 mutations 中的 types.DECREMENT 对应
      commit(types.DECREMENT)
    }
  },
  setUser(context, user) {

    var qs = require('qs');
    cookie.delete("token");
    api.BASEURL = user.plat;
    axios.defaults.baseURL = api.BASEURL;
    var client_id = "597494481295-dd79sund7ef8kr338t87eqajl27spg7a.apps.cube.com";
    if (api.BASEURL == "http://218.75.212.61:8893") {
      client_id = "597494481295-dd79sund7ef8kr338t87eqajl27spg7a.apps.csrzic.com";
    }

    axios.post(api.LOGIN, qs.stringify({
      scope: " /bigger/grid /openid /bigger/device  /sensor/vehicle /bigger/model /bigger/domain /sensor/vehicle  /bigger/vehicle /bigger/vehicle/info /bigger/event /bigger/national_standard",
      client_secret: "daf2333dd314xfd",
      client_id: client_id, //"597494481295-dd79sund7ef8kr338t87eqajl27spg7a.apps.csrzic.com",//"597494481295-dd79sund7ef8kr338t87eqajl27spg7a.apps.cube.com",
      grant_type: "password",
      username: user.name,
      password: user.pass
    })).then(function(res) {
      //保存token，要添加到缓存中
      console.log(res);
      var token = res.data.split('=')[1];
      console.log(cookie);
      cookie.set("token", res.data.split('=')[1].split('&')[0]);
      cookie.set("name", token);
      console.log(cookie.get("token"))
      user.token = token;
      context.commit("setUser", user);
    }).catch(function(ex) {
      console.log(ex);
    })
  }
}

const mutations = {
  // 此处的事件为上方 actions 中的 commit(types.INCREMENT)
  [types.INCREMENT](state) {
    state.count++
  },
  // 此处的事件为上方 actions 中的 commit(types.DECREMENT)
  [types.DECREMENT](state) {
    state.count--
  },


  setUser(state, user) {
    state.name = user.name;
    state.token = user.token;
  }

}
// 最后统一导出
export default {
  state,
  getters,
  actions,
  mutations
}
