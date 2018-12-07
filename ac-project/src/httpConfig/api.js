// 定义类型常量，默认全部大写
const LOGIN = '/oauth/token?dt='+new Date().getTime();
const FUNCTIONS = '/bigger/grid/?order=asc&limit=10&offset=0'
//const BASEURL="http://58.213.131.5"
const BASEURL='http://58.213.131.5'
const FUNCTIONITEM="/bigger/grid"
const VEHICLE='bigger/vehicle/info'

export default {
    LOGIN,
    FUNCTIONS,
    BASEURL,
    FUNCTIONITEM,
    VEHICLE
}
