<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="form">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item  label="状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">新增</el-button>
        <el-button type="danger">批量删除</el-button>
      </div>
      <el-table :data="userList" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" />
        <el-table-column label="操作" width="150">
          <template #default>
            <el-button size="mini">编辑</el-button>
            <el-button type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" background layout="prev, pager,next" :total="pager.total" @current-change="handleCurrentChange"></el-pagination>
    </div>
  </div>
</template>
<script>
import { onMounted, reactive, getCurrentInstance, ref } from 'vue';
export default {
  name: 'User',
  setup() {
    // 获取全局对象类似于options api里面的this
    const { proxy } = getCurrentInstance()
    // Mounted生命周期函数
    onMounted(() => {
      getUserList()
    });
    // 查找的数据
    const user = reactive({
      state: 0
    })
    // 用户列表
    const userList = ref([])
    //表格的列的配置
    const columns = reactive([
      {
        label: "用户ID",
        prop: "userId"
      },
      {
        label: "用户名",
        prop: "userName"
      },
      {
        label: "用户邮箱",
        prop: "userEmail"
      },
      {
        label: "用户角色",
        prop: "role"
      },
      {
        label: "用户状态",
        prop: "state"
      },
      {
        label: "注册时间",
        prop: "createTime"
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime"
      },
    ])
    // 分页的配置
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 10
    })
    // 调用用户列表数据接口的方法
    const getUserList = async () => {
      let params = { ...user, ...pager }
      const { page, list } = await proxy.$api.userList(params);
      pager.total = page.total
      userList.value = list
    }
    // 查询的方法
    const handleQuery = () => {
      getUserList()
    }
    // 重置的方法
    const handleReset = () => {
      proxy.$refs.form.resetFields()
    };
    // 分页的点击
    const handleCurrentChange = (current) => {
      pager.pageNum = current
      getUserList()
    }
    return {
      user,
      userList,
      columns,
      pager,
      handleQuery,
      handleReset,
      handleCurrentChange,
    }
  },
}
</script>