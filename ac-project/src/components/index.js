
import Vue from 'vue'
import EchartsT from './examples/echartsT'
const Components = {
  EchartsT
}

Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name])
})
export default Components
