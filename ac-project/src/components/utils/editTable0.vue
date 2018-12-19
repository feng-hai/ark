<template>
<div>
  <el-row>
    <el-col :span="18">
      <div class="content">
        <el-select v-model="selectedMunus" filterable remote reserve-keyword placeholder="请输入关键词">
          <el-option v-for="item in munus" :key="item.unid" :label="item.title" :value="item.unid">
          </el-option>
        </el-select>
        <el-button type="primary" @click="addMasterUser()">+ 添加</el-button>
      </div>
      <el-table size="mini" :data="master_user.data" border style="width: 100%" highlight-current-row>
        <el-table-column type="index"></el-table-column>
        <el-table-column v-for="(v,i) in master_user.columns" :key="v.field" :prop="v.field" :label="v.title" :width="v.width">
          <template slot-scope="scope">
            <span v-if="scope.row.isSet">
                <el-input  v-if="v.type==='normal'" size="mini" placeholder="请输入内容" v-model="master_user.sel[v.field]">
                </el-input>
            </span>
            <span  v-if="scope.row.isSet">
            <el-select v-if="v.type==='select'" v-model="master_user.sel[v.field]"   placeholder="请选择y">
              <el-option v-for="item in master_user.Items" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            </span>
            <span v-else>{{scope.row[v.field]}}</span>
        </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <span class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row,scope.$index,true)">
                {{scope.row.isSet?'保存':"修改"}}
            </span>
            <span v-if="!scope.row.isSet" class="el-tag el-tag--danger el-tag--mini" style="cursor: pointer;">
                删除
            </span>
            <span v-else class="el-tag  el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row,scope.$index,false)">
                取消
            </span>
      </template>
        </el-table-column>
      </el-table>
      <br>数据:{{master_user.data}}
    </el-col>
    <el-col :span="6">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="图表数据">
          <el-select v-model="region" filterable @change="changeFunctions" placeholder="请选择图表数据">
            <el-option v-for="item in getFuns" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视图名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitReload">更新</el-button>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</div>
</template>
<script>
//id生成工具 这个比用看 示例而已 模拟后台返回的id
var generateId = {
  _count: 1,
  get() {
    return ((+new Date()) + "_" + (this._count++))
  }
};
import {
  mapGetters,
  mapMutations,
  mapActions,
  mapState
} from "vuex";
import axios from 'axios'
import Fields from './../../store/types'
import api from './../../httpConfig/api'
export default {
  mounted() {
    this.getfunctionsActions();
  },
  computed: {
    ...mapGetters([
      'getFuns'
    ]),
    ...mapState({
      eventType: state => state.echart.eventType,
      eventValue: state => state.echart.eventValue,
      currentPageId: state => state.echart.currentPageId
    })
  },
  data() {
    return {
      region: '',
      form: {
        name: '',
        unid: '',
      },
      munus: [{
          unid: 'http://58.213.131.5/bigger/high_light/crispr/metadata',
          title: '车辆分析数据'
        }, {
          unid: 'http://58.213.131.5/bigger/high_light/result/metadata',
          title: '任务管理'
        },
        {
          unid: '/bigger/national_standard',
          title: '国标明细'
        }
      ],
      selectedMunus: '',
      master_user: {
        sel: null, //选中行
        columns: Fields.FIELDS,
        data: [],
        Items: [{
          id: '1',
          name: '选项'
        }, {
          id: '2',
          name: '选项1'
        }]
      }
    }
  },
  watch: {
    selectedMunus(newVal, oldVal) {
      var that = this;
      axios.get(newVal).then(res => {
        res.data = res.data.map(item => {
          if (item.alias) {
            item.field = item.alias;
          }
          return item;
        })
        that.master_user.data = res.data;
        that.readMasterUser();
      })
    }
  },
  methods: {
    ...mapActions([
      'getfunctionsActions',
      'getFuntionItemsActions'
    ]),
    changeFunctions(item) {
      var qs = require('qs');
      var that = this;
      that.master_user.data = [];
      axios.get(api.FUNCTIONITEM + "/" + item).then(res => {
        var url = null;
        that.form.name = res.data.name;
        that.form.unid = res.data.unid;
        if (res.data.grid_column) {
          let funsItems = JSON.parse(res.data.grid_column).columnField;
          that.master_user.data = funsItems;
        }
      }).catch(ex => {
        console.log("错误", ex)
      })
    },
    onSubmit() {
      var qs = require('qs');
      var that = this;
      axios.post(api.FUNCTIONITEM, qs.stringify({
        name: that.form.name,
        grid_column: JSON.stringify({
          columnField: that.master_user.data
        })
      })).then(res => {})
    },
    onSubmitReload() {
      var that = this;
      var qs = require('qs');
      axios.put(api.FUNCTIONITEM + "/" + this.form.unid, qs.stringify({
        name: that.form.name,
        grid_column: JSON.stringify({
          columnField: that.master_user.data
        })
      })).then(res => {
        that.getfunctionsActions();
      })
    },
    //读取表格数据
    readMasterUser() {
      //根据实际情况，自己改下啊
      this.master_user.data = this.master_user.data.map(i => {
        i.id = generateId.get(); //模拟后台插入成功后有了id
        i.isSet = false; //给后台返回数据添加`isSet`标识
        return i;
      });
    },
    //添加账号
    addMasterUser() {
      for (let i of this.master_user.data) {
        if (i.isSet) return this.$message.warning("请先保存当前编辑项");
      }
      let j = {
        id: 0,
        "type": "",
        "addport": "",
        "user": "",
        "pwd": "",
        "info": "",
        "isSet": true,
        "_temporary": true
      };
      this.master_user.data.push(j);
      this.master_user.sel = JSON.parse(JSON.stringify(j));
    },
    //修改
    pwdChange(row, index, cg) {
      var that = this;
      //点击修改 判断是否已经保存所有操作
      for (let i of this.master_user.data) {
        if (i.isSet && i.id != row.id) {
          this.$message.warning("请先保存当前编辑项");
          return false;
        }
      }
      //是否是取消操作
      if (!cg) {
        if (!this.master_user.sel) {
          this.master_user.data.splice(index, 1)
        } else {
          that.readMasterUser();
          row.isSet = false;
        };
        return false;
      }
      console.log(row);
      //提交数据
      if (row.isSet) {
        //项目是模拟请求操作  自己修改下

        (function() {
          let data = JSON.parse(JSON.stringify(that.master_user.sel));
          for (let k in data) row[k] = data[k];
          that.$message({
            type: 'success',
            message: "保存成功!"
          });
          //然后这边重新读取表格数据
          that.readMasterUser();
          row.isSet = false;
        })();
      } else {
        this.master_user.sel = JSON.parse(JSON.stringify(row));
        that.readMasterUser();
        row.isSet = true;
      }

    }
  }

}
</script>
<style>
.content {
  margin-bottom: 10px;
  float: left;
}
</style>
