<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" >查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </div>
      <el-table :data="roleList" style="width: 100%" row-key="_id">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter" />
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini">设置权限</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" background layout="prev, pager,next" :total="pager.total" @current-change="handleCurrentChange"></el-pagination>
    </div>
    <!-- 菜单新增 -->
   <el-dialog title="角色新增" v-model="showModal" :before-close="handleCloseDialog">
      <el-form :model="roleForm" ref="dialogForm" label-width="100px" :rules="rules">
        <el-form-item prop="roleName" label="角色名称">
          <el-input placeholder="请输入角色的名称" v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input type="text-area" :row="2" placeholder="请输入角色的备注" v-model="roleForm.remark"></el-input>
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
    </el-dialog> -->
  </div>
</template>
<script>
import utils from '../utils/utils';
export default {
  name: 'Role',
  data() {
    return {
      showModal:false,
      // 菜单查询的表单
      queryForm: {
        roleName: '',
      },
      roleList: [],
      // table列的配置
      columns: [
        {
          label: '角色名称',
          prop: 'roleName',
        },
        {
          label: '备注',
          prop: 'remark',
        },
        {
          label: '权限列表',
          prop: 'menuType',
        },
        {
          label: '创建时间',
          prop: 'createTime',
          formatter(row, column, value) {
            return utils.formateDate(new Date(value))
          }
        },
      ],
      pager:{
        total:0,
        pageSize:10
      },
      roleForm:{},
      //dialog表单的验证规则
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
        ],
      },
      action:'add'
    }
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    async getRoleList(){
      const {list,page} = await this.$api.roleList(this.queryForm)
      this.pager = page
      this.roleList = list
    },
    // 创建按钮
    handleAdd(){
      this.showModal = true
      this.action = 'add'
    },
    // 取消按钮
    handleClose(){
      this.handleReset('dialogForm')
      this.showModal = false
    },
    // 重置按钮
    handleReset(form){
      this.$refs[form].resetFields()
    },
    handleCloseDialog(){
      this.handleReset('dialogForm')
      this.showModal = false
    },
    // 确定按钮
    handleSubmit(){
      this.$refs.dialogForm.validate(async (valid) => {
        if(valid){
          let { roleName, action} = this
          let params = { ...roleName, action}
          let res = await this.$api.roleOperate(params)
          if(res){
            this.showModal = false
            this.$message.success('创建成功')
            this.handleReset('dialogForm')
            this.getRoleList()
          }
        }
      })
    },
    // 编辑按钮
    handleEdit(row){
      this.action = 'edit'
      this.showModal = true
      this.$nextTick(()=>{
        this.roleForm = row
      })
    },
    // 删除按钮
    async handleDelete(_id){
      await this.$api.roleOperate({_id,action:'delete'})
      this.$message.success('删除成功')
      this.getRoleList()
    }
  }
}
</script>