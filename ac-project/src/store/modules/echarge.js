// 导入 types.js 文件
import axios from 'axios'
import api from './../../httpConfig/api'
const state = {
  currentId: '', //当前组件的id
  eventType: 0, //触发事件类型 0代表图标样式 1代表数据更新
  eventValue: {}, //触发事件传递的值
  functions: [],
  items: [{
      id: "2123213",
      value: {
        chartType: 0,
      }
    },
    {
      id: "21232132",
      value: {
        chartType: 0,
      }
    }
  ]
}

const actions = {
  getfunctionsActions(content) {

    axios.get(api.FUNCTIONS).then(res => {
      //  console.log(res.data);
      let funs = res.data.map(fun => {
        return {
          name: fun.name,
          id: fun.unid
        };
      })
      content.commit("setFuntions", funs);
    }).catch(ex => {
      console.log("错误", ex)
    })

  }


}
// 定义 getters
const getters = {

  getProductByid: (state) => (id) => {

    return state.items.find(item => item.id === id);
  },
  chartType: (state) => (id) => {

    var item = state.items.find(function(i) {

      return i.id == id;
    })

    //  console.log("test"+id,item.value);
    if (item)
      return item.value.chartType;
    else
      return 0;
  },

  getFuns(state) {
    return state.functions;
  },

  getEventValue(state) {
    return state.eventValue;
  },

}


const mutations = {
  // 此处的事件为上方 actions 中的 commit(types.INCREMENT)
  setChartType(state, type) {
    state.currentId = type.id;
    state.eventType = 0;
    state.eventValue = type.type;
    var chartType = type.type.split('_')[1];
    var item = state.items.find(function(i) {
      return i.id == type.id;
    })
    if (item) {
      item.value.chartType = chartType;
    } else {
      state.items.push({
        id: type.id,
        value: {
          chartType: type.type,
        }
      })
    }
  },
  setFuntions(state, functions) {
    //  state.functions = [];
    //  state.functionsItems = [];
    state.functions = functions;
  },
  setPageId(state, pageId) {
    state.currentId = pageId;
  },
  updateControl(state,pageId)
  {
    state.currentId=pageId;
    state.eventType=1;
    state.eventValue=pageId+"_"+Math.round(Math.random()*100);
  },
  eventControl(state,event)
  {
    state.currentId=event.pageId;
    state.eventType=event.type;
    state.eventValue=event.value;
  }



}


// 最后统一导出
export default {
  state,
  getters,
  mutations,
  actions
}
