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
        <el-button type="primary">创建</el-button>
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
  </div>
</template>
<script>
export default {
  name:'Dept',
  data(){
    return {
      queryForm: {
        deptName: ""
      },
      column:[
        {
          label:"部门名称",
          prop:"deptName"
        },
        {
          label: "负责人",
          prop: "userName"
        },
        {
          label:"更新时间",
          prop:"updateTime"
        },
        {
          label:"创建时间",
          prop:"createTime"
        }
      ],
      deptList:[],
      pager:{
        pageNum:1,
        pageSize:10
      }
    }
  },
  mounted(){
    this.getDeptList()
  },
  methods:{
    // 获取部门列表
    async getDeptList(){
      let list = await this.$api.getDeptList(this.queryForm)
      this.deptList = list
    },
    handleEdit(){},
    handleDelete(){},
  }
}
</script>