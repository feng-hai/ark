<template>
  <el-row>
    <el-col :span="24" class="content">
      <echarts-t :pageId="page1"></echarts-t>
    </el-col>
    <el-col :span="24" class="content">
      <echarts-t :pageId="page2"></echarts-t>
    </el-col>
    <el-col :span="24" class="content">
      <echarts-t :pageId="page3"></echarts-t>
    </el-col>
  </el-row>
</template>
<script>
import echartsT from './echartsT2'
export default {
  data() {
    return {
      page1: '212321321',
      page2: '212321311',
      page3: '333333311',
    }
  },
  components: {
    'echarts-t': echartsT
  }
}
</script>
<style>
.content{
 margin:10 10 10 10;
}

</style>
