<template>
  <el-card shadow="never">
    <div class="debugMode-wrap">
      <el-button type="primary" size="large" @click="openDebugMode('add')">新增</el-button>
      <div class="ignore-select-wrap">
        <el-input size="large" clearable v-model="searchUser" placeholder="请输入要搜索的调试人..." :suffix-icon="Search" @change="getReport(1)" />
      </div>
    </div>
    <el-table ref="debugModeTableRef" :data="tableData" style="width: 100%; margin-top: 10px" v-loading="loading">
      <el-table-column property="name" label="平台名称" align="center" />
      <el-table-column property="uptime" label="硬件型号" :formatter="dateFormatter" width="220" align="center" />
      <el-table-column property="user" label="调试人" align="center" />
      <el-table-column property="uptime" label="调试时间" :formatter="dateFormatter" width="220" align="center" />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="openDebugMode('edit', scope.row.id)">编辑</el-button>
          <el-button link type="primary" size="small" @click="toMark(scope.row.id)">一键升降</el-button>
          <el-button link type="primary" size="small" @click="toDetail(scope.row.id, 'history')">Debug</el-button>
          <el-popconfirm title="确定删除这个平台?" trigger="click" confirm-button-text="确认删除" cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button link type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :small="false"
      :background="false"
      layout="total, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <el-dialog v-model="debugModeDialog" :title="titleDialog" width="35%" @close="handleClose">
    <span>
      <el-form :inline="false" :model="form" ref="addDebugModeRuleFormRef" :rules="addDebugModeFormRules" class="debugMode-form" label-width="150px">
        <el-form-item label="平台名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入..." />
        </el-form-item>
        <el-form-item label="硬件型号" prop="model">
          <el-input v-model="form.model" placeholder="请输入..." />
        </el-form-item>
        <el-form-item label="调试人" prop="user">
          <el-input v-model="form.user" placeholder="请输入..." />
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onReseDebugModeRuleForm(addDebugModeRuleFormRef)">取消</el-button>
        <el-button type="primary" @click="onSubmitDebugModeForm(addDebugModeRuleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import { getReportApi } from '@/api/APV/testReport.js'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { utc2beijing } from '@/utils/util.js'
import { Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const route = useRoute()
const router = useRouter()
const debugModeTableRef = ref()
const tableData = ref([
  { name: '平台一', model: '型号一', user: '管理员', uptime: '2023/3/8 14:25:23' },
  { name: '平台一', model: '型号一', user: '管理员', uptime: '2023/3/8 14:25:23' },
  { name: '平台一', model: '型号一', user: '管理员', uptime: '2023/3/8 14:25:23' },
  { name: '平台一', model: '型号一', user: '管理员', uptime: '2023/3/8 14:25:23' },
  { name: '平台一', model: '型号一', user: '管理员', uptime: '2023/3/8 14:25:23' },
  { name: '平台一', model: '型号一', user: '管理员', uptime: '2023/3/8 14:25:23' },
  { name: '平台一', model: '型号一', user: '管理员', uptime: '2023/3/8 14:25:23' },
  { name: '平台一', model: '型号一', user: '管理员', uptime: '2023/3/8 14:25:23' },
  { name: '平台一', model: '型号一', user: '管理员', uptime: '2023/3/8 14:25:23' }
])
const isShowMarkDialog = ref(false)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchUser = ref('')
const searchBuild = ref('')
const searchGroup = ref('')
const debugModeDialog = ref(false)
const titleDialog = ref('')
const form = ref({
  name: '',
  model: '',
  user: ''
})
const addDebugModeRuleFormRef = ref<FormInstance>()
const addDebugModeFormRules = reactive<FormRules>({
  name: [{ required: true, message: '平台名称不能为空', trigger: 'blur' }],
  model: [{ required: true, message: '硬件型号不能为空', trigger: 'blur' }],
  user: [{ required: true, message: '调试人不能为空', trigger: 'blur' }]
})

const getReport = async (page) => {
  let build = searchBuild.value
  let user = searchUser.value
  let res = await getReportApi({ page, build, state: searchGroup.value, user })
  if (res.code === 1000) {
    tableData.value = res.data
    total.value = res.total
  }
}

const handleDelete = (id) => {
  console.log(id)
}

// 新增编辑弹窗
const openDebugMode = (type, id?) => {
  switch (type) {
    case 'add':
      debugModeDialog.value = true
      titleDialog.value = '新增调试平台'
      break
    case 'edit':
      debugModeDialog.value = true
      titleDialog.value = '编辑调试平台'
      break
  }
}

// 跳转详情
const toDetail = (id, type) => {
  switch (type) {
    case 'detail': {
      router.push({
        path: '/APVAuto/reportDetail',
        query: {
          resultid: id
        }
      })
      break
    }
    case 'history':
      router.push(`/APVAuto/historyReport/${id}`)
      break
    case 'FailNumDetail':
      router.push({
        path: `/APVAuto/templateReport/failNumDetail`,
        query: {
          reportId: id
        }
      })
    default:
      break
  }
}

const dateFormatter = (row, column) => {
  let date = row[column.property]
  return utc2beijing(date)
}

const toMark = (id) => {
  isShowMarkDialog.value = true
}

const onReseDebugModeRuleForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  debugModeDialog.value = false
}

const onSubmitDebugModeForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
    }
  })
}

const handleClose = () => {
  addDebugModeRuleFormRef.value.resetFields()
  debugModeDialog.value = false
}

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getReport(currentPage.value)
}

onMounted(async () => {})
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 15px;
}
.exportForm {
  display: flex;
  justify-content: end;

  .el-input {
    width: 300px;
  }
}

.text-center {
  display: flex;
  justify-content: center;
}

:deep(.el-upload-list) {
  margin: 0px;
}

.el-pagination {
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
}

:deep(.cell) {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-upload {
    height: 24px;
    line-height: 24px;
    margin-left: 10px;
  }
}

.debugMode-wrap {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;

  .ignore-select-wrap {
    .el-select {
      margin: 0 10px;
      width: 220px;
    }

    .el-input {
      width: 220px;
    }
  }
}
</style>
