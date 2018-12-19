// 定义类型常量，默认全部大写
const LOGIN = '/oauth/token?dt=' + new Date().getTime();
const FUNCTIONS = '/bigger/grid/?order=asc&limit=10&offset=0'
//const BASEURL="http://58.213.131.5"
const BASEURL = 'http://sccloud.bestbus.cn:20080'
const FUNCTIONITEM = "/bigger/grid"
const VEHICLE = 'bigger/vehicle/info'
const TASKRESULT = '/bigger/high_light/crispr'
const HISTORYDATA='/sensor/hydra'

export default {
  LOGIN,
  FUNCTIONS,
  BASEURL,
  FUNCTIONITEM,
  VEHICLE,
  TASKRESULT,
  HISTORYDATA
}
