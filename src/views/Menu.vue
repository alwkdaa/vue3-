<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="menuForm" ref="form">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="menuForm.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
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
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </div>
      <el-table :data="menuList" style="width: 100%" row-key="_id">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter" />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleAdd(scope.row)">新增</el-button>
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 菜单新增 -->
    <el-dialog title="用户新增" v-model="showModal" :before-close="handleCloseDialog">
      <el-form :model="userForm" ref="dialogForm" label-width="100px" :rules="rules">
        <el-form-item prop="userName" label="用户名">
          <el-input placeholder="请输入用户名" v-model="userForm.userName" :disabled="action == 'edit'"></el-input>
        </el-form-item>
        <el-form-item prop="userEmail" label="邮箱">
          <el-input placeholder="请输入邮箱" v-model="userForm.userEmail" :disabled="action == 'edit'">
            <template #append>@jason.com</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input placeholder="请输入手机号" v-model="userForm.mobile"></el-input>
        </el-form-item>
        <el-form-item prop="job" label="岗位">
          <el-input placeholder="请输入岗位" v-model="userForm.job"></el-input>
        </el-form-item>
        <el-form-item prop="state" label="状态">
          <el-select v-model="userForm.state" >
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="roleList" label="系统角色">
          <el-select v-model="userForm.roleList" placeholder="请选择用户系统角色" multiple style="width:100%">
            <el-option v-for="role in roleList" :key="role._id" :value="role._id" :label="role.roleName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="deptId" label="部门">
           <el-cascader placeholder="请选择部门" v-model="userForm.deptId" :options="deptList" :props="{ checkStrictly: true, value:'_id', label:'deptName' }" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          确定
        </el-button>
      </span>
    </template>
    </el-dialog>
  </div>
</template>
<script>
import utils from '../utils/utils';
export default{
  name:'Menu',
  data(){
    return{
      // 菜单表单
      menuForm:{
        menuState:1,
      },
      menuList:[],
      // table列的配置
      columns:[
        {
          label:'菜单名称',
          prop:'menuName',
        },
        {
          label:'图标',
          prop:'icon',
        },
        {
          label:'权限标识',
          prop:'menuCode',
        },
        {
          label:'路由地址',
          prop:'path',
        },
        {
          label:'组件路径',
          prop:'component',
        },
        {
          label:'菜单状态',
          prop:'menuState',
          formatter(row,column,value){
            return{
              1:'正常',
              2:'停用'
            }[value]
          }
        },
        {
          label:'创建时间',
          prop:'createTime',
          formatter(row,column,value){
            return utils.formateDate(new Date(value))
          }
        },
      ]
    }
  },
  mounted(){
    this.getMenuList()
  },
  methods:{
    // 调用获取菜单数据接口
    async getMenuList(params){
      let res = await this.$api.menuList(params)
      console.log(res);
      this.menuList = res
    },
    // 查询按钮
    handleQuery(){
      console.log("111");
    },
    // 重置按钮
    handleReset(){
      console.log("111");
    },
    // 创建按钮
    handleAdd(){

    },
    // 编辑按钮
    handleEdit(){

    },
    // 删除按钮
    handleDelete(){

    }
  }
}
</script>