<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
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
            <el-button size="mini" @click="handlePermission(scope.row)">设置权限</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" background layout="prev, pager,next" :total="pager.total"
        @current-change="handleCurrentChange"></el-pagination>
    </div>
    <!-- 角色新增 -->
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
    </el-dialog>
    <!-- 权限管理 -->
    <el-dialog title="设置权限" v-model="showPermission" :before-close="handlePermissionCloseDialog">
      <el-form label-width="100px">
        <el-form-item prop="roleName" label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item prop="remark" label="选择权限">
          <el-tree :data="menuList" show-checkbox node-key="_id" :props="{ label: 'menuName' }" default-expand-all
            ref="permissionTree"></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission = false">取消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit">
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
  name: 'Role',
  data() {
    return {
      showModal: false,
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
          prop: 'permissionList',
          formatter: (row, column, value) => {
            let names = []
            let list = value.halfCheckedKeys || []
            list.map((key) => {
              if (key) names.push(this.actionMap[key])
            })
            return names.join(',')
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
      pager: {
        total: 0,
        pageSize: 10
      },
      roleForm: {},
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
      action: 'add',
      // 控制权限管理的模态框展示
      showPermission: false,
      curRoleName: '',
      curRoleId: '',
      menuList: [],
      actionMap: {},
    }
  },
  mounted() {
    this.getRoleList()
    this.getMenuList()
  },
  methods: {
    async getRoleList() {
      const { list, page } = await this.$api.roleList({ ...this.queryForm, ...this.pager })
      this.pager = page
      this.roleList = list
    },
    // 创建按钮
    handleAdd() {
      this.showModal = true
      this.action = 'create'
    },
    // 取消按钮
    handleClose() {
      this.handleReset('dialogForm')
      this.showModal = false
    },
    // 重置按钮
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    handleCloseDialog() {
      this.handleReset('dialogForm')
      this.showModal = false
    },
    // 确定按钮
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let { roleForm, action } = this
          // console.log(this.roleForm.roleName,action);
          let params = { ...roleForm, action }
          let res = await this.$api.roleOperate(params)
          if (res) {
            this.showModal = false
            this.$message.success('创建成功')
            this.handleReset('dialogForm')
            this.getRoleList()
          }
        }
      })
    },
    // 编辑按钮
    handleEdit(row) {
      this.action = 'edit'
      this.showModal = true
      this.$nextTick(() => {
        this.roleForm = { _id:row._id, roleName: row.roleName, remark: row.remark }
      })
    },
    // 删除按钮
    async handleDelete(_id) {
      await this.$api.roleOperate({ _id, action: 'delete' })
      this.$message.success('删除成功')
      this.getRoleList()
    },
    // 设置权限模态框的关闭
    handlePermissionCloseDialog() {
      this.showPermission = false

    },
    handlePermission(row) {
      this.showPermission = true
      this.curRoleId = row._id
      this.curRoleName = row.roleName
      const { checkedKeys } = row.permissionList
      setTimeout(() => {
        this.$refs.permissionTree.setCheckedKeys(checkedKeys)
      });

    },
    async getMenuList() {
      const list = await this.$api.menuList()
      this.menuList = list
      this.getActionMap(list)
    },
    getActionMap(list) {
      let actionMap = {}
      // 使用递归实现
      const deep = (arr) => {
        let item = arr.pop()
        if (item.children && item.action) {
          actionMap[item._id] = item.menuName
        }
        if (item.children && !item.action) {
          deep(item.children)
        }
      }
      deep(JSON.parse(JSON.stringify(list)))
      this.actionMap = actionMap
    },
    // 点击确定按钮
    async handlePermissionSubmit() {
      console.log(this.$refs.permissionTree);
      let nodes = this.$refs.permissionTree.getCheckedNodes()
      let halfKeys = this.$refs.permissionTree.getHalfCheckedKeys()
      let checkedKeys = []
      let parentKeys = []
      nodes.map(node => {
        // 如果node没有childern，就是按钮级别
        if (!node.children) {
          checkedKeys.push(node._id)
        } else {
          parentKeys.push(node._id)
        }
      })
      let params = {
        _id: this.curRoleId,
        permissionList: {
          // checkedKeys存放的就是按钮级别的菜单
          checkedKeys,
          // halfCheckedKeys存放的就是菜单
          halfCheckedKeys: parentKeys.concat(halfKeys)
        }
      }
      await this.$api.updatePermission(params)
      this.showPermission = false
      this.$message.success('设置成功')
      this.getRoleList()
    },
    // 分页按钮
    handleCurrentChange(current) {
      this.pager.pageNum = current
      this.getRoleList()
    }
  }
}
</script>