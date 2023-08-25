
<script>
export default {
  name: 'home'
}
</script>

<template>
  <div class="basic-layout">
    <!-- 左侧 -->
    <div class="nav-side">

    </div>
    <!-- 右侧 -->
    <div class="content-right">
      <!-- 上方导航 -->
      <div class="nav-top">
        <!-- 左边面包屑 -->
        <div class="bread">面包屑</div>
        <!-- 右侧用户信息 -->
        <div class="user-info">用户信息</div>
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
    overflow-y: auto;//滚动条
    transition: width 0.5s ;
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
  }
}
</style>
