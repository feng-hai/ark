<template>
<el-row>
  <el-col :span="24" class="content">
    <el-select v-model="selectedVehicle" filterable remote reserve-keyword placeholder="请输入车辆VIN" :remote-method="remoteMethod" :loading="loading" size="mini">
      <el-option v-for="item in velcles" :key="item.unid" :label="item.vin" :value="item.vin">
      </el-option>
    </el-select>

    <el-date-picker size="mini" v-model="value5" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
    </el-date-picker>
    <el-button type="primary" @click="search" size="mini">开启任务</el-button>
  </el-col>
  <el-col :span="24" class="content">
    <echarts-t :pageId="page1"></echarts-t>
  </el-col>
</el-row>
</template>
<script>
import echartsT from './echartsT'
import cookie from './../../../static/js/cookie'
import utils from './../../../static/js/utils'

import api from './../../httpConfig/api'
import axios from 'axios'
import 'v-charts/lib/style.css'
export default {
  data() {
    return {
      loading: false,
      page1: '21232132',
      selectedVehicle: '',
      velcles: [],
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
  methods: {
    search() {
      var start = null;
      var end = null;

      if (this.value5 && this.value5.length == 2) {
        start = utils.dateFtt("yyyy-MM-ddThh:mm:ss", this.value5[0]);
        end = utils.dateFtt("yyyy-MM-ddThh:mm:ss", this.value5[1]);
      }
      var qs = require('qs');
      cookie.delete("token");
      axios.post(api.TASKRESULT, qs.stringify({
        vin: this.selectedVehicle,
        datime_from: start,
        datime_to: end

      })).then(function(res) {
        console.log()

      }).catch(function(ex) {
        console.log(ex);
      })
    },
    remoteMethod: function(query) {
      console.log(query);
      if (query !== '') {

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
            console.log(res);
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



      } else {
        this.selectedVehicle = '';
      }

    },
  },
  components: {
    'echarts-t': echartsT
  }
}
</script>
<style>
.content {
  margin: 10 10 10 10;
}
</style>
