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
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
      <el-table :data="applyList" style="width: 100%" >
        <el-table-column type="selection" width="55" />
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleDetail(scope.row)" >查看</el-button>
            <el-button type="danger" size="mini"  @click="handleDelete(scope.row._id)">作废</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination background layout="prev, pager, next" :total="pager.total" class="pagination"
        :page-size="pager.pageSize" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog title="申请休假" v-model="showModal" :before-close="handleCloseDialog" width="70%">
      <el-form :model="leaveForm" label-width="100px" ref="dialogForm" :rules="rules">
        <el-form-item prop="applyType" label="休假类型">
          <el-select v-model="leaveForm.applyType">
            <el-option :value="1" label="事假"></el-option>
            <el-option :value="2" label="调休"></el-option>
            <el-option :value="3" label="年假"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假日期" required>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="startTime">
                <el-date-picker placeholder="请选择开始日期" v-model="leaveForm.startTime" type="date"
                  @change="(val) => handleDateChange('startTime', val)" />
              </el-form-item>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="8">
              <el-form-item prop="endTime">
                <el-date-picker placeholder="请选择结束日期" v-model="leaveForm.endTime" type="date" @change="(val) => handleDateChange('endTime', val)" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="leaveTime" required label="休假时长">
          {{ leaveForm.leaveTime }}
        </el-form-item>
        <el-form-item prop="reasons"  label="休假原因">
          <el-input type="textarea" :row="3" placeholder="请输入休假原因" v-model="leaveForm.reasons"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="申请休假详情" width="50%" v-model="showDetailModal">
      <el-steps
        :active="detail.applyState > 2 ? 3 : 1"
        :process-status="detail.applyState ==2?'finish':'process'"
        :finish-status="getstatus(detail.applyState)"
      >
        <el-step title="待审批"></el-step>
        <el-step title="审批中"></el-step>
        <el-step  title="审批通过/审批拒绝"></el-step>
      </el-steps>
      <el-form label-width="120px" label-suffix=":">
        <el-form-item label="休假类型">
          <div>
            {{ detail.applyTypeName }}
          </div>
        </el-form-item>
        <el-form-item label="休假时间">
          <div>
            {{ detail.time }}
          </div>
        </el-form-item>
        <el-form-item label="休假时长">
          <div>
            {{ detail.leaveTime }}
          </div>
        </el-form-item>
        <el-form-item label="休假原因">
          <div>
            {{ detail.reasons }}
          </div>
        </el-form-item>
        <el-form-item label="审批状态">
          <div>
            {{ detail.applyStateName }}
          </div>
        </el-form-item>
        <el-form-item label="审批人">
          <div>
            {{ detail.curAuditUserName }}
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
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
          return utils.formateDate(new Date(row.startTime), 'yyyy-MM-dd') + '到' + utils.formateDate(new Date(row.endTime), 'yyyy-MM-dd')
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
      let params = { ...queryForm, ...pager }
      let { list, page } = await proxy.$api.getApplyList(params)
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
      pageSize: 10,
      total: 10,
    })
    // 查找重置
    const handleReset = (form) => {
      proxy.$refs[form].resetFields()
    }
    // 分页点击
    const handleCurrentChange = (current) => {
      pager.pageNum = current
    }
    const showDetailModal = ref(false);
    let detail = ref({});
    // 查看按钮
    const handleDetail = (row) =>{
      showDetailModal.value = true;
      let data = { ...row };
      data.applyTypeName = {
        1: "事假",
        2: "调休",
        3: "年假",
      }[data.applyType];
      data.time =
        utils.formateDate(new Date(data.startTime), "yyyy-MM-dd") +
        "到" +
        utils.formateDate(new Date(data.endTime), "yyyy-MM-dd");

      data.applyStateName = {
        1: "待审批",
        2: "审批中",
        3: "审批拒绝",
        4: "审批通过",
        5: "作废",
      }[data.applyState];
      detail.value = data;
      showDetailModal.value = true;
    }
    function getstatus(status){
        switch(status){
          case 4:
            return 'success'
          case 5:
            return 'error'
          case 3:
          return 'error'
          case 1:
          return 'finish'
          case 2:
          return 'success'
        }
    }
    // 作废按钮
    const handleDelete = async (_id) => {
      try {
        let params = { _id, action: "delete" };
        let res = await proxy.$api.leaveOperate(params);
        proxy.$message.success("删除成功");
        getApplyList();
        await proxy.$store.dispatch("noticeCountGet")
      } catch (error) {}
    };
    // dialog
    const showModal = ref(false)
    const leaveForm = reactive({
      applyType: 1,
      startTime: "",
      endTime: "",
      leaveTime: "0天",
      reasons: ""
    })
    const action = ref('create')
    // 验证规则
    const rules = reactive({
      applyType:[
        {
          required: true,
          message: "请选择休假类型",
          trigger:["change","blur"],
        }
      ],
      startTime: [
        {
          type:'date',
          required: true,
          message: "请选择开始时间",
          trigger:["change","blur"],
        }
      ],
      endTime: [
        {
          type:'date',
          required: true,
          message: "请选择结束时间",
          trigger:["change","blur"],
        }
      ],
      reasons: [
        {
          required: true,
          message: "请输入休假原因",
          trigger:["change","blur"],
        }
      ],
    })
    // 申请休假
    const handleApply = () => {
      showModal.value = true
      action.value = 'create'
    }
    // 取消按钮
    const handleClose = () => {
      showModal.value = false
      handleReset("dialogForm")
    }
    const handleCloseDialog = ()=>{
      showModal.value = false
      handleReset("dialogForm")
    }
    // 确定按钮
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          try {
            let params = { ...leaveForm, action: action.value }
            let res = await proxy.$api.leaveOperate(params)
            proxy.$message.success("创建成功")
            handleClose()
            getApplyList()
          } catch (error) { }

        }
      })
    }
    // 开始时间的方法
    const handleDateChange = (key, val) => {
      let { startTime, endTime } = leaveForm
      if (!startTime || !endTime) return
      if (startTime > endTime) {
        proxy.$message.error("开始日期不能晚于结束日期")
        leaveForm.leaveTime = "0天"
        leaveForm[key] = ""
      } else {
        leaveForm.leaveTime = (endTime - startTime) / (24 * 60 * 60 * 1000) + 1 + "天"
      }
    }
    return {
      columns,
      queryForm,
      applyList,
      pager,
      showModal,
      leaveForm,
      action,
      rules,
      showDetailModal,
      detail,
      handleDetail,
      handleCurrentChange,
      getApplyList,
      handleApply,
      handleReset,
      handleClose,
      handleSubmit,
      handleDateChange,
      getstatus,
      handleCloseDialog,
      handleDelete
    };
  },
};
</script>

<style lang="scss"></style>