<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState">
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
        <el-button type="primary" @click="handleAdd(1)">创建</el-button>
      </div>
      <el-table :data="menuList" style="width: 100%" row-key="_id">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter" />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleAdd(2,scope.row)">新增</el-button>
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 菜单新增 -->
    <el-dialog title="菜单新增" v-model="showModal" :before-close="handleCloseDialog">
      <el-form :model="menuForm" ref="dialogForm" label-width="100px" :rules="rules">
        <el-form-item prop="parentId" label="父级菜单">
          <el-cascader v-model="menuForm.parentId" :options="menuList" :props="{ checkStrictly:true,value:'_id', label:'menuName' }" clearable></el-cascader>
          <span>不选择默认是创建一级菜单</span>
        </el-form-item>
        <el-form-item prop="menuType" label="菜单类型">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :value="1">菜单</el-radio>
            <el-radio :value="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="menuName" label="菜单名称">
          <el-input placeholder="请输入菜单名称" v-model="menuForm.menuName"></el-input>
        </el-form-item>
        <el-form-item prop="icon" label="菜单图标">
          <el-input placeholder="请输入菜单图标" v-model="menuForm.icon"></el-input>
        </el-form-item>
        <el-form-item prop="path" label="路由地址">
          <el-input placeholder="请输入路由地址" v-model="menuForm.path"></el-input>
        </el-form-item>
        <el-form-item prop="menuCode" label="权限标识">
          <el-input placeholder="请输入权限标识" v-model="menuForm.menuCode"></el-input>
        </el-form-item>
        <el-form-item prop="component" label="组件路径">
          <el-input placeholder="请输入组件路径" v-model="menuForm.component"></el-input>
        </el-form-item>
        <el-form-item prop="menuState" label="菜单状态">
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="2">停用</el-radio>
          </el-radio-group>
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
      queryForm:{
        menuState:1,
      },
      menuForm:{},
      menuList:[],
      // 控制新增编辑的模态框显示
      showModal:false,
      // 新增和编辑的标识
      action: 'add',
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