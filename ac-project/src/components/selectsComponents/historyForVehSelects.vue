<template>
<div size="mini">
  <el-select v-model="itemNum" filterable remote reserve-keyword placeholder="请输入数据条数" :loading="loading" size="mini">
    <el-option v-for="item in itemNums" :key="item.id" :label="item.name" :value="item.id">
    </el-option>
  </el-select>
  <el-select v-model="selectedVehicle" filterable remote reserve-keyword placeholder="请输入车辆VIN" :remote-method="sreachVehiclesData" :loading="loading" size="mini">
    <el-option v-for="item in velcles" :key="item.unid" :label="item.vin" :value="item.vin">
    </el-option>
  </el-select>
  <el-date-picker size="mini" v-model="value5" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
  </el-date-picker>
  <el-button type="primary" @click="sreachHistoryData" size="mini">查询</el-button>
  <el-button type="primary" @click="resetSearch" size="mini">重置</el-button>
  <span>数据总数：{{total}} {{loadText}}</span>
</div>
</template>
<script>
import {
  mapGetters,
  mapActions,
  mapState,
  mapMutations
} from "vuex";
import axios from 'axios';
import 'v-charts/lib/style.css'
import api from './../../httpConfig/api'
import cookie from './../../../static/js/cookie'
import utils from './../../../static/js/utils'
export default {
  props: ['pageId'],
  computed: {
    ...mapGetters([
      'chartType'
    ]),
    ...mapState({
      eventType: state => state.echart.eventType,
      eventValue: state => state.echart.eventValue,
      currentId: state => state.echart.currentId
    })
  },
  data() {
    return {
      itemNums: [{
          id: 1000,
          name: " 1 k"
        }, {
          id: 10000,
          name: "10 k"
        }
      ],
      total: 0,
      itemNum: 1000,
      url: '', //查询历史数据的url
      loading: false,
      loadText:'正在加载...',
      selectedVehicle: '', //选择的车辆数据
      velcles: [], //保存车辆集合，前5条
      fields: [], //历史菜单数据
      datas: [], //存放历史数据
      startDateTime: '', //开始时间
      endDateTime: '', //结束时间
      value5: [],
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  watch: {
    eventValue(newVal, oldVal) {
      if (this.currentId == this.pageId) { //是否是本组件的事件
        //  console.log("loadCookie");
        this.loadCookie();
        //  console.log(this.fields)
      }
    }
  },
  beforeCreate() {

  },
  created() {
    this.loadCookie();
  },
  mounted() {},
  methods: {
    ...mapMutations([
      "eventControl"
    ]),
    loadCookie() { //加载cookie数据
      this.form = JSON.parse(cookie.get(this.pageId));
      if (this.form.url) {
        this.url = this.form.url;
      }
      if (this.form.x && this.form.y) {
        this.cols = ['TIMES'];
        this.cols = this.cols.concat(this.form.x);
        this.cols = this.cols.concat(this.form.y)
        this.fields = this.cols;
      }
      var search = JSON.parse(cookie.get(this.pageId + "search"));
      if (search) {
        this.selectedVehicle = search.selectedVehicle;
        this.value5 = [];
        if (search.value5[0]) {
          this.value5.push(utils.toDate(search.value5[0]));
          this.value5.push(utils.toDate(search.value5[1]));
        }
      }
    },
    sreachHistoryData() {
       this.loadText="正在加载...";
      //查询车辆数据        console.log("fffffff")''
      var start = null;
      var end = null;
      if (this.value5 && this.value5.length == 2) {
        start = utils.dateFtt("yyyy-MM-ddThh:mm:ss", this.value5[0]);
        end = utils.dateFtt("yyyy-MM-ddThh:mm:ss", this.value5[1]);
      }
      var that = this;
      var url = api.HISTORYDATA; //this.url; //utils.GetUrlRelativePath(this.url);
      if (this.selectedVehicle.length > 0) {
        url = url + "/" + this.selectedVehicle;
      }
      that.datas = [];
      this.searchHistory(url, start, end, that.itemNum)
      //  console.log(res)
      var dateArray = [];
      dateArray.push(start);
      dateArray.push(end);
      cookie.set(that.pageId + "search", JSON.stringify({
        selectedVehicle: that.selectedVehicle,
        value5: dateArray
      }));
    },
    searchHistory(url, start, end, num) {
      var that = this;
      var param = {
        order: "asc",
        date_from: start,
        date_to: end,
        number: num,
        page_id: 0,
        field: this.fields.join(',')
      };
      var qs = require('qs');
      axios.get(url, {
        params: param
      }).then(res => {

        var rows = res.data.rows;
        var newData = utils.formatHistoryData(rows);
        that.datas = that.datas.concat(newData);
        that.total = that.datas.length;
        if (res.data.hasNext && newData.length == num) {
          end = utils.dateFtt("yyyy-MM-ddThh:mm:ss", utils.toDate(newData[newData.length - 1].DATIME_RX));;
          that.searchHistory(url, start, end, num);
        } else {
          var newData_for = utils.formatData(that.form.y, that.datas,that.form.zeroFields);
          that.eventControl({
            pageId: this.pageId,
            type: 5,
            value: newData_for
          })
           this.loadText="加载完成_—_";
          this.$notify({
            title: '成功',
            message: '成功加载数据-加载完成',
            type: 'success'
          });
        }


      });
    },
    search(query) {
      var that = this;
      var qs = require('qs');
      this.loading = true;
      var that = this;
      axios.get(api.VEHICLE, {
        params: {
          order: "asc",
          page_id: 0,
          page_size: 5,
          q: query
        }
      }).then(res => {
        that.velcles = res.data;
        that.loading = false;
      }).catch(ex => {
        that.loading = false;
        if (ex.status = 404) {
          that.velcles = [];
          this.$notify({
            title: '警告',
            message: '没有找到对应的数据',
            type: 'warning'
          });
        } else {
          this.$notify.error({
            title: '错误',
            message: '接口加载错误'
          });
        }
      })
    },
    sreachVehiclesData(query) { //查询车辆数据
      //  console.log(query);
      if (query !== '') {
        if (this.url) {
          this.search(query);
        }
      } else {
        this.selectedVehicle = '';
      }
    },
    resetSearch() {

      this.selectedVehicle = '';
      this.value5 = [];
    }


  }
}
</script>
<style>
.selects {
  margin-bottom: 10px;
  float: left;
}

.edit {
  float: right;
  margin-bottom: 10px;
  vertical-align: middle;
  display: inline-block;
  line-height: 20px;
}
</style>
