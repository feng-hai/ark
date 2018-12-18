// 异步操作中需要用到 increment 方法，所以需要导入 types.js 文件
import types from './types'
import states from './states'
import axios from 'axios'
import api from './../httpConfig/api';
import cookie from './../../static/js/cookie'

const actions = {
  incrementAsync({
    commit,
    state
  }) {
    // 异步操作
    var p = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 3000);
    });
    p.then(() => {
      commit(types.INCREMENT);
    }).catch(() => {
      console.log('异步操作');
    })
  },
  setUser(context, user) {

    var qs = require('qs');
    cookie.delete("token");
    api.BASEURL=user.plat;
    console.log(api.BASEURL);
    axios.post(api.LOGIN, qs.stringify({
      scope: " /bigger/grid /openid /bigger/device   /sensor/vehicle /bigger/model /bigger/domain /sensor/vehicle  /bigger/vehicle /bigger/vehicle/info /bigger/event /bigger/high_light/result /bigger/high_light/crispr",
      client_secret: "daf2333dd314xfd",
      client_id: "597494481295-dd79sund7ef8kr338t87eqajl27spg7a.apps.cube.com",
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
// 最后导出
export default actions;
