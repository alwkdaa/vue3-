<script>
// 引入icon图标
import { User, View } from '@element-plus/icons-vue'
export default {
  name: 'login',
  data() {
    return {
      user: {
        userName: "",
        userPwd: "",
      },
      // 登录验证规则
      rules: {
        userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        userPwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    }
  },
  methods: {
    login() {
      // 这里如果验证通过就是true
      this.$refs.userForm.validate((valid) => {
        console.log(valid);
        if (valid) {
          this.$api.login(this.user).then((res) => {
            console.log(res);
            this.$store.commit('saveUserInfo', res)
            this.$router.push('/welcome')
          })
        }
      })
    }
  },
  computed: {
    userS() {
      return User;
    },
    view() {
      return View
    }
  },
  mounted() {

  }
}
</script>
<template>
  <div class="login-wrapper">
    <div class="modal">
      <!-- 绑定登录验证规则：rules 这的ref的作用是向外暴露这个dom的接口-->
      <el-form :model="user" :rules="rules" status-icon ref="userForm">
        <div class="title">登录页</div>
        <el-form-item prop="userName">
          <el-input type="text" v-model="user.userName" :prefix-icon="userS"></el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input type="password" v-model="user.userPwd" :prefix-icon="view"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary" @click="login">登录</el-button>
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
}</style>
