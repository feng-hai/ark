<template>
<div>

  <el-row>
    <el-col :span="16">
      <history-selects :pageId="pageId"></history-selects>
    </el-col>
    <el-col :span="8">
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
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="spanF">
      <ve-chart v-if="isChart" :extend="chartExtend" :digit=10 :data-empty="isChartEmpty" :judge-width="editWidth" :data="chartData" :settings="chartSettings" :data-zoom="dataZoom"></ve-chart>
      <ve-heatmap v-if="isHeatmap" :data-empty="isChartEmpty" :data="chartData" :judge-width="editWidth"></ve-heatmap>
      <edit-table ref="table" v-if="isTable" :pagination="pagination" :pageId="pageId" :tableRows="tableRows" :tableCols="tableCols"></edit-table>
      <ve-scatter v-if="isScatter" :extend="chartExtend" :digit=10 :data-empty="isChartEmpty" :judge-width="editWidth" :data="chartData" :settings="chartSettings" :data-zoom="dataZoom"></ve-scatter>
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
import historySelects from './../selectsComponents/historyForVehSelects.vue'
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
    this.dataZoom = []
    return {
      dimension: [],
      metrics: [],
      cols: [], //图表列
      rowCol: "1", //标识数据展示方向，1正常 2是行转列
      isChartEmpty: true,
      vehicleStatus: '',
      velcleStatus: [{
        id: 1,
        title: ' 停车充电-1'
      }, {
        id: 2,
        title: '行驶充电-2'
      }, {
        id: 3,
        title: '未充电状态-3'
      }, {
        id: 4,
        title: '充电完成-4'
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
      chartSettings: {
        scale: [true, true],
        digit: 10
      },
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
      items: [],
      labelMapItems: {},
      labels: {}
    }
  },
  watch: {　　
    deep: true,
    eventValue(newVal, oldVal) {
      if (this.currentId == this.pageId) { //是否是本组件的事件
        if (this.eventType == 5) {
          this.setChart(0, true);
          this.chartData.rows = newVal;
          if (this.chartData.rows.length > 0) {
            this.isChartEmpty = false;
          } else {
            this.isChartEmpty = true;
          }
          var that = this;
          this.chartExtend = { //线平滑化
            series: {
              smooth: false
            },
            tooltip: {
              formatter: function(params, ticket, callback) {
                let res = params[0].name;
                var item = that.chartData.rows[params[0].dataIndex];
                for (let i = 0, l = params.length; i < l; i++) {
                  var seriesCode = that.labels[params[i].seriesName];
                  var item = that.chartData.rows[params[i].dataIndex];
                  if (item[seriesCode + "_base"]) {
                    res += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + item[seriesCode + "_base"];
                  } else {
                    res += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + item[seriesCode];
                  }
                }
                return res;
              }
            }
          };
          this.$notify({
            title: '成功',
            message: '成功加载数据',
            type: 'success'
          });
        }
      }
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
            this.setChart(type, true);
          } else {
            this.isChart = true;
            this.setChart(type, true)
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
    'edit-table': editTable,
    'history-selects': historySelects
  },

  methods: {
    hideAll: function() {
      this.isTable = false;
      this.isChart = false;
      this.isHeatmap = false;
      this.isScatter = false;
    },
    remoteMethod: function(query) {

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
            this.setChart(index, true);
          } else {
            this.isChart = true;
            this.setChart(index, true);
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
          //  console.log('test', this.cols);
          this.chartData.columns = this.cols;
          this.x = this.form.x;
          //  this.metrics=this.form.y;

        }
        if (this.form.rowCol) {
          this.rowCol = this.form.rowCol;
        }
        if (this.form.rows)
          this.rows = this.form.rows;
        if (this.form.tableCols) {
          this.tableCols = this.form.tableCols;
        }
        if (this.form.tableRows) {
          this.tableRows = this.form.tableRows;
        }
        if (this.form.items) {
          //  console.log("items", this.form.items);
          this.labelMapItems = {};
          this.lables = {};
          this.form.items.map(item => {
            this.labelMapItems[item.id] = item.name;
            this.labels[item.name] = item.id;
          });
        }

        // var search = JSON.parse(cookie.get(this.pageId + "search"));
        // if (search) {
        //   this.selectedVehicle = search.selectedVehicle;
        //   this.vehicleStatus = search.vehicleStatus;
        //   this.value5 = [];
        //   if (search.value5[0]) {
        //
        //
        //     this.value5.push(utils.toDate(search.value5[0]));
        //     this.value5.push(utils.toDate(search.value5[1]));
        //   }
        //  this.value5 = search.value5;
        //}
      }
    },
    //设置chart的属性 index代表图表类型 isRoom表示是否需要DataZoom
    setChart(index, isZoom) {
      this.dataZoom = [];
      isZoom = false;
      if (index == 0 || index == 1 || index == 3) {
        isZoom = true;
        this.dataZoom = [{
          type: 'slider',
          filterMode: 'weakFilter',
        }, {
          type: 'inside',
          filterMode: 'weakFilter',
        }]
      }
      //  console.log("map", this.labelMapItems);
      this.chartSettings = {
        type: this.typeArr[index],
        scale: [true, true],
        digit: 10,
        showDataZoom: isZoom,
        dimension: this.form.x,
        metrics: this.form.y,
        xAxisType: this.form.xAxisType,
        labelMap: this.labelMapItems
      }
    },
    search: function() {

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

    },
    resetSearch() {
      this.vehicleStatus = null;
      this.selectedVehicle = '';
      this.value5 = [];
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
