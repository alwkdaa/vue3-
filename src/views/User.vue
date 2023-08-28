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
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button type="danger" @click="handlePatchDelete">批量删除</el-button>
      </div>
      <el-table :data="userList" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" background layout="prev, pager,next" :total="pager.total" @current-change="handleCurrentChange"></el-pagination>
    </div>
    <!-- 用户新增 -->
    <el-dialog title="用户新增" v-model="showModal" :before-close="handleClose">
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
import { onMounted, reactive, getCurrentInstance, ref, toRaw } from 'vue';
import utils from '../utils/utils'
export default {
  name: 'User',
  setup() {
    // 获取全局对象类似于options api里面的this
    const { proxy } = getCurrentInstance()
    // Mounted生命周期函数
    onMounted(() => {
      getUserList()
      getRoleList()
      getDeptList()
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
        prop: "role",
        formatter(row,column,value){
          return{
            0:'管理员',
            1:'普通用户'
          }[value]
        }
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row,column,value){
          return{
            1:'在职',
            2:'离职',
            3:'试用期'
          }[value]
        }
      },
      {
        label: "注册时间",
        prop: "createTime",
        formatter(row,column,value){
          return utils.formateDate(new Date(value))
        }
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
        formatter(row,column,value){
          return utils.formateDate(new Date(value))
        }
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
    const handleReset = (form) => {
      proxy.$refs[form].resetFields()
    };
    // 分页的点击
    const handleCurrentChange = (current) => {
      pager.pageNum = current
      getUserList()
    }
    // 删除按钮
    const handleDelete = async (row) => {
      const res = await proxy.$api.userDelete({
        userIds: [row.userId]
      })
      if(res.modifiedCount>0){
        proxy.$message.success('删除成功')
        getUserList()
      }else{
        proxy.$message.error('删除失败')
      }
    }
    // 要删除的用户id的集合
    const checkedUsersIds = ref([])
    // 批量删除按钮
    const handlePatchDelete = async () => {
      if(checkedUsersIds.value.length == 0){
        proxy.$message.error("请选择要删除的用户")
        return
      }
      const res = await proxy.$api.userDelete({
        userIds: checkedUsersIds.value
      })
      if(res.nModified>0){
        proxy.$message.success('删除成功')
        getUserList()
      }else{
        proxy.$message.success('删除失败')
      }

    }
    // 多选的方法
    const handleSelectionChange = (list)=> {
      let arr = []
      list.forEach(ele => {
        arr.push(ele.userId)
      });
      checkedUsersIds.value = arr
    }
    /* 用户新增 */
    // 控制新增用户页面的展示
    const showModal = ref(false)
    // 新增按钮
    const handleCreate = () => {
      action.value = 'add'
      showModal.value = true
    }
    // 新增表单的信息
    const userForm = reactive({
      state:1
    })
    // 表单验证规则
    const rules = reactive({
      userName: [
        {
          required: true,
          message: "请输入用户名称",
          trigger: "blur"
        }
      ],
      userEmail: [
        {
          required: true,
          message: "请输入用户邮箱",
          trigger: "blur"
        }
      ],
      deptId: [
        {
          required: true,
          message: "请选择部门",
          trigger: "blur"
        }
      ],
      mobile:[
        {
          pattern:/1[3-9]\d{9}/,
          message:"请输入正确的手机格式",
          trigger: "blur"
        }
      ]
    })
    // 角色名称列表
    const roleList = ref([])
    // 调用获取角色名称列表
    const getRoleList = async () => {
      const res = await proxy.$api.getRoleList()
      roleList.value = res
    }
    // 部门列表
    const deptList = ref([])
    // 调用获取部门列表
    const getDeptList = async () => {
      const res = await proxy.$api.getDeptList()
      deptList.value = res
    }
    // 点击取消触发的方法
    const handleClose = () => {
      showModal.value = false
      handleReset('dialogForm')
    }
    // 因为添加用户的参数中有一个action来判断是新增还是编辑，需要绑定成动态的
    const action = ref('add')
    //点击确定触发的方法
    const handleSubmit =  () => {
      // 先验证新增用户的表单填写了
      proxy.$refs.dialogForm.validate(async (valid) => {
        if(valid){
          // 这个toRaw会将双向绑定的userForm对象变为普通的对象
          let params = toRaw(userForm)
          params.userEmail += '@jason.com'
          params.action = action.value
          let res = await proxy.$api.userSubmit(params)
          if(res){
            showModal.value = false
            if(action.value == 'add'){
              proxy.$message.success('新增用户成功')
            }else{
              proxy.$message.success('编辑用户成功')
            }
            
            handleReset("dialogForm")
            getUserList()
          }
        }
      })
      
    }
    /* 用户编辑 */
    const handleEdit = (row) => {
      // 编辑的时候是不允许修改用户名的
      action.value = "edit"
      showModal.value = true
      // 浅拷贝将数据整合在一起，这里的row就是编辑得用户数据,这里会出现一个bug在点击新增得时候也会拿到用户的数据，要想新增得时候是空白就需要让页面完全渲染完成之后再去进行浅拷贝
      proxy.$nextTick(() => {
        row.state = Number(row.state)
        Object.assign(userForm,row)
      })
      
    }
    return {
      user,
      userList,
      columns,
      pager,
      checkedUsersIds,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleDelete,
      handlePatchDelete,
      handleSelectionChange,
      showModal,
      handleCreate,
      userForm,
      rules,
      roleList,
      getRoleList,
      deptList,
      getDeptList,
      handleClose,
      handleSubmit,
      handleEdit,
      action
    }
  },
}
</script>