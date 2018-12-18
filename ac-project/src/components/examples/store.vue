<template>
<div>
  <el-row type="flex" justify="center">
    <el-form :model="user" label-width="80px">
      <el-form-item label="平台">
        <el-select v-model="user.plat" placeholder="请选择平台">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="user.name"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="user.pass" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-upload" @click="submitForm">登录</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</div>
</template>

<script>
import {
  mapGetters,
  mapActions,
  mapState
} from "vuex";
export default {
  name: 'app',
  data() {
    return {
      options: [{
        label: '舒驰平台',
        value: 'https://shuchi.wlwltech.com:20443'
      }, {
        label: '电池平台',
        value: 'http://58.213.131.5'
      }, {
        label: '公司内部平台',
        value: 'https://api1.wlwltech.com'
      }, {
        label: '上汽',
        value: 'https://shangqi.wlwltech.com'
      }, {
        label: '中车',
        value: 'http://218.75.212.61:8893'
      }],
      msg: 'Welcome to Your Vue.js App',
      user: {
        name: '',
        pass: '',
        plat: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'count',
      "getUser"
    ]),
    ...mapState({
      token: state => state.users.token
    })
  },
  watch: {
    token(val, valold) {
      this.$notify({
        title: '成功',
        message: '登录成功',
        type: 'success'
      });
      this.$router.push({ //你需要接受路由的参数再跳转
        path: "/chart"
      });
    }
  },
  methods: {

    submitForm(formName) {
      console.log(this.token);
      this.setUser(this.user);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },


    ...mapActions([
      'increment',
      'decrement',
      'incrementAsync',
      'setUser',
      'getfunctionsActions'
    ]),
    getuser() {

    }

  }
}
</script>
