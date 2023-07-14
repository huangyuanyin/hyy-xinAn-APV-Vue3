<template>
  <el-card shadow="never">
    <div class="search-wrap">
      <div class="ignore-select-wrap">
        <el-select size="large" clearable v-model="searchBuild" placeholder="请选择要搜索的build版本..." @change="getReport(1)">
          <el-option v-for="(item, index) in state.buildData" :key="'buildData' + index" :label="item.name" :value="item.name" />
        </el-select>
        <el-select size="large" clearable v-model="searchGroup" placeholder="请选择要搜索的任务状态..." @change="getReport(1)">
          <el-option v-for="(item, index) in state.selectStatusList" :key="'selectStatusList' + index" :label="item.label" :value="item.value" />
        </el-select>
        <el-input size="large" clearable v-model="searchUser" placeholder="请输入要搜索的负责人..." :suffix-icon="Search" @change="getReport(1)" />
      </div>
    </div>

    <el-table
      ref="multipleTableRef"
      :data="tableData"
      row-key="id"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
      style="width: 100%; margin-top: 10px"
      v-loading="loading"
      :element-loading-text="loadingText"
    >
      <el-table-column type="selection" width="55" align="center" :reserve-selection="true" />
      <el-table-column property="id" label="报告ID" align="center" width="80" />
      <el-table-column property="name" label="任务名称" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="toDetail(scope.row.id, 'detail')">{{ scope.row.name }} </el-button>
        </template>
      </el-table-column>
      <el-table-column property="counts" label="用例总数" align="center" />
      <el-table-column property="fail_cases" label="失败数" show-overflow-tooltip align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="toDetail(scope.row.id, 'FailNumDetail')" v-if="scope.row.fail_cases != 0">
            {{ scope.row.fail_cases }}
          </el-button>
          <span v-else>{{ scope.row.fail_cases }}</span>
        </template>
      </el-table-column>
      <el-table-column property="uptime" label="更新时间" :formatter="dateFormatter" width="220" align="center" />
      <el-table-column property="user" label="负责人" align="center" />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" disabled size="small" @click="toMark(scope.row.id)">标记</el-button>
          <el-button link type="primary" size="small" @click="toDetail(scope.row.id, 'history')">历史报告</el-button>
          <!-- <el-button link type="danger" size="small">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="bottomWrap">
      <div class="buttonGroup">
        <el-button @click="toDataAnalysis()" type="primary"> 数据对比 </el-button>
      </div>
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
    </div>
  </el-card>
  <MarkDialog :markData="markData" :isShowDialog="isShowMarkDialog" v-on:closeMarkDialog="closeMarkDialog(res)" />
  <el-drawer
    v-loading.fullscreen.lock="isLoadingData"
    v-model="dialogTableVisible"
    :title="dialogTableTitle"
    size="80%"
    direction="rtl"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-row>
      <el-col :span="10">
        <el-collapse v-model="activeNames" accordion @change="selectValList1">
          <el-collapse-item v-for="(item, index) in dialogTable" :key="'dialogTable' + index" :name="item.name">
            <template #title>
              {{ item.name }}
              <el-tooltip class="box-item" effect="dark" content="相同数" placement="top">
                <el-tag style="margin-left: 2%"> {{ item.same }} </el-tag>
              </el-tooltip>
              <el-tooltip class="box-item" effect="dark" content="差异数" placement="top">
                <el-tag style="margin-left: 2%" type="danger"> {{ item.different }} </el-tag>
              </el-tooltip>
            </template>
            <el-table :data="valListData1" style="width: 100%" height="450" v-loading="valListData1Loading">
              <el-table-column prop="valName" label="case_ID" align="center" width="125" :span-method="mergeCells1" />
              <el-table-column prop="name" label="模块名" align="center" width="220" />
              <el-table-column prop="comment" label="comment" align="center" />
              <el-table-column prop="result" label="结果" align="center" width="90" />
              <el-table-column fixed="right" label="操作" width="90" align="center">
                <template #default="scope">
                  <el-button link type="primary" size="small" @click="toSeeLog(true, scope.row, valListData1)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <el-col :span="2"></el-col>
      <el-col :span="10">
        <el-collapse v-model="activeNames2" accordion @change="selectValList2">
          <el-collapse-item v-for="(item, index) in dialogTable2" :key="'dialogTable2' + index" :name="item.name">
            <template #title>
              {{ item.name }}
              <el-tooltip class="box-item" effect="dark" content="相同数" placement="top">
                <el-tag style="margin-left: 2%"> {{ item.same }} </el-tag>
              </el-tooltip>
              <el-tooltip class="box-item" effect="dark" content="差异数" placement="top">
                <el-tag style="margin-left: 2%" type="danger"> {{ item.different }} </el-tag>
              </el-tooltip>
            </template>
            <el-table :data="valListData2" style="width: 100%" height="450" v-loading="valListData1Loading2">
              <el-table-column prop="valName" label="case_ID" align="center" width="125" :span-method="mergeCells1" />
              <el-table-column prop="name" label="模块名" align="center" width="220" />
              <el-table-column prop="comment" label="comment" align="center" />
              <el-table-column prop="result" label="结果" align="center" width="90" />
              <el-table-column fixed="right" label="操作" width="90" align="center">
                <template #default="scope">
                  <el-button link type="primary" size="small" @click="toSeeLog(true, scope.row, valListData2)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </el-drawer>
  <el-dialog :model-value="isShowLogDialog" custom-class="caseScriptDialog2" @close="isShowLogDialog = false" :show-close="false" fullscreen>
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header" style="display: flex; align-items: center; justify-content: space-between">
        <div style="display: flex; align-items: center">
          <h4 :id="titleId" :class="titleClass">{{ logTitle }}</h4>
        </div>
        <div>
          <el-button type="primary" @click="lastLook">上一条</el-button>
          <el-button type="primary" @click="nextLook">下一条</el-button>
          <el-button type="danger" @click="close">
            <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
            关闭
          </el-button>
        </div>
      </div>
    </template>
    <div class="detailCaseScript">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="用例脚本" name="first">
          <el-input v-model="case_script" :autosize="{ minRows: 12, maxRows: 36 }" type="textarea" placeholder="暂无用例脚本" />
        </el-tab-pane>
        <el-tab-pane label="脚本执行日志" name="second">
          <el-input v-model="case_log" :autosize="{ minRows: 12, maxRows: 36 }" type="textarea" placeholder="暂无脚本执行日志" />
        </el-tab-pane>
        <template v-for="(item, index) in shell_log" :key="'shell_log' + index">
          <el-tab-pane :label="'交互日志' + (index + 1)" :name="item.value">
            <el-input v-model="item.value" :autosize="{ minRows: 12, maxRows: 36 }" type="textarea" placeholder="暂无交互日志" />
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, toRef, toRefs } from 'vue'
import { getReportApi, contrastReportApi, getLogApi, getContrastReportApi } from '@/api/APV/testReport.js'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { utc2beijing } from '@/utils/util.js'
import MarkDialog from './components/MarkDialog.vue'
import { buildApi } from '@/api/APV/buildManagement.js'
import { Search, CircleCloseFilled } from '@element-plus/icons-vue'

const props = defineProps({
  keepAlive: {
    type: Boolean,
    default: false
  },
  rootKey: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()
const multipleTableRef = ref()
const multipleSelection = ref([])
const activeNames = ref('1')
const activeNames2 = ref('1')
const tableData = ref([])
const isShowMarkDialog = ref(false)
const markData = ref({})
const loading = ref(false)
const loadingText = ref('正在加载中...')
const dialogTable = ref([])
const dialogTable2 = ref([])
const valListData1 = ref([])
const valListData2 = ref([])
const isLoadingData = ref(false)
const valListData1Loading = ref(false)
const valListData1Loading2 = ref(false)
const dialogTableVisible = ref(false)
const dialogTableTitle = ref('')
const isShowLogDialog = ref(false)
const logTitle = ref('')
const activeName = ref('1')
const shell_log = ref([])
const case_script = ref('')
const case_log = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const formInline: any = reactive({
  id: '',
  user: '',
  date1: '',
  date2: '',
  status: '',
  apv_model: '',
  ipversion: '',
  build: ''
})

const state = reactive({
  buildData: [],
  selectStatusList: [
    {
      value: 'running',
      label: '运行中'
    },
    {
      value: 'fail',
      label: '已失败'
    },
    {
      value: 'stop',
      label: '已停止'
    }
  ]
})
const searchUser = ref('')
const searchBuild = ref('')
const searchGroup = ref('')

const getBuild = async () => {
  let res = await buildApi({ filetype: 'apvbuild' })
  state.buildData = res.data.map((item) => ({ name: item }))
}

const getGroupDataId = (value) => {
  // addTaskForm.group = value
}

const getReport = async (page) => {
  let build = searchBuild.value
  let user = searchUser.value
  let res = await getReportApi({ page, build, state: searchGroup.value, user })
  if (res.code === 1000) {
    tableData.value = res.data
    total.value = res.total
  }
}

const onQuery = () => {
  // getDatas(filterData(formInline));
}
const onReset = () => {
  Object.keys(formInline).map((key) => {
    formInline[key] = ''
  })
}
const clearSelection = () => {
  multipleTableRef.value!.clearSelection()
}
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
const getRowKeys = (row) => {
  return row.id
}
const toDataAnalysis = () => {
  if (multipleSelection.value.length > 2) {
    ElMessage({
      message: `最多选择两份报告进行对比，您选择了${multipleSelection.value.length}份`,
      type: 'warning'
    })
    return
  }
  if (multipleSelection.value) {
    contrastReport(multipleSelection.value[0], multipleSelection.value[1])
  } else {
    multipleTableRef.value!.clearSelection()
  }
}

const contrastReport = async (val1, val2) => {
  const params = {
    report1: val1.id,
    report2: val2.id
  }
  loading.value = true
  loadingText.value = '正在对比中...'
  let res = await contrastReportApi(params)
  loading.value = false
  loadingText.value = '正在加载中...'
  if (res.code === 1000) {
    dialogTableVisible.value = true
    dialogTableTitle.value = `【${val1.name}】 - 【${val2.name}】数据对比结果`

    // res.data = transformData(res.data)
    res.data = Object.keys(res.data).map((key) => ({
      name: key,
      same: res.data[key].same,
      different: res.data[key].different
    }))
    console.log(`output->res.data`, res.data)
    let half = Math.ceil(res.data.length / 2)
    dialogTable.value = res.data.slice(0, half)
    dialogTable2.value = res.data.slice(half)
  }
}

function transformData(data) {
  const data2 = []
  for (const key in data) {
    const obj = { name: key, valList: [] }
    const valObj = data[key]
    for (const valKey in valObj) {
      const valItem = valObj[valKey]
      for (const name in valItem) {
        if (name !== 'equal') {
          const item = {
            valName: valKey,
            name,
            log: valItem[name].log,
            result: valItem[name].result === 'pass'
          }
          obj.valList.push(item)
        }
      }
    }
    data2.push(obj)
  }
  return data2
}

function transformData2(data) {
  const data2 = []
  for (const valName in data) {
    const valObj = data[valName]
    for (const name in valObj) {
      if (name !== 'equal') {
        const item = {
          valName,
          name,
          ...valObj[name]
        }
        data2.push(item)
      }
    }
  }
  console.log(`output->data2`, data2)
  return data2
}

const mergeCells1 = ({ row, column, rowIndex, columnIndex }) => {
  // if (columnIndex === 0) {
  //   const valList = valListData1.value
  //   let rowspan = 1
  //   for (let i = rowIndex + 1; i < valList.length; i++) {
  //     if (valList[i].valName === row.valName) {
  //       rowspan++
  //     } else {
  //       break
  //     }
  //   }
  //   return { rowspan, colspan: 1 }
  // }
}

const mergeCells2 = ({ row, column, rowIndex, columnIndex }) => {
  // if (columnIndex === 0) {
  //   const valList = valListData2.value
  //   let rowspan = 1
  //   for (let i = rowIndex + 1; i < valList.length; i++) {
  //     if (valList[i].valName === row.valName) {
  //       rowspan++
  //     } else {
  //       break
  //     }
  //   }
  //   return { rowspan, colspan: 1 }
  // }
}

const detailTableData = ref([])
const detailId = ref('')
const detailName = ref('')
const toSeeLog = async (type, row, data?) => {
  type ? (detailTableData.value = data) : ''
  detailId.value = row.valName
  detailName.value = row.name
  logTitle.value = `【 ${row.valName}】- 【${row.name}】的日志详情`
  shell_log.value = []
  const params = {
    log: row.log,
    module: row.name,
    case_id: row.valName
  }
  await getContrastReportApi(params).then((res) => {
    let LogList = []
    LogList.push(res.data.case_script, res.data.case_log)
    LogList.map(async (item, index) => {
      await getLogApi({ url: String(item) }).then((res) => {
        switch (index) {
          case 0:
            case_script.value = res.data || '请求错误'
            break
          case 1:
            case_log.value = res.data || '请求错误'
            break
          default:
            break
        }
      })
    })
    res.data.shell_log.map(async (item, index) => {
      await getLogApi({ url: String(item) }).then((res) => {
        shell_log.value.push({
          value: res.data || '请求错误'
        })
      })
    })
  })
  activeName.value = 'first'
  isShowLogDialog.value = true
}

const valList = ref([])
const selectValList1 = async (val) => {
  const params = {
    report1: multipleSelection.value[0].id,
    report2: multipleSelection.value[1].id,
    module: val
  }
  valListData1Loading.value = true
  let res = await contrastReportApi(params)
  if (res.code === 1000) {
    for (const key in res.data) {
      valList.value = res.data[key]
    }
  }
  for (const valKey in valList.value) {
    const valItem = valList.value[valKey]
    for (const name in valItem) {
      if (name !== 'equal') {
        const item = {
          valName: valKey,
          name,
          log: valItem[name].log,
          result: valItem[name].result === 'pass'
        }
        valListData1.value.push(item)
      }
    }
  }
  valListData1Loading.value = false
}
const valList2 = ref([])
const selectValList2 = async (val) => {
  const params = {
    report1: multipleSelection.value[0].id,
    report2: multipleSelection.value[1].id,
    module: val
  }
  valListData1Loading2.value = true
  let res = await contrastReportApi(params)
  if (res.code === 1000) {
    for (const key in res.data) {
      valList2.value = res.data[key]
    }
  }
  for (const valKey in valList2.value) {
    const valItem = valList2.value[valKey]
    for (const name in valItem) {
      if (name !== 'equal') {
        const item = {
          valName: valKey,
          name,
          log: valItem[name].log,
          result: valItem[name].result === 'pass'
        }
        valListData2.value.push(item)
      }
    }
  }
  valListData1Loading2.value = false
}

const lastLook = () => {
  const index = detailTableData.value.findIndex((item) => item.valName === detailId.value && item.name === detailName.value)
  if (index === 0) {
    ElMessage.warning('已经是第一条啦~~~')
    return
  }
  const lastObj = detailTableData.value[index - 1]
  toSeeLog(false, lastObj)
}

const nextLook = () => {
  const index = detailTableData.value.findIndex((item) => item.valName === detailId.value && item.name === detailName.value)
  if (index === detailTableData.value.length - 1) {
    ElMessage.warning('已经是当前页面最后一条啦~~~')
    return
  }
  const nextObj = detailTableData.value[index + 1]
  toSeeLog(false, nextObj)
}

// 跳转详情
const toDetail = (id, type) => {
  switch (type) {
    case 'detail': {
      router.push({
        path: '/APVAuto/reportDetail_new',
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
const closeMarkDialog = (res) => {
  isShowMarkDialog.value = res
}

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getReport(currentPage.value)
}

onMounted(async () => {
  await getReport(1)
  await getBuild()
})
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

.bottomWrap {
  display: flex;
  margin-top: 20px;
  padding-left: 10px;
  justify-content: space-between;
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

.search-wrap {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;

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

<style lang="scss">
.caseScriptDialog2 {
  .el-dialog__body {
    padding-top: 0px !important;
  }
  .el-dialog__header {
    padding-top: 0px !important;
    padding-bottom: 0px;
  }
  .full-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .full-icon:hover {
    color: #1890ff;
  }
}
</style>
