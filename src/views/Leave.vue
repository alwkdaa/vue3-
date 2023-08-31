<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getApplyList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">申请休假</el-button>
      </div>
      <el-table :data="applyList" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter" />
        <el-table-column label="操作" width="150">
          <template>
            <el-button type="primary" size="mini">查看</el-button>
            <el-button type="danger" size="mini">作废</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination background layout="prev, pager, next" :total="pager.total" class="pagination"
        :page-size="pager.pageSize" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
<!--     <el-dialog :title="action === 'add' ? '用户新增' : '编辑用户'" v-model="showModal" :before-close="handleCloseDialog">
      <el-form :model="userForm" label-width="120px" ref="dialogForm" :rules="rules">
        <el-form-item prop="userName" label="用户名">
          <el-input placeholder="请输入用户名称" v-model="userForm.userName" :disabled="action == 'edit'" />
        </el-form-item>
        <el-form-item prop="userEmail" label="邮箱">
          <el-input placeholder="请输入用户邮箱" v-model="userForm.userEmail" :disabled="action == 'edit'">
            <template #append> @jason.com </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input placeholder="请输入手机号" v-model="userForm.mobile" />
        </el-form-item>
        <el-form-item prop="job" label="岗位">
          <el-input placeholder="请输入岗位" v-model="userForm.job" />
        </el-form-item>
        <el-form-item prop="state" label="状态">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="roleList" label="系统角色">
          <el-select v-model="userForm.roleList" placeholder="请选择用户角色" multiple style="width: 100%">
            <el-option v-for="role in roleList" :key="role._id" :label="role.roleName" :value="role._id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="deptId" label="部门">
          <el-cascader v-model="userForm.deptId" placeholder="请选择所属部门" :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog> -->
  </div>
</template>

<script>
import { reactive, onMounted, getCurrentInstance, ref, toRaw } from "vue";
import utils from "../utils/utils";
export default {
  name: "Leave",
  setup() {
    const { proxy } = getCurrentInstance();
    const columns = reactive([
      {
        label: "单号",
        prop: "orderNo",
      },
      {
        label: "休假时间",
        formatter(row, column, value) {
          return utils.formateDate(new Date(row.startTime),'yyyy-MM-dd') + '到' + utils.formateDate(new Date(row.endTime),'yyyy-MM-dd')
        },
      },
      {
        label: "休假时长",
        prop: "leaveTime",
      },
      {
        label: "休假类型",
        prop: "applyType",
        formatter(row, column, value) {
          return {
            1: "事假",
            2: "调休",
            3: "年假",
          }[value];
        },
      },
      {
        label: "休假原因",
        prop: "reason",
      },
      {
        label: "申请时间",
        prop: "createTime",
        formatter(row, column, value) {
          return utils.formateDate(new Date(value));
        },
      },
      {
        label: "审批人",
        prop: "auditUsers",
      },
      {
        label: "当前审批人",
        prop: "curAuditUserName",
      },
      {
        label: "审批状态",
        prop: "applyState",
        formatter(row, column, value) {
          return {
            1: "待审批",
            2: "审批中",
            3: "审批拒绝",
            4: "审批通过",
            5: "作废",
          }[value];
        },
      },
    ]);
    onMounted(() => {
      getApplyList();
    });
    const getApplyList = async () => {
      let params = {...queryForm, ...pager}
      let { list, page} = await proxy.$api.getApplyList(params)
      applyList.value = list
      pager.total = page.total
    }
    // 查找的数据
    const queryForm = reactive({
      applyState: ''
    })
    // 申请列表
    const applyList = ref([])
    // 分页的配置
    const pager = reactive({
      pageNum: 1,
      pageSize:10,
      total: 10,
    })
    // 查找重置
    const handleReset = (form) => {
      proxy.$refs[form].resetFields()
    }
    // 分页点击
    const handleCurrentChange = (current)=> {
      pager.pageNum = current
    }
    return {
      columns,
      queryForm,
      applyList,
      pager,
      handleReset,
      handleCurrentChange,
      getApplyList,
    };
  },
};
</script>

<style lang="scss"></style>