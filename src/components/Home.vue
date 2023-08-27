<template>
  <div class="basic-layout">
    <!-- 左侧 -->
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- logo部分 -->
      <div class="logo">
        <img src="../assets/logo.png" alt="">
        <span>Manager</span>
      </div>
      <!-- 菜单部分 collapse控制菜单折叠-->
      <el-menu default-active="" class="nav-menu" background-color="#001529" text-color="#fff" :collapse="isCollapse"
        router>
        <tree-menu :userMenu="userMenu" />
      </el-menu>
    </div>
    <!-- 右侧 -->
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <!-- 上方导航 -->
      <div class="nav-top">
        <!-- 左边面包屑 -->
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <i class="el-icon-s-fold"></i>
          </div>
          <div class="bread">面包屑</div>
        </div>
        <!-- 右侧用户信息 -->
        <div class="user-info">
          <el-badge :is-dot="noticeCount > 0 ? true : false" class="user-badge">
            <i class="el-icon-bell"></i>
          </el-badge>
          <el-dropdown class="user-dropdown" @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
     
              <i class="el-icon-arrowdown"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱：{{ userInfo.userEmail }}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <!-- 下面区域 -->
      <div class="wrapper">
        <!-- 主要区域 -->
        <div class="main-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 引入左侧菜单组件
import TreeMenu from './TreeMenu.vue'
export default {
  name: 'home',
  components: {
    TreeMenu
  },
  data() {
    return {
      userInfo: this.$store.state.userInfo,
      isCollapse: false,
      // 待审批事项
      noticeCount: 0,
      // 菜单列表数据
      userMenu: [],
    }
  },
  mounted() {
    this.getNoticeCount()
    this.getMenuList()
  },
  methods: {
    handleLogout(key) {
      console.log(key);
      if (key == "email") return
      this.$store.commit('saveUserInfo', '')
      this.userInfo = null
      this.$router.push('/login')
    },
    toggle() {
      this.isCollapse = !this.isCollapse
    },
    // 获取待审批事项
    async getNoticeCount() {
      const res = await this.$api.noticeCount()
      this.noticeCount = res
    },
    // 获取菜单数据
    async getMenuList() {
      const res = await this.$api.menuList()
      this.userMenu = res
    }
  }
}
</script>




<style lang="scss" scoped>
.basic-layout {
  position: relative;

  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    //滚动条
    // overflow-y: auto; 
    transition: width 0.5s;

    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;

      img {
        margin: 0 15px;
        width: 32px;
        height: 32px;
      }
    }

    .nav-menu {
      border-right: none;
      height: calc(100vh - 50px);
    }

    &.fold {
      width: 64px;
    }

    &.unfold {
      width: 200px;
    }
  }

  .content-right {
    margin-left: 200px;

    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;

      .nav-left {
        display: flex;
        align-items: center;
        z-index: 10;
        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
        }


      }

      .user-info {
        .user-badge {
          line-height: 30px;
          margin-right: 15px;
        }

        .user-dropdown {
          margin-top: 15px;

          .user-link {
            cursor: pointer;
            color: #409eff;
          }
        }

      }


    }

    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);

      .main-page {
        height: 100%;
        background-color: #fff;
      }
    }

    &.fold {
      margin-left: 64px;
    }

    &.unfold {
      margin-left: 200px;
    }
  }

}
</style>
