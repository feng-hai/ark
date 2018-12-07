<template>
<div>

  <el-row>
    <div class="content" size="mini">
      <el-select v-model="vehicleStatus" placeholder="请选择车辆状态" size="mini">
        <el-option v-for="item in velcleStatus" :key="item.id" :label="item.title" :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="selectedVehicle" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading" size="mini">
        <el-option v-for="item in velcles" :key="item.unid" :label="item.vin" :value="item.vin">
        </el-option>
      </el-select>
      <el-date-picker size="mini" v-model="value5" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
      </el-date-picker>
      <el-button type="primary" @click="search" size="mini">查询</el-button>
    </div>
    <div style="text-align: right; vertical-align:middle; font-size: 12px" class="edit">
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="show">隐藏</el-dropdown-item>
          <el-dropdown-item @click.native="hide">编辑</el-dropdown-item>
          <el-dropdown-item>删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span>{{title}}</span>
    </div>
  </el-row>
  <el-row>
    <el-col :span="spanF">
      <ve-chart v-if="isChart" height="800px" :extend="chartExtend" :digit=10 :data-empty="isChartEmpty" :judge-width="editWidth" :data="chartData" :settings="chartSettings" :data-zoom="dataZoom"></ve-chart>
      <ve-heatmap v-if="isHeatmap" :data-empty="isChartEmpty" :data="chartData" :judge-width="editWidth"></ve-heatmap>
      <edit-table ref="table" v-if="isTable" :pagination="pagination" :pageId="pageId" :tableRows="tableRows" :tableCols="tableCols"></edit-table>
      <ve-scatter v-if="isScatter" :data="chartData"></ve-scatter>
    </el-col>
    <el-col :span="spanS">
      <edit-page :pageId="pageId"></edit-page>
    </el-col>
  </el-row>
</div>
</template>
<script>
import editPage from './../utils/editPage.vue'
import editTable from './../utils/tableC.vue'
import cookie from './../../../static/js/cookie'
import utils from './../../../static/js/utils'
import axios from 'axios'
import 'v-charts/lib/style.css'

import api from './../../httpConfig/api'
import {
  mapGetters,
  mapActions,
  mapState
} from "vuex";


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
  beforeCreate() {

  },
  beforeDestroy() {

  },
  mounted() {
    this.loadCookie();
    this.loadData(); //加载车辆数据
    this.search();
  },
  data() {
    this.typeArr = ['line', 'histogram', 'pie', 'bar', 'ring', 'waterfall', 'funnel', 'radar']
    this.chartSettings = {
      scale: [true, true],
      digit: 10
    }
    this.dataZoom = [{
      type: 'slider',
      start: 0,
      end: 20
    }]
    return {
      cols: [], //图表列
      rowCol: "1", //标识数据展示方向，1正常 2是行转列
      isChartEmpty: true,
      vehicleStatus: '',
      velcleStatus: [{
        id: 1,
        title: '1'
      }, {
        id: 2,
        title: '2'
      }, {
        id: 3,
        title: '3'
      }, {
        id: 4,
        title: '4'
      }, {
        id: '',
        title: 'all'
      }],
      pagination: {
        pageSize: 10,
        total: 0,
        currentPage: 1,
        pageSizes: [10, 20, 100, 400]
      },
      selectedVehicle: '',
      title: '',
      loading: false,
      velcles: [],
      editWidth: true,
      chartData: {},
      chartSettings: {},
      chartExtend: { //线平滑化
        series: {
          smooth: false
        }

      },
      isTable: false,
      isChart: false,
      isHeatmap: false,
      isScatter: false,
      tableData: {}, //表格全部数据，包括列名称和对应的列表数据
      url: null,
      spanF: 24,
      spanS: 0,
      value5: [],
      chartData: {
        columns: [],
        rows: []
      },
      tableRows: [],
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

      if (this.eventType == 0) { //数据展示形式发生变化

        var type = newVal.split('_')[1];
        if (this.currentId == this.pageId) { //是否是本组件的事件
          this.hideAll();
          if (type == 30) {
            this.isTable = true;
            this.loadCookie();
            //this.$refs.table.doLayout();
            //  this.search();
          } else if (type == 40) {
            this.isHeatmap = true;;
          } else if (type == 50) {
            this.isScatter = true;
          } else {
            this.isChart = true;
            this.chartSettings = {
              type: this.typeArr[type],
              scale: [true, true],
              digit: 10,
              showDataZoom: true
            }
          }
        }
      } //end if
      else if (this.eventType == 1) {

        if (this.currentId == this.pageId) {
          this.isTable = false;
          this.loadCookie();
          if (this.chartType(this.pageId) == 30) {

            this.isTable = true;
          }

        }
      } else if (this.eventType == 2) //列表页改变触发
      {

        if (this.currentId == this.pageId) {
          this.pagination.currentPage = newVal;
          this.search();
        }
      } else if (this.eventType == 3) //列表列数查询
      {
        if (this.currentId == this.pageId) {
          this.pagination.pageSize = newVal;
          this.search();
        }
      }
    }
  },
  components: {
    'edit-page': editPage,
    'edit-table': editTable
  },

  methods: {
    hideAll: function() {
      this.isTable = false;
      this.isChart = false;
      this.isHeatmap = false;
      this.isScatter = false;
    },
    remoteMethod: function(query) {
      console.log(query);
      if (query !== '') {
        if (this.url) {
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


        }
      } else {
        this.selectedVehicle = '';
      }

    },
    loadCookie: function() {
      this.form = cookie.get(this.pageId);
      this.form = JSON.parse(cookie.get(this.pageId));
      if (this.form) {
        if (this.form.resource) {
          var index = this.form.resource;
          if (index == 30) {
            this.isTable = true;
          } else if (index == 40) {
            this.isHeatmap = true;
          } else if (index == 50) {
            this.isScatter = true;
          } else {
            this.isChart = true;
            this.chartSettings = {
              type: this.typeArr[index],
              scale: [true, true],
              digit: 10,
              showDataZoom: true
            }
          }
        }
        if (this.form.name) {
          this.title = this.form.name;
        }
        if (this.form.url)
          this.url = this.form.url;
        if (this.form.x && this.form.y) {
          this.cols = [];
          this.cols = this.cols.concat(this.form.x);
          this.cols = this.cols.concat(this.form.y)
          this.chartData.columns = this.cols;
          console.log("列", this.cols);
        }
        console.log("coookie", this.form.rowCol);

        if (this.form.rowCol) {
          console.log("列方向", this.rowCol)
          this.rowCol = this.form.rowCol;
        }
        if (this.form.rows)
          this.rows = this.form.rows;
        if (this.form.tableCols) {
          this.tableCols = this.form.tableCols;
        }
        if (this.form.tableRows)
          this.tableRows = this.form.tableRows;
        var search = JSON.parse(cookie.get(this.pageId + "search"));
        console.log("search", search);
        if (search) {
          this.selectedVehicle = search.selectedVehicle;
          this.vehicleStatus = search.vehicleStatus;
          console.log("dd", search.value5);
          this.value5 = [];
          this.value5.push(utils.toDate(search.value5[0]));
          this.value5.push(utils.toDate(search.value5[1]));
          //  this.value5 = search.value5;

        }
      }
    },
    search: function() {
      var start = null;
      var end = null;

      if (this.value5 && this.value5.length == 2) {
        start = utils.dateFtt("yyyy-MM-ddThh:mm:ss", this.value5[0]);
        end = utils.dateFtt("yyyy-MM-ddThh:mm:ss", this.value5[1]);
      }
      var that = this;
      var url = this.url; //utils.GetUrlRelativePath(this.url);
      if (this.selectedVehicle.length > 0) {
        url = url + "/" + this.selectedVehicle;
      }
      var fields = [];
      if (this.tableCols) {
        fields = this.tableCols.map(
          item => {
            return item.id
          }
        );
      }
      var param = {
        order: "asc",
        datime_start: start,
        datime_end: end,
        vin: that.selectedVehicle,
        status: that.vehicleStatus,
        field: fields.join(',')
      };
      if (this.isTable) {
        param = {
          order: "asc",
          page_id: that.pagination.currentPage - 1,
          page_size: that.pagination.pageSize,
          datime_start: start,
          datime_end: end,
          vin: that.selectedVehicle,
          status: that.vehicleStatus,
          field: fields.join(',')

        }

      }
      var qs = require('qs');
      axios.get(url, {
        params: param
      }).then(res => {
        var dateArray = [];
        dateArray.push(start);
        dateArray.push(end);
        cookie.set(that.pageId + "search", JSON.stringify({
          selectedVehicle: that.selectedVehicle,
          vehicleStatus: that.vehicleStatus,
          value5: dateArray
        }));

        var data = res.data.collection;
        that.pagination.total = res.data.count; //data.length;
        var arTemp = [];

        if (that.rowCol == 1) {
          that.chartExtend = { //线平滑化
            series: {
              smooth: false
            }

          };
          that.tableRows = data.map(item => {
            try {
              var set = JSON.parse(item.dataset);
              for (var i in set) {
                item[i + ''] = set[i];
                item['code' + i] = i;
                item.datime_end = utils.toDate(item.datime_start).getTime();
              }
            } catch (ex) {
              console.log(ex);
            }
            return item;
          });
          arTemp = that.tableRows;
        } else if (this.rowCol == 2) {
          that.chartExtend = { //线平滑化
            grid: {             
              top: '130px', //距上边距               
            },
            series: {
              smooth: false
            }
          };
          for (var column in that.form.x) {
            arTemp.push({
              item: that.form.x[column]
            });
          }
          that.chartData.columns = [];
          that.chartData.columns.push("item");

          data.forEach(item => {
            try {
              var set = JSON.parse(item.dataset);
              for (var i in arTemp) {
                arTemp[i][item.datime_start] = set[arTemp[i].item];
              }
              that.chartData.columns.push(item.datime_start);
            } catch (ex) {
              console.log(ex)
            }
          });
          /*
          that.chartData.columns.push("time");
          that.chartData.columns.push("value");
          data.forEach(item => {
            try {
              var set = JSON.parse(item.dataset);
              for (var i in arTemp) {
                arTemp[i]["time"] =utils.toDate(item.datime_start).getTime();
                arTemp[i]["value"] = set[arTemp[i].item]*10000;
              }
            } catch (ex) {
              console.log(ex)
            }
          });  */
          console.log("格式化数组", arTemp);
        }

        that.chartData.rows = arTemp;
        if (that.chartData.rows.length > 0) {
          that.isChartEmpty = false;
        } else {
          that.isChartEmpty = true;
        }
        //console.log("获取表格数据：", data);
        that.$notify({
          title: '成功',
          message: '成功加载数据',
          type: 'success'
        });
      }).catch(ex => {
        console.log(ex);
        that.tableRows = [];
        that.velcles = [];
        that.chartData.rows = [];
        that.isChartEmpty = true;
        if (ex && ex.status == 404) {
          that.$notify({
            title: '警告',
            message: '没有找到对应的数据',
            type: 'warning'
          });
        } else {
          that.$notify.error({
            title: '错误',
            message: '接口访问错误，请和管理员联系'
          });
        }
      })
    },
    loadData: function() {
      if (this.url) {
        var that = this;
        var qs = require('qs');

        axios.get(api.VEHICLE, {
          params: {
            order: "asc",
            limit: 5,
            offset: 0,
            page_id: 0,
            page_size: 5
          }
        }).then(res => {

          that.velcles = res.data;
        }).catch(ex => {

        })


      }

    },
    changeType: function() {
      this.index++
        if (this.index >= this.typeArr.length) {
          this.index = 0
        }
      this.chartSettings = {
        type: this.typeArr[this.index]
      }
    },
    show() {


      this.loadCookie();
      this.spanF = 24;
      this.spanS = 0;

      this.chartData.columns = [];
      this.chartData.columns = this.cols;


    },
    hide() {

      this.spanF = 12;
      this.spanS = 12;
      this.loadCookie();

    }
  }
}
</script>
<style>
.content {
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
