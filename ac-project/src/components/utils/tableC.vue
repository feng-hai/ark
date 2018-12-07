<template>
<div>
  <el-table class="tb-edit" highlight-current-row :data="tableRows" max-height="250" :stripe="stripe" style="width: 100%">
    <el-table-column type="index" width="50">
    </el-table-column>
    <template v-for="(col ,index) in tableCols">
          <el-table-column v-if="col.type==='normal'" :prop="col.id" :label="col.name"  :show-overflow-tooltip="true">

          </el-table-column>
          <el-table-column v-if="col.type==='sort'" :prop="col.id" sortable :label="col.name">
              <template slot-scope="scope">
                  <el-tag type="primary">{{ scope.row.type }}</el-tag>
              </template>
    </el-table-column>
    </template>
  </el-table>
  <div style="" class="pagination">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
    </el-pagination>
  </div>
</div>
</template>
<script>
import {
  mapGetters,
  mapActions,
  mapState,
  mapMutations
} from "vuex";
export default {
  props: ["pageId", "tableRows", "tableCols", "pagination"],
  computed: {
    ...mapGetters([
      'chartType',
      'getColumns',
      'getRows', 'getTables'
    ]),
    ...mapState({
      eventType: state => state.echart.eventType,
      eventValue: state => state.echart.eventValue,
      currentPageId: state => state.echart.currentPageId
    })
  },
  watch: {
    eventValue(newVal, oldName) {

      if (this.eventType == 1 && this.currentPageId == this.pageId) {
        console.log("tablec", newVal);
      }
    }
  },
  mounted() {
    //  console.log("tableT", this.pagination)
  },
  data() {
    return {
      stripe: true
    };
  },
  methods: {
    ...mapMutations([
      "eventControl"
    ]),
    handleSizeChange(val) {
      this.eventControl({
        pageId: this.pageId,
        type: 3,
        value: val
      })
    },

    handleCurrentChange(val) {
      //  console.log('当期页改变'+val);
      this.eventControl({
        pageId: this.pageId,
        type: 2,
        value: val
      })
    },

  }
};
</script>

<style>
.pagination {
  float: left;
  margin-top: 10px;

}

.tb-edit .el-input {
  display: none;
}

.tb-edit .current-row .el-input {
  display: block;
}

.tb-edit .current-row .el-input+span {
  display: none;
}
</style>
