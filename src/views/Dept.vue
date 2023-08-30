<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="queryForm">
        <el-form-item label="部门名称">
          <el-input placeholder="请输入部门名称" v-model="queryForm.deptName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button type="primary" @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleOpen">创建</el-button>
      </div>
      <el-table :data="deptList" row-key="_id" :tree-props="{ children: 'children' }" stripe>
        <el-table-column v-for="item in column" :key="item.prop" v-bind="item"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="action == 'create' ? '创建部门' : '编辑部门'" v-model="showModel" :before-close="handleCloseDialog">
      <el-form ref="deptForm" :model="deptForm" :rules="rules" label-width="120px">
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader placeholder="请选择部门" v-model="deptForm.parentId" :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }" clearable
            :show-all-levels="true"></el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input placeholder="请输入部门名称" v-model="deptForm.deptName"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="userName">
          <el-select placeholder="请选择负责人" v-model="deptForm.userName" @change="handleUser">
            <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input placeholder="请输入邮箱" v-model="deptForm.userEmail" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Dept',
  data() {
    return {
      queryForm: {
        deptName: ""
      },
      column: [
        {
          label: "部门名称",
          prop: "deptName"
        },
        {
          label: "负责人",
          prop: "userName"
        },
        {
          label: "更新时间",
          prop: "updateTime"
        },
        {
          label: "创建时间",
          prop: "createTime"
        }
      ],
      deptList: [],
      pager: {
        pageNum: 1,
        pageSize: 10
      },
      //控制模态框的显示
      showModel: false,
      // 点击模态框确定按钮，调用的接口类型
      action: "create",
      userList: [],
      deptForm: {},
      // 模态框表单验证规则
      rules: {
        parentId: [
          {
            required: true,
            message: '请选择上级部门',
            trigger: 'blur'
          }
        ],
        deptName: [
          {
            required: true,
            message: '请输入部门名称',
            trigger: "blur",
          }
        ],
        userName: [
          {
            required: true,
            message: '请选择负责人',
            trigger: "blur"
          }
        ]
      }
    }
  },
  mounted() {
    this.getDeptList()
    this.getAllUserList()
  },
  methods: {
    // 获取部门列表
    async getDeptList() {
      let list = await this.$api.getDeptList(this.queryForm)
      this.deptList = list
    },
    // 获取所有用户列表
    async getAllUserList() {
      let list = await this.$api.userAllList()
      this.userList = list
    },
    // 创建部门按钮
    handleOpen() {
      this.action = "create"
      this.showModel = true
    },
    // 编辑按钮
    handleEdit(row) {
      this.action = "edit"
      this.showModel = true
      this.$nextTick(()=>{
        Object.assign(this.deptForm,row, {userName:`${row.userId}/${row.userName}/${row.userEmail}`})
      })
    },
    // 删除按钮
    async handleDelete(_id) {
      this.action = "delete"
      await this.$api.deptOperate({action: this.action, _id})
      this.$message.success('删除成功')
    },
    // 点击模态框叉号
    handleCloseDialog() {
      this.showModel = false
    },
    // 点击重置按钮
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    // 模态框点击取消按钮
    handleClose() {
      this.showModel = false
      this.handleReset('deptForm')
    },
    // 模态框点击确定按钮
    handleSubmit() {
      this.$refs.deptForm.validate(async (valid) => {
        if (valid) {
          let params = { ...this.deptForm, ...action }
          delete params.userEmail
          let res = await this.$api.deptOperate(params)
          if (res) {
            this.showModel = false
            this.handleReset('deptForm')
            this.$message.success('操作成功')
          }
        }
      })
    },
    // 负责人选择的改变change
    handleUser(val) {
      // 这里的val拿到的就是用户的id，名字，和邮箱
      const [userId, userName, userEmail] = val.split('/')
      // 浅拷贝
      Object.assign(this.deptForm, { userId, userName, userEmail })
    },
  }
}
</script>