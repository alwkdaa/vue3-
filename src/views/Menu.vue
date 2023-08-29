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
            <el-button type="primary" size="mini" @click="handleAdd(2, scope.row)">新增</el-button>
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 菜单新增 -->
    <el-dialog title="菜单新增" v-model="showModal" :before-close="handleCloseDialog">
      <el-form :model="menuForm" ref="dialogForm" label-width="100px" :rules="rules">
        <el-form-item prop="parentId" label="父级菜单">
          <el-cascader v-model="menuForm.parentId" :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }" clearable></el-cascader>
          <span>不选择默认是创建一级菜单</span>
        </el-form-item>
        <el-form-item prop="menuType" label="菜单类型">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="menuName" label="菜单名称">
          <el-input placeholder="请输入菜单名称" v-model="menuForm.menuName"></el-input>
        </el-form-item>
        <el-form-item prop="icon" label="菜单图标" v-show="menuForm.menuType === 1">
          <el-input placeholder="请输入菜单图标" v-model="menuForm.icon"></el-input>
        </el-form-item>
        <el-form-item prop="path" label="路由地址" v-show="menuForm.menuType === 1">
          <el-input placeholder="请输入路由地址" v-model="menuForm.path"></el-input>
        </el-form-item>
        <el-form-item prop="menuCode" label="权限标识" v-show="menuForm.menuType === 2">
          <el-input placeholder="请输入权限标识" v-model="menuForm.menuCode"></el-input>
        </el-form-item>
        <el-form-item prop="component" label="组件路径" v-show="menuForm.menuType === 1">
          <el-input placeholder="请输入组件路径" v-model="menuForm.component"></el-input>
        </el-form-item>
        <el-form-item prop="menuState" label="菜单状态" v-show="menuForm.menuType === 1">
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
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
export default {
  name: 'Menu',
  data() {
    return {
      // 菜单查询的表单
      queryForm: {
        menuState: 1,
      },
      // 新增和编辑模态框的表单
      menuForm: {
        menuType: 1,
        menuState: 1
      },
      menuList: [],
      // 控制新增编辑的模态框显示
      showModal: false,
      // 新增和编辑的标识
      action: 'add',
      // table列的配置
      columns: [
        {
          label: '菜单名称',
          prop: 'menuName',
        },
        {
          label: '图标',
          prop: 'icon',
        },
        {
          label: '权限标识',
          prop: 'menuCode',
        },
        {
          label: '路由地址',
          prop: 'path',
        },
        {
          label: '组件路径',
          prop: 'component',
        },
        {
          label: '菜单状态',
          prop: 'menuState',
          formatter(row, column, value) {
            return {
              1: '正常',
              2: '停用'
            }[value]
          }
        },
        {
          label: '创建时间',
          prop: 'createTime',
          formatter(row, column, value) {
            return utils.formateDate(new Date(value))
          }
        },
      ],
      // 表单验证规则
      rules: {
        menuName: [
          {
            required: true,
            message: '请输入菜单的名称',
            trgger:"blur"
          },
          {
            min:2,
            max:10,
            message: '长度在2-8个字符',
            trgger:"blur"
          }
        ]
      }
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    // 调用获取菜单数据接口
    async getMenuList() {
      let res = await this.$api.menuList(this.menuForm)
      console.log(res);
      this.menuList = res
    },
    // 查询按钮
    handleQuery() {
      this.menuForm.menuName = this.queryForm.menuName
      this.menuForm.menuState = this.queryForm.menuState
      // 直接调用获取菜单列表数据
      this.getMenuList()
    },
    // 重置按钮
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    // 创建按钮
    handleAdd(type, row) {
      this.showModal = true
      this.action = "add"
      if(type == 2){
        // console.log("2");
        this.menuForm.parentId = [...row.parentId, row._id].filter(item => item)
      }
    },
    // 编辑按钮
    handleEdit(row) {
      // row是传进来的所要编辑的菜单数据
      this.showModal = true
      this.action = 'edit'
      this.$nextTick(() => {
        Object.assign(this.menuForm, row)
      })
    },
    // 删除按钮
    async handleDelete() {
      await this.$api.menuSubmit({_id,action:'delete'})
      this.$message.success('删除成功')
      this.getMenuList()
    },
    // 模态框的叉号
    handleCloseDialog() {
      this.handleReset('dialogForm')
      this.showModal = false
    },
    // 模态框取消按钮
    handleClose() {
      this.handleReset('dialogForm')
      this.showModal = false
    },
    // 模态框确认按钮
    handleSubmit() {
      // 先对dialogForm进行验证，验证表单是否通过rules验证，验证通过再进行下一步
      this.$refs.dialogForm.validate(async (valid) => {
        if(valid){
          // 验证通过调用新增的接口，因为新增编辑和删除都是同一个接口，所以要传递调用的类型是新增还是编辑还是删除，所以要先对params进行处理
          let {action, menuForm} = this
          // 将表单数据与接口类型action整合在一起
          let params = {...menuForm, action}
          await this.$api.menuSubmit(params)
          // 使模态框关闭
          this.showModal = false
          //提示操作成功
          this.$message.success('操作成功')
          // 重置表单数据
          this.handleReset('dialogForm')
          // 重新获取菜单列表数据
          this.getMenuList()
        }
        
      })
    }
  }
}
</script>