
<script>
import { Setting, Fold, Bell, ArrowDown } from '@element-plus/icons-vue'
export default {
  name: 'home',
  components: {
    setting: Setting,
    fold: Fold,
    bell: Bell,
    ArrowDown
  },
  data() {
    return {
      userInfo: {
        userName: 'lsl',
        userEmail: 'lsl@email.com'
      },
      isCollapse: false,
      // 待审批事项
      noticeCount: 0,
    }
  },
  mounted() {
    this.getNoticeCount()
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
    async getNoticeCount() {
      const res = await this.$api.noticeCount()
      this.noticeCount = res
    }
  }
}
</script>

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
      <el-menu default-active="2" class="nav-menu" background-color="#001529" text-color="#fff" :collapse="isCollapse"
        router>
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <setting></setting>
            </el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="1-1">用户管理</el-menu-item>
          <el-menu-item index="1-2">菜单管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <setting></setting>
            </el-icon>
            <span>审批管理</span>
          </template>
          <el-menu-item index="2-1">休假管理</el-menu-item>
          <el-menu-item index="2-2">待我审批</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    <!-- 右侧 -->
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <!-- 上方导航 -->
      <div class="nav-top">
        <!-- 左边面包屑 -->
        <div class="nav-left">
          <el-icon :size="25" style="margin-right: 10px;">
            <fold @click="toggle()"></fold>
          </el-icon>

          <div class="bread">面包屑</div>
        </div>
        <!-- 右侧用户信息 -->
        <div class="user-info">
          <el-badge :is-dot="noticeCount > 0 ? true : false" class="user-badge">
            <el-icon>
              <bell></bell>
            </el-icon>
          </el-badge>
          <el-dropdown class="user-dropdown" @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
              <el-icon>
                <arrow-down />
              </el-icon>
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
