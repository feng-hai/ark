<template>
<el-form ref="ruleForm" :model="form" label-width="80px" size="mini">
  <el-form-item label="图表名称">
    <el-input v-model="form.name"></el-input>
  </el-form-item>
  <el-form-item label="图表数据">
    <el-select v-model="form.region" filterable @change="changeFunctions" placeholder="请选择图表数据">
      <el-option v-for="item in getFuns" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="图标类型">
    <el-radio-group v-model="form.resource" @change="redioChange">
      <div class="content">
        <el-radio label="0" vaule="0">折线图</el-radio>
        <el-radio label="2" value="2">饼状图</el-radio>
        <el-radio label="1" value="1">柱状图</el-radio>
        <el-radio label="3" value="3">条形图</el-radio>
        <el-radio label="4" value="4">环形图</el-radio>
        <el-radio label="5" value="5">瀑布图</el-radio>
      </div>
      <div class="content">
        <el-radio label="6" value="6">漏斗图</el-radio>
        <el-radio label="7" value="7">雷达图</el-radio>
        <el-radio label="40" value="40">热力图</el-radio>
        <el-radio label="50" value="50">散点图</el-radio>
        <el-radio label="30" value="30">列表</el-radio>
      </div>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="数据方向" v-if="form.resource!=30">
    <el-radio-group v-model="form.rowCol" @change="rowColChange">
      <el-radio label="1" value="1">按行展示</el-radio>
      <el-radio label="2" value="2">按列展示</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="维度" v-if="form.resource!=30">
    <el-select v-model="form.x" multiple placeholder="请选择x" @change="changeX">
      <el-option v-for="item in functionsItems" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="维度类型" v-if="form.resource!=30">
    <el-select v-model="form.xAxisType" placeholder="请选择类型" @change="changeX">
      <el-option v-for="item in xAxisTypes" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="指标" v-if="form.resource!=30">
    <el-select v-model="form.y" multiple @change="changeY" placeholder="请选择y">
      <el-option v-for="item in functionsItems" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="规整零" v-if="form.resource!=30">
    <el-select v-model="form.zeroFields" multiple placeholder="请选择y">
      <el-option v-for="item in functionsItems" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="列数据" v-if="form.resource==30">
    <el-select v-model="form.columns" @change="changeTableColumn" multiple placeholder="请选择列表要展示的列">
      <el-option v-for="item in functionsItems" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmitReload">恢复</el-button>
    <el-button type="primary" @click="onSubmit">保存</el-button>
    <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
    <el-button>取消</el-button>
  </el-form-item>
</el-form>
</template>
<script>
import {
  mapGetters,
  mapMutations,
  mapActions
} from "vuex";
import cookie from './../../../static/js/cookie'
import utils from './../../../static/js/utils'
import axios from 'axios'
import api from './../../httpConfig/api'
export default {
  props: ['pageId'],
  data() {
    return {
      options: [{
        id: '选项1',
        name: '黄金糕'
      }, ],
      xAxisTypes: [{
          name: '类别',
          id: 'category'
        }, {
          name: '数值',
          id: 'value'
        },
        {
          name: '时间',
          id: 'time'
        },
        {
          name: 'log',
          id: 'log'
        }
      ],
      functionsItems: [],
      form: {
        items: [],
        xAxisType: 'category',
        rowCol: '1',
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        x: [],
        y: [],
        columns: [],
        tableCols: [],
        url: '',
        cols: [],
        zeroFields: [] //用于过滤数值等于零的字段
      }
    }
  },
  computed: {
    ...mapGetters([
      'chartType',
      'getColumns',
      'getRows',
      'getFuns',
      'getFunctionItem',
    ])
  },
  created() {

  },
  mounted() {
    this.getfunctionsActions();
    this.reload();
  },
  methods: {
    ...mapMutations([
      "setChartType",
      "clearFunctionItems",
      "setPageId",
      "updateControl"
    ]),
    redioChange() {
      this.setPageId(this.pageId);
      if (this.form.resource == 30) {
        this.form.rowCol = "1";
      }
      this.setChartType({
        type: this.pageId + "_" + this.form.resource,
        id: this.pageId
      });
    },
    rowColChange() {

    },
    ...mapActions([
      'getfunctionsActions',
      'getFuntionItemsActions'
    ]),
    onSubmit() {
      console.log(this.form);
      cookie.set(this.pageId, JSON.stringify(this.form));
      console.log(cookie.get(this.pageId));
      this.updateControl(this.pageId);

    },
    onSubmitReload() {
      this.reload();
    },
    reload() {
      this.form.resource = this.chartType(this.pageId).toString();
      if (cookie.get(this.pageId)) {
        this.form = utils.extend(this.form, JSON.parse(cookie.get(this.pageId)), true);
        //console.log(this.form);
        if (this.form.region) {
          this.setFunction(this.form.region);
        }
        this.setChartType({
          type: this.pageId + "_" + this.form.resource,
          id: this.pageId
        });
      }

    },
    setFunction(item) {
      var qs = require('qs');
      var that = this;
      axios.get(api.FUNCTIONITEM + "/" + item).then(res => {
        //  console.log("items", JSON.parse(res.data.grid_column).columnField);
        var url = null;
        let funsItems = JSON.parse(res.data.grid_column).columnField.map(item => {
          if (url == null && item.api_uri) {
            url = utils.GetUrlRelativePath(item.api_uri);
          }
          return {
            name: item.title,
            id: item.field,
            type: "normal"
          };
        })
        that.form.url = url;

        for (var i = 0; i < 500; i++) {
          funsItems.push({
            id: i + '',
            name: i + 'C',
            type: "normal"
          })
          funsItems.push({
            id: 'max' + i,
            name: 'max' + i,
            type: "normal"
          })
          funsItems.push({
            id: 'min' + i,
            name: 'min' + i,
            type: "normal"
          })
          funsItems.push({
            id: 'avg' + i,
            name: 'avg' + i,
            type: "normal"
          })
          funsItems.push({
            id: 'sd' + i,
            name: 'sd' + i,
            type: "normal"
          })
        }
        that.functionsItems = funsItems;
        if (this.form.columns) {
          this.changeTableColumn(this.form.columns)
        }

      }).catch(ex => {
        console.log("错误", ex)
      })
    },
    changeFunctions(item) {
      this.form.x = [];
      this.form.y = [];
      this.form.columns = [];
      this.setFunction(item);
    },
    changeX(item) {
      //this.form.cols = [];
      //this.form.cols = this.form.x;
      //this.form.cols = this.form.cols.concat(this.form.y)

    },
    changeY(vel) {
      var items = this.functionsItems.filter(item => {
        return vel.contains(item.id);
      })
      this.form.items = items;
    },
    changeTableColumn(vel) {
      var item = this.functionsItems.filter(item => {
        return vel.contains(item.id);
      })
      this.form.tableCols = item;
    },
    saveXY() {
      this.form.cols = [];
      this.form.cols.push(this.form.x);
      this.form.cols = this.form.cols.concat(this.form.y)

    },
    resetForm(formName) {

      this.form = {
        xAxisType: 'category',
        rowCol: '1',
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        x: [],
        y: [],
        columns: [],
        tableCols: [],
        url: '',
        cols: []
      }

    }
  }
}

Array.prototype.contains = function(needle) {
  for (var i in this) {
    if (this[i] == needle) return true;
  }
  return false;
}
</script>
<style>
.content {
  margin-bottom: 10px;
  float: left;
}
</style>
