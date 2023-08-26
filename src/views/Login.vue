<script>
// 引入icon图标
import {User,View} from '@element-plus/icons-vue'
export default {
  name:'login',
  methods:{
    goHome(){
      this.$router.push('/welcome')
    }
  },
  computed:{
    user() {
      return User;
    },
    view(){
      return View
    }
  }, 
  mounted(){

  }
}
</script>
<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form>
        <div class="title">登录页</div>
        <el-form-item>
          <el-input type="text" :prefix-icon="user"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" :prefix-icon="view"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<style lang="scss">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;
  .modal {
    width: 500px;
    padding: 35px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .title {
      font-size: 35px;
      line-height: 1.5;
      text-align: center;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>
