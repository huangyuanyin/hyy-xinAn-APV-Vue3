<template>
  <el-card shadow="never" v-if="!showTermail">
    <div class="debugMode-wrap">
      <el-button type="primary" size="large" @click="openDebugMode('add')">新增</el-button>
      <div class="ignore-select-wrap">
        <el-input size="large" clearable v-model="searchUser" placeholder="请输入要搜索的平台名称..." :suffix-icon="Search" @change="search()" />
      </div>
    </div>
    <el-table ref="debugModeTableRef" :data="tableData" style="width: 100%; margin-top: 10px" v-loading="loading" height="65vh">
      <el-table-column property="name" label="平台名称" align="center" width="220" />
      <el-table-column property="isapv" label="是否是物理机" width="150" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.isapv" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column property="status" label="平台状态" width="220" align="center">
        <template #default="scope">
          <el-tooltip content="空闲中" placement="top" effect="dark">
            <svg-icon v-if="scope.row.starttime === null" style="height: 30px; margin: 5px 0" iconName="icon-shuqianzhunbeizhong"></svg-icon>
          </el-tooltip>
          <el-tooltip content="调试中" placement="top" effect="dark">
            <svg-icon
              v-if="scope.row.starttime !== null && scope.row.endtime === null"
              style="width: 30px; height: 30px; margin: 5px 0"
              iconName="icon-shebeidongtai-copy"
            ></svg-icon>
          </el-tooltip>
          <el-tooltip content="调试结束" placement="top" effect="dark">
            <svg-icon v-if="scope.row.starttime !== null && scope.row.endtime !== null" style="width: 30px; height: 30px; margin: 5px 0" iconName="icon-yijieshu"></svg-icon>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column property="user" label="调试人" align="center" />
      <el-table-column property="starttime" label="开始时间" width="220" align="center">
        <template #default="scope">
          <span v-if="scope.row.starttime === null" type="danger"> - </span>
          <span v-else type="success">{{ utc2beijing(scope.row.starttime) }}</span>
        </template>
      </el-table-column>
      <el-table-column property="endtime" label="结束时间" width="220" align="center">
        <template #default="scope">
          <span v-if="scope.row.endtime === null" type="danger"> - </span>
          <span v-else type="success">{{ utc2beijing(scope.row.endtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column property="remark" label="备注" align="center" />
      <el-table-column fixed="right" label="操作" align="center" width="200">
        <template #default="scope">
          <!-- <el-button link type="primary" size="small" @click="openDebugMode('edit', scope.row.id)">编辑</el-button> -->
          <!-- <el-button link type="primary" size="small" @click="openDebugMode('edit', scope.row.id)">详情</el-button> -->
          <el-tooltip content="开始调试" placement="top" effect="dark" v-if="scope.row.starttime === null || (scope.row.starttime !== null && scope.row.endtime !== null)">
            <el-icon :size="20" style="color: #409eff; margin-right: 15px; cursor: pointer" @click="toDebug(scope.row.id)"><VideoPlay /></el-icon>
          </el-tooltip>
          <el-tooltip content="继续调试" placement="top" effect="dark" v-if="scope.row.starttime !== null && scope.row.endtime === null">
            <svg-icon style="width: 33px; height: 33px; cursor: pointer; margin-right: 15px" iconName="icon-shebeiyunhang" @click="toDebug(scope.row.id)"></svg-icon>
          </el-tooltip>
          <el-tooltip content="结束调试" placement="top" effect="dark">
            <el-icon :size="20" style="color: #f56c6c; cursor: pointer" @click="endDebug(scope.row)"><SwitchButton /></el-icon>
          </el-tooltip>
          <!-- <el-popconfirm title="确定删除这个平台?" trigger="click" confirm-button-text="确认删除" cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button link type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm> -->
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
        <el-form-item label="平台类型：" prop="isapv">
          <el-select clearable v-model="form.isapv" placeholder="请选择测试平台类型..." @change="selectIsapv">
            <el-option label="物理环境" :value="true"></el-option>
            <el-option label="虚拟环境" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台名称：" prop="group">
          <el-select v-model="form.group" placeholder="请选择平台名称" :options="groupList" @visible-change="getIsApvList(form.isapv)">
            <el-scrollbar @scroll="handleScroll" :view-style="{ height: '150px' }" :wrap-style="{ height: '150px' }" max-height="150px" noresize>
              <template #default="{ size }">
                <div :style="{ height: size }">
                  <template v-for="(option, index) in visibleOptions" :key="index">
                    <el-option :value="option.name" :label="option.name" :disabled="option.status || option.user === username" />
                  </template>
                </div>
              </template>
            </el-scrollbar>
          </el-select>
        </el-form-item>
        <el-form-item label="备注信息：">
          <el-input v-model="form.remark" placeholder="请输入备注信息..." />
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
  <el-dialog v-model="buildDialog" title="设备升级" width="35%" @close="handleClose">
    <span>
      <el-form :inline="false" :model="buildForm" ref="addBuildFormRuleFormRef" :rules="addBuildFormRules" class="build-form" label-width="150px">
        <el-form-item label="升降方式">
          <el-radio-group v-model="selectionMethod">
            <el-radio label="现有版本" />
            <el-radio label="下载链接" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择版本" prop="build" v-if="selectionMethod === '现有版本'">
          <el-select v-model="buildForm.build" placeholder="请选择版本">
            <el-option :label="item.name" :value="item.name" v-for="(item, index) in buildData" :key="'buildData' + index" />
          </el-select>
        </el-form-item>
        <el-form-item label="下载链接" prop="url" v-if="selectionMethod === '下载链接'">
          <el-input v-model="buildForm.url" placeholder="请输入版本下载链接..." />
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onReseBuildRuleForm(addBuildFormRuleFormRef)">取消</el-button>
        <el-button type="primary" @click="onSubmitBuildForm(addBuildFormRuleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <el-drawer v-model="drawer" direction="rtl" :before-close="handleCloseDrawer" :show-close="false" size="80%" custom-class="consoleDrawer" :destroy-on-close="true">
    <template #header="{ close, titleId, titleClass }">
      <h4 :class="titleClass" id="typing-text"></h4>
      <el-button type="danger" @click="handleCloseDrawer"> 退出调试 </el-button>
    </template>
    <!-- <Termail v-if="showTermail" :termmailInfo="termmailInfo" :isShowClose="false" :TerminalCols="47" @closeTermmail="cloeConsole(termmailId)"></Termail> -->
  </el-drawer>
  <el-card shadow="never" v-if="showTermail" class="showTermail">
    <!-- <div class="debugButton">
      <el-button type="success" @click="toMark()"> 设备升级 </el-button>
      <el-button type="danger" @click="handleCloseDrawer"> 退出调试 </el-button>
    </div> -->
    <el-tabs v-model="activeName" class="tabs" :class="[isShowFullScreen ? 'isShow' : '']" @tab-click="handleClick" id="tabs">
      <el-tab-pane v-for="(item, index) in consoleTabs" :key="'consoleTabs' + index" :label="item.name" :name="String(item.name)" :lazy="true">
        <keep-alive>
          <component
            :is="item.component"
            v-if="item.component != null && activeName == String(item.name)"
            :key="activeName"
            :termmailInfo="item.termmailInfo"
            :isPropFullScreen="isShowFullScreen"
            @closeTermmail="cloeConsole(termmailId)"
            @toMark="toMark"
            @operationalDocument="operationalDocument"
            @backList="backList"
            @fullScreen="fullScreen"
            @exitFullScreen="exitFullScreen"
            @seeProcess="seeProcess"
          ></component>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </el-card>
  <el-dialog v-model="codeMirrorDialog" title="升级进度" width="55%" @close="handleClose">
    <CodeMirror :code="codeMirrorVal" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, reactive, markRaw, nextTick, watchEffect } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter, NavigationGuardNext } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { utc2beijing } from '@/utils/util.js'
import { Search, Open, VideoPlay, SwitchButton } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import Termmail from '@/components/debugTermail.vue'
import { debugTaskApi, toDebugApi, exitDebugApi, addDebugTaskApi, debugUpbuild, getDebugUpbuildLogApi } from '@/api/APV/debugTask.js'
import { d_groupApi } from '@/api/APV/index.js'
import { buildApi } from '@/api/APV/buildManagement.js'
import CodeMirror from '@/components/CodeMirror.vue'

const route = useRoute()
const router = useRouter()
const username = JSON.parse(localStorage.getItem('userInfo'))?.nickname
const activeName = ref('console')
const selectionMethod = ref('现有版本')
const consoleTabs = ref([]) // 控制台tabs
const debugModeTableRef = ref()
const drawer = ref(false)
const showTermail = ref(false)
const groupList = ref([]) // 平台列表
const visibleOptions = ref([]) // 可见的平台列表
const groupListTotal = ref(0) // 平台列表总数
const buildData = ref([]) // 版本列表
const groupPage = ref(1)
const termmailId = ref('')
const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchUser = ref('')
const debugModeDialog = ref(false)
const buildDialog = ref(false)
const titleDialog = ref('')
const isShowFullScreen = ref(false)
const codeMirrorDialog = ref(false)
const codeMirrorVal = ref('')
const form = ref({
  group: '',
  isapv: false,
  remark: ''
  // config: {}
})
const addDebugModeRuleFormRef = ref<FormInstance>()
const addDebugModeFormRules = reactive<FormRules>({
  group: [{ required: true, message: '请选择平台名称', trigger: 'blur' }],
  isapv: [{ required: true, message: '请选择平台类型', trigger: 'change' }]
})
const buildForm = reactive({
  name: '现有版本',
  build: '',
  url: ''
})
const addBuildFormRuleFormRef = ref<FormInstance>()
const addBuildFormRules = reactive<FormRules>({
  name: [{ required: true, message: '平台名称不能为空', trigger: 'blur' }],
  build: [{ required: true, message: '请选择版本', trigger: 'blur' }],
  url: [{ required: true, message: 'build链接不能为空', trigger: 'blur' }]
})

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

const debugId = ref(null)
const toDebug = async (id) => {
  debugId.value = id
  let res = await toDebugApi({ id })
  if (res.code === 1000) {
    showTermail.value = true
    let list = [res.console].concat(res.apv)
    await (consoleTabs.value = list.map((item) => {
      return { name: item }
    }))
    await consoleTabs.value.map((item) => {
      item.termmailInfo = {
        id,
        name: item.name
      }
      item.component = markRaw(Termmail)
    })
    console.log(`output->consoleTabs.value`, consoleTabs.value)
  }
}

const endDebug = async (val) => {
  ElMessageBox.confirm(`平台【${val.name}】会退出调试模式！`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      exitDebug2(val.id, () => {})
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作'
      })
    })
}

const exitDebug2 = async (id, next: () => void) => {
  let res = await exitDebugApi(id)
  if (res.code === 1000) {
    drawer.value = false
    showTermail.value = false
    termmailId.value = ''
    ElMessage.success('调试已结束！')
    currentPage.value = 1
    debugTask()
    next()
  }
}

// 切换Tab
const handleClick = (tab: TabsPaneContext, event: Event) => {
  if (isShowFullScreen.value) {
    fullScreen()
  }
  activeName.value = String(tab.props.name)
  sessionStorage.setItem('activeName', activeName.value)
}

const cloeConsole = (row) => {
  termmailId.value = ''
  showTermail.value = false
}

const dateFormatter = (row, column) => {
  let date = row[column.property]
  if (date === null) {
    return ''
  } else {
    return utc2beijing(date)
  }
}

const toMark = () => {
  buildDialog.value = true
}

const operationalDocument = () => {
  ElMessage('开发中...')
}

const backList = () => {
  showTermail.value = false
}

const fullScreen = () => {
  const terminalContainer = document.getElementById('tabs')
  if (terminalContainer.requestFullscreen) {
    isShowFullScreen.value = true
    terminalContainer.requestFullscreen()
  }
}
const exitFullScreen = () => {
  const terminalContainer = document.getElementById('tabs')
  if (document.exitFullscreen) {
    isShowFullScreen.value = false
    document.exitFullscreen()
  }
}

const seeProcess = async () => {
  let res = await getDebugUpbuildLogApi(debugId.value)
  if (res.code === 1000) {
    codeMirrorDialog.value = true
    codeMirrorVal.value = res.data
  }
}

const getIsApvList = async (val) => {
  const params = {
    isapv: val ? 'True' : 'False'
  }
  let res = await d_groupApi(params)
  if (res.code === 1000) {
    visibleOptions.value = res.data
  }
}

const selectIsapv = (val) => {
  form.value.group = ''
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
      const params = { ...form.value }
      // params.isapv = params.isapv === '是' ? 1 : 0
      let res = await addDebugTaskApi(params)
      if (res.code === 1000) {
        ElMessage.success('新增成功！')
        debugModeDialog.value = false
        groupPage.value = 1
        getGroupList()
      }
    }
  })
}

const onReseBuildRuleForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  buildDialog.value = false
}

const onSubmitBuildForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const { build, url } = buildForm
      const params = {
        build: selectionMethod.value === '现有版本' ? build : undefined,
        url: selectionMethod.value === '现有版本' ? undefined : url,
        id: debugId.value
      }
      let res = await debugUpbuild(params)
      if (res.code === 1000) {
        ElMessage.success('设备开始升级！')
        buildDialog.value = false
      }
    }
  })
}

const exitDebug = async (next: () => void) => {
  let res = await exitDebugApi(debugId.value)
  if (res.code === 1000) {
    drawer.value = false
    showTermail.value = false
    termmailId.value = ''
    ElMessage.success('调试已结束！')
    next()
  }
}

const handleExitDebugConfirm = (next: NavigationGuardNext) => {
  ElMessageBox.confirm('该操作会退出调试模式！', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      exitDebug(next)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作'
      })
    })
}

const handleCloseDrawer = (next: () => void) => {
  handleExitDebugConfirm(next)
}

const handleClose = () => {
  addDebugModeRuleFormRef.value?.resetFields()
  addBuildFormRuleFormRef.value?.resetFields()
  debugModeDialog.value = false
  buildDialog.value = false
  codeMirrorDialog.value = false
  codeMirrorVal.value = ''
}

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  debugTask()
}

const search = () => {
  currentPage.value = 1
  debugTask()
}

const debugTask = async () => {
  const params = {
    page: currentPage.value,
    name: searchUser.value ? searchUser.value : undefined
  }
  let res = await debugTaskApi(params)
  if (res.code === 1000) {
    tableData.value = res.data
    total.value = res.total
  }
}

const getGroupList = async () => {
  const params = {
    page: groupPage.value
  }
  let res = await d_groupApi(params)
  if (res.code === 1000) {
    groupListTotal.value = res.data.total
    groupList.value = [...groupList.value, ...res.data.data]
    updateVisibleOptions()
  }
}

const getBuild = async () => {
  let res = await buildApi({ filetype: 'apvbuild' })
  buildData.value = res.data.map((item) => ({ name: item }))
}

const handleScroll = (evt) => {
  const el = evt
  console.log(`output->groupListTotal`, groupListTotal.value)
  if (groupListTotal.value <= groupList.value.length) {
    return
  }
  if (el.scrollTop === 190 || el.scrollTop === 530 || el.scrollTop === 802) {
    console.log(`output->`, groupList.value.length)
    // 接近底部
    groupPage.value++
    updateVisibleOptions()
    getGroupList()
  }
}

const updateVisibleOptions = () => {
  visibleOptions.value = groupList.value.slice(0, groupPage.value * 10)
}

function checkFull() {
  var fullScreen = parent.document.webkitIsFullScreen || parent.document.fullscreen || parent.document.mozFullScreen || parent.document.msFullscreenElement
  return !fullScreen
}

onMounted(async () => {
  window.addEventListener('resize', () => {
    nextTick(() => {
      if (checkFull()) {
        isShowFullScreen.value = false
        const terminalContainer = document.getElementById('tabs')
        terminalContainer?.classList.add('fullScreen')
      }
    })
  })
  debugTask()
  getGroupList()
  getBuild()
})

onBeforeUnmount(() => {})

// 离开路由导航守卫
// onBeforeRouteLeave((to, from, next) => {
//   if (showTermail.value) {
//     handleExitDebugConfirm(() => next())
//   } else {
//     next()
//   }
// })
</script>

<style lang="scss" scoped>
.debugButton {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  margin-bottom: 20px;
}

:deep(.el-tabs__header) {
  margin-bottom: 0;
}
.showTermail {
  :deep(.el-card__body) {
    padding-top: 0px;
  }
}
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

<style lang="scss">
.consoleDrawer {
  .el-drawer__header {
    margin-bottom: 0px !important;
  }
  .console-wrap {
    height: 88vh;
  }
}
.isShow {
  .el-tabs__item {
    color: #fff;
  }
  .is-active {
    color: #409eff;
  }
}
</style>
