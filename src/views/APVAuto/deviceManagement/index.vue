<template>
  <div class="performanceManagement" v-loading="loadingInstance" :element-loading-text="loadingText" :element-loading-spinner="svg" element-loading-svg-view-box="-10, -10, 50, 50">
    <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick" @tab-remove="handleRemoveClick">
      <el-tab-pane label="测试平台管理" name="testbedManagement">
        <el-card class="group-card" shadow="never">
          <div class="search-wrap">
            <div>
              <el-button type="primary" @click="openAddDialog('group', 'add', null)" style="margin-bottom: 20px"> 添加测试平台 </el-button>
            </div>
            <div class="ignore-select-wrap">
              <el-select size="large" clearable v-model="searchForm.status" placeholder="请选择设备状态..." @change="searchDevice">
                <el-option v-for="(item, index) in statusOptions" :key="'buildData' + index" :label="item.label" :value="item.value" />
              </el-select>
              <el-input v-model="searchForm.name" placeholder="请输入平台名称..." @change="searchDeviceName" clearable />
            </div>
          </div>
          <el-table :data="state.d_groupData" stripe>
            <el-table-column prop="ip" label="物理机IP" align="center" width="200" />
            <el-table-column prop="name" label="测试平台名称" align="center" width="180" />
            <el-table-column prop="isapv" label="是否是物理机" align="center" width="180">
              <template #default="scope">
                <el-tag type="warning" v-if="scope.row.isapv === true"> 是 </el-tag>
                <el-tag type="info" v-else> 否 </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="build" label="测试版本" align="center" width="300">
              <template #default="scope">
                <el-tag class="tagType" v-for="(item, index) in scope.row.build" :key="'build' + index">
                  {{ item }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="180">
              <template #default="scope">
                <div class="stateStyle" v-if="scope.row.status === false">
                  <div class="status-point" style="background-color: #409eff"></div>
                  <span style="color: #409eff">空闲中</span>
                </div>
                <div class="stateStyle hhh" v-else>
                  <div class="status-point hhh" style="background-color: #67c23a"></div>
                  <span style="color: #67c23a">使用中</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="user" label="使用人" align="center" />
            <el-table-column prop="uptime" label="更新时间" align="center" width="200" />
            <el-table-column fixed="right" label="操作" align="center" width="220">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="openAddDeviceDrawer(scope.row)">绑定设备 </el-button>
                <el-button link type="primary" size="small" v-if="scope.row.isShowTermail == false" @click="openConsole(scope.row)"> 在线终端 </el-button>
                <el-button link type="warning" size="small" v-else @click="cloeConsole(scope.row)">关闭终端</el-button>
                <el-button link type="primary" size="small" @click="openAddDialog('group', 'edit', scope.row.id)">编辑 </el-button>
                <el-popover placement="bottom" :width="10" trigger="hover" popper-class="moreGroupPopover">
                  <template #reference>
                    <el-button link type="info" size="small">更多</el-button>
                  </template>
                  <div class="moreButton">
                    <el-button v-if="scope.row.user === ''" link type="primary" size="small" @click="changePlatformStatus('borrow', scope.row.id)">平台借用 </el-button>
                    <el-button v-else link type="primary" size="small" @click="changePlatformStatus('return', scope.row.id)">平台归还 </el-button>
                    <el-button link type="primary" size="small" @click="changeStatus(scope.row)">状态变更 </el-button>
                    <el-popconfirm
                      title="确定删除这个测试平台?"
                      trigger="click"
                      confirm-button-text="确认删除"
                      cancel-button-text="取消"
                      @confirm="handleDelete('group', scope.row.id)"
                    >
                      <template #reference>
                        <el-button link type="danger" size="small">删除</el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-model:currentPage="groupCurrentPage"
            v-model:page-size="groupPageSize"
            :page-sizes="[10, 20, 30, 40]"
            layout="total, prev, pager, next, jumper"
            :total="groupTotal"
            @size-change="handleGroupSizeChange"
            @current-change="handleGroupCurrentChange"
          />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="build管理" name="buildManagement">
        <el-card class="build-card" shadow="never">
          <el-upload class="upload-demo" :show-file-list="false" action="action" :http-request="handleUpload" :on-success="handleSuccess">
            <el-button type="primary" style="margin-bottom: 20px" :auto-upload="false"> 上传文件 </el-button>
          </el-upload>
          <el-button type="primary" @click="openDownloadDialog = true" style="margin-left: 20px" :auto-upload="false"> 拉取文件 </el-button>
          <el-table :data="state.buildData" border stripe>
            <el-table-column prop="name" label="版本名称" align="center" />
            <el-table-column fixed="right" label="操作" align="center">
              <template #default="scope">
                <el-popconfirm title="确定删除这个文件?" trigger="click" confirm-button-text="确认删除" cancel-button-text="取消" @confirm="handleDelete('build', scope.row.name)">
                  <template #reference>
                    <el-button link type="primary" size="small">删除文件</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-model:currentPage="buildCurrentPage"
            v-model:page-size="buildPageSize"
            :page-sizes="[10, 20, 30, 40]"
            layout="total, prev, pager, next, jumper"
            :total="buildTotal"
            @size-change="handleBuildSizeChange"
            @current-change="handleBuildCurrentChange"
          />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="测试用例清单" name="showTestCase">
        <ShowTestCase />
      </el-tab-pane>
      <el-tab-pane label="串口服务器管理" name="serialServer" disabled>
        <SerialServer />
      </el-tab-pane>
      <el-tab-pane v-for="(item, index) in consoleTabs" :key="'consoleTabs' + index" :label="item.name" :name="String(item.name)" :lazy="true" closable>
        <keep-alive>
          <component
            :is="item.component"
            v-if="item.component != null && activeName == String(item.name)"
            :key="activeName"
            :termmailInfo="termmailInfo"
            @closeTermmail="cloeConsole(termmailId)"
          ></component>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <!--添加设备弹窗-->
    <el-dialog v-model="dialogVisible" :title="titleDialog" width="35%" @close="handleClose('deviceDialog')" :close-on-click-modal="false" :close-on-press-escape="false">
      <span>
        <el-form :inline="false" :model="addDeviceForm" ref="addDeviceRuleFormRef" :rules="addDeviceFormRules" class="addDevice-form" label-width="100px">
          <!-- <el-form-item label="类型" prop="type">
            <el-select v-model="addDeviceForm.type" placeholder="请选择...">
              <el-option v-for="(item, index) in state.d_typeData" :key="'d_typeData' + index" :label="item"
                :value="item" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="类型" prop="type">
            <div style="display: flex; flex-direction: column">
              <el-cascader :emitPath="false" :options="options" :show-all-levels="false" @change="changeType" v-model="addDeviceForm.type" />
              <span class="remark" v-if="isNoServerIp">注：{{ remark }}</span>
            </div>
          </el-form-item>
          <el-form-item label="IP" prop="ip">
            <el-input v-model="addDeviceForm.ip" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="用户名" prop="username" v-if="isNoServerIp">
            <el-input v-model="addDeviceForm.username" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="密码" prop="password" v-if="isNoServerIp">
            <el-input v-model="addDeviceForm.password" placeholder="请输入..." />
          </el-form-item>
          <!-- <el-form-item label="测试平台" prop="gid__name">
            <el-select v-model="addDeviceForm.gid__name" placeholder="请选择..." disabled>
              <el-option v-for="(item, index) in state.d_groupData" :key="'d_groupData' + index" :label="item.name"
                :value="item.id" />
            </el-select>
          </el-form-item> -->
        </el-form>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onResetDeviceForm(addDeviceRuleFormRef)">取消</el-button>
          <el-button type="primary" @click="onAddDeviceForm(addDeviceRuleFormRef)">添加</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加测试平台弹窗-->
    <el-dialog v-model="groupDialogVisible" :title="titleDialog" width="35%" @close="handleClose('groupDialog')">
      <span>
        <el-form :inline="false" :model="addGroupForm" ref="addGroupRuleFormRef" :rules="addGroupFormRules" class="addDevice-form" label-width="100px">
          <el-form-item label="物理机IP" prop="ip">
            <el-input v-model="addGroupForm.ip" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="平台名称" prop="name">
            <el-input v-model="addGroupForm.name" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="平台类型" prop="isapv">
            <el-select v-model="addGroupForm.isapv" placeholder="请选择平台类型...">
              <el-option label="物理环境" :value="true" />
              <el-option label="虚拟环境" :value="false" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="ServerIp" prop="buildip">
            <el-input v-model="addGroupForm.buildip" placeholder="请输入..." />
          </el-form-item> -->
          <el-form-item label="测试版本" prop="build">
            <el-select v-model="addGroupForm.build" multiple placeholder="请选择..." @change="getBuildName">
              <el-option v-for="item in buildOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onResetGroupRuleForm(addGroupRuleFormRef)">取消</el-button>
          <el-button type="primary" @click="onAddGroupForm(addGroupRuleFormRef)">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-drawer custom-class="deviceDrawerStyle" v-model="deviceDrawer" :direction="direction">
      <template #header>
        <h4>平台管理</h4>
      </template>
      <template #default>
        <div class="deviceTitle">
          <span>列表</span>
          <el-button type="primary" link @click="openAddDialog('device', 'add', null)"> + 新增 </el-button>
        </div>
        <el-card class="deivce-card" shadow="never">
          <el-table :data="state.deviceDataShow" stripe>
            <!-- <el-table-column prop="uname" label="设备名称" align="center" /> -->
            <el-table-column prop="ip" label="ip" align="center" />
            <el-table-column prop="type" label="设备类型" align="center" />
            <el-table-column prop="gid__name" label="测试平台" align="center" />
            <el-table-column fixed="right" label="更多" align="center">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="openAddDialog('device', 'edit', scope.row.id)">编辑 </el-button>
                <el-popconfirm title="确定删除这个设备?" trigger="click" confirm-button-text="确认删除" cancel-button-text="取消" @confirm="handleDelete('device', scope.row.id)">
                  <template #reference>
                    <el-button link type="danger" size="small">删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </template>
    </el-drawer>

    <!-- 拉取文件弹窗-->
    <el-dialog v-model="openDownloadDialog" title="文件拉取" width="35%" @close="handleClose('downloadFileDialog')" :close-on-click-modal="false" :close-on-press-escape="false">
      <span>
        <el-form :inline="false" :model="downloadFileForm" ref="downloadFileRuleFormRef" :rules="downloadFileFormRules" class="downloadFile-form" label-width="100px">
          <el-form-item label="文件类型" prop="build">
            <el-select v-model="downloadFileForm.filetype" placeholder="请选择...">
              <el-option v-for="item in downloadFileOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="下载链接" prop="url">
            <el-input v-model="downloadFileForm.url" placeholder="请输入下载链接..." style="width: 214px" />
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onResetDownloadFileForm(downloadFileRuleFormRef)">取消</el-button>
          <el-button type="primary" :disabled="downloadLoading" @click="onDownloadFile(downloadFileRuleFormRef)">{{ downloadLoading ? '拉取中...' : '拉取' }}</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 平台借用弹窗-->
    <el-dialog
      v-model="borrowPlatformDialog"
      title="测试平台借用"
      width="35%"
      @close="handleClose('borrowPlatformDialog')"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <span>
        <el-form :inline="false" :model="borrowPlatformForm" ref="borrowPlatformRuleFormRef" :rules="borrowPlatformFormRules" class="borrowPlatform-form" label-width="100px">
          <el-form-item label="平台借用人" prop="user">
            <el-input v-model="borrowPlatformForm.user" placeholder="请输入平台借用人..." />
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onResetBorrowPlatForm(borrowPlatformRuleFormRef)">取消</el-button>
          <el-button type="primary" @click="onBorrowPlatForm(borrowPlatformRuleFormRef)">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onBeforeUnmount, markRaw } from 'vue'
import { ref, reactive } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { ElMessage } from 'element-plus'
import { CirclePlusFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  deviceApi,
  addDeviceApi,
  editDeviceApi,
  deleteDeviceApi,
  d_groupApi,
  d_typeApi,
  addD_typeApi,
  editD_typeApi,
  deleteD_typeApi,
  addD_groupApi,
  editD_groupApi,
  deleteD_groupApi,
  borrow_groupApi,
  return_groupApi
} from '@/api/APV/index.js'
import { buildApi, buildUploadApi, deleteBuildApi, downloadBuildFileApi } from '@/api/APV/buildManagement.js'
import { utc2beijing } from '@/utils/util.js'
import { buildOptions, downloadFileOptions } from './data.js'
import ShowTestCase from './components/ShowTestCase.vue'
import SerialServer from './components/SerialServer.vue'
import Termmail from '@/components/Termail.vue'

const activeName = ref(sessionStorage.getItem('activeName') || 'testbedManagement')
const dialogVisible = ref(false)
const groupDialogVisible = ref(false)
const deviceDrawer = ref(false)
const loadingInstance = ref(false)
const openDownloadDialog = ref(false)
const downloadLoading = ref(false)
const borrowPlatformDialog = ref(false)
const consoleTabs = ref([]) // 控制台tabs
const svg = `
  <path class="path" d="
    M 30 15
    L 28 17
    M 25.61 25.61
    A 15 15, 0, 0, 1, 15 30
    A 15 15, 0, 1, 1, 27.99 7.5
    L 15 15
  " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
`
const groupCurrentPage = ref(1)
const groupPageSize = ref(10)
const groupTotal = ref(0)
const buildCurrentPage = ref(1)
const buildPageSize = ref(10)
const buildTotal = ref(0)
const loadingText = ref('上传文件较大，请耐心等待...')
const direction = ref('rtl')
const testName = ref('') // 绑定设备时传入的 测试平台名称name
const state: any = reactive({
  deviceData: [], // 设备管理数据
  deviceDataShow: [],
  d_typeData: [], // 设备类型数据
  d_groupData: [], // 测试平台管理数据
  groupIdList: [], // 分组ID集合
  buildData: [], // build管理数据
  buildName: []
})
const gidID = ref('')
const isShowTermail = ref(false)
const isNoServerIp = ref(false)
const remark = ref('')
const termmailInfo = ref({})
const termmailId = ref(null)
const options = ref([
  {
    value: '设备',
    label: '设备',
    children: []
  },
  {
    value: '服务',
    label: '服务',
    children: [
      {
        value: 'buildservice',
        label: 'buildservice'
      }
    ]
  }
])
const titleDialog = ref('')
const totalBuildData = ref([])
const statusOptions = [
  {
    value: 'True',
    label: '使用中'
  },
  {
    value: 'False',
    label: '空闲中'
  }
]
const searchForm = ref({
  status: '',
  name: ''
})
let addDeviceForm = reactive({
  id: null,
  ip: '',
  username: '',
  password: '',
  type: '',
  gid__name: ''
})
const addDeviceRuleFormRef = ref<FormInstance>()
const addDeviceFormRules = reactive<FormRules>({
  ip: [{ required: true, message: 'ip不能为空', trigger: 'blur' }],
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
  gid__name: [{ required: true, message: '请选择测试平台', trigger: 'blur' }]
})

// 测试平台管理form
let addGroupForm = reactive({
  id: '',
  name: '',
  ip: '',
  build: null,
  isapv: null
})

// 拉取文件弹窗form
let downloadFileForm = reactive({
  filetype: 'apvbuild',
  url: ''
})
const downloadFileRuleFormRef = ref<FormInstance>()
const downloadFileFormRules = reactive<FormRules>({
  fileType: [{ required: true, message: 'fileType不能为空', trigger: 'blur' }],
  url: [{ required: true, message: '下载链接不能为空', trigger: 'blur' }]
})
const borrowOrReturnID = ref(null)
const borrowPlatformForm = reactive({
  user: ''
})
const borrowPlatformRuleFormRef = ref<FormInstance>()
const borrowPlatformFormRules = reactive<FormRules>({
  user: [{ required: true, message: '测试平台借用人不能为空', trigger: 'blur' }]
})
let validateIPAddress = (rule, value, callback) => {
  if (value == '') {
    return callback(new Error('IP地址不能为空'))
  }
  let regexp = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/g
  let valdata = value.split(',')
  let isCorrect = true
  if (valdata.length) {
    for (let i = 0; i < valdata.length; i++) {
      if (regexp.test(valdata[i]) == false) {
        isCorrect = false
      }
    }
  }
  if (!isCorrect) {
    callback(new Error('请输入正确的IP地址'))
  } else {
    callback()
  }
}
const addGroupRuleFormRef = ref<FormInstance>()
const addGroupFormRules = reactive<FormRules>({
  name: [{ required: true, message: '平台名称不能为空', trigger: 'blur' }],
  build: [{ required: true, message: '支持测试版本不能为空', trigger: 'blur' }],
  isapv: [{ required: true, message: '请选择平台类型', trigger: 'change' }],
  buildip: [{ required: true, validator: validateIPAddress, trigger: 'blur' }]
})

// 切换Tab
const handleClick = (tab: TabsPaneContext, event: Event) => {
  activeName.value = String(tab.props.name)
  sessionStorage.setItem('activeName', activeName.value)
}

// 移除标签
const handleRemoveClick = (targetName: string) => {
  consoleTabs.value.map((item) => {
    if (item.name === targetName) {
      item.component = null
    } else {
      item.component = markRaw(Termmail)
    }
  })
  let index = consoleTabs.value.findIndex((tab) => tab.name === targetName)
  consoleTabs.value = consoleTabs.value.filter((tab) => String(tab.name) != targetName)
  state.d_groupData.map((item) => {
    if (item.name === activeName.value) {
      item.isShowTermail = false
    }
  })
  if (consoleTabs.value.length != 0 && index != consoleTabs.value.length && activeName.value != 'testbedManagement') {
    activeName.value = consoleTabs.value[index].name
  } else {
    activeName.value = 'testbedManagement'
  }
  sessionStorage.setItem('activeName', 'testbedManagement')
}

const getBuildName = (value) => {}

// 打开添加/编辑弹窗
const openAddDialog = (type, operation, id) => {
  switch (type) {
    case 'device':
      addDeviceForm.gid__name = testName.value
      operation == 'add' ? (titleDialog.value = '新增') : (titleDialog.value = '编辑')
      nextTick(() => {
        // nextTick 解决表单重置无效的问题
        getOneData(type, id)
        if (titleDialog.value == '编辑' && addDeviceForm.type !== 'buildservice') {
          isNoServerIp.value = true
        } else if (titleDialog.value == '新增') {
          addDeviceForm.username = ''
          addDeviceForm.password = ''
          isNoServerIp.value = false
        } else {
          isNoServerIp.value = false
        }
      })
      dialogVisible.value = true
      break
    case 'group':
      operation == 'add' ? (titleDialog.value = '添加测试平台') : (titleDialog.value = '编辑测试平台')
      nextTick(() => {
        getOneData(type, id)
      })
      groupDialogVisible.value = true
      break
    default:
      break
  }
}

const openAddDeviceDrawer = async (data) => {
  state.deviceDataShow = []
  testName.value = data.name
  gidID.value = data.id
  getDevice()
  deviceDrawer.value = true
}

// 获取单个数据
const getOneData = (type, id) => {
  switch (type) {
    case 'device':
      state.deviceDataShow.map((item) => {
        if (item.id === id) {
          addDeviceForm.id = item.id
          addDeviceForm.ip = item.ip
          addDeviceForm.username = item.uname
          addDeviceForm.password = item.passw
          addDeviceForm.type = item.type
          addDeviceForm.gid__name = item.gid__name
        }
      })
      break
    case 'group':
      state.d_groupData.map((item) => {
        if (item.id === id) {
          addGroupForm.id = item.id
          addGroupForm.ip = item.ip
          addGroupForm.name = item.name
          addGroupForm.build = item.build
          addGroupForm.isapv = item.isapv
          // addGroupForm.buildip = item.buildip
        }
      })
      break
    default:
      break
  }
}

// 添加设备
const onAddDeviceForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      addDeviceForm.type === 'buildservice' ? delete addDeviceForm.username && delete addDeviceForm.password : ''
      if (titleDialog.value == '新增') {
        delete addDeviceForm.id
        addDevice(addDeviceForm)
      } else {
        editDevice(addDeviceForm)
      }
      addDeviceRuleFormRef.value.resetFields()
      dialogVisible.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 添加测试平台管理
const onAddGroupForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (titleDialog.value == '添加测试平台') {
        delete addGroupForm.id
        addD_group(addGroupForm)
      } else {
        editD_group(addGroupForm)
      }
      addGroupRuleFormRef.value.resetFields()
      groupDialogVisible.value = false
    }
  })
}

// 拉取文件
const onDownloadFile = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      downloadLoading.value = true
      let res = await downloadBuildFileApi(downloadFileForm)
      downloadLoading.value = false
      if (res.code === 1000) {
        getBuild()
        ElMessage({
          message: '文件拉取成功',
          type: 'success',
          duration: 1000
        })
      }
      handleClose('downloadFileDialog')
    }
  })
}

const onBorrowPlatForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const params = {
        id: borrowOrReturnID.value,
        user: borrowPlatformForm.user
      }
      let res = await borrow_groupApi(params)
      if (res.code === 1000) {
        ElMessage({
          message: '测试环境借用成功',
          type: 'success',
          duration: 1000
        })
      }
      handleClose('borrowPlatformDialog')
    }
  })
}

// 取消弹窗 - 测试平台管理
const onResetGroupRuleForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  groupDialogVisible.value = false
}

// 取消弹窗 - 设备管理
const onResetDeviceForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  dialogVisible.value = false
}

// 取消弹窗
const onResetDownloadFileForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  openDownloadDialog.value = false
  downloadLoading.value = false
}

const onResetBorrowPlatForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  borrowPlatformDialog.value = false
}

// 关闭弹窗
const handleClose = (type) => {
  switch (type) {
    case 'deviceDialog':
      dialogVisible.value = false
      isNoServerIp.value = false
      addDeviceRuleFormRef.value.resetFields()
      break
    case 'groupDialog':
      groupDialogVisible.value = false
      addGroupRuleFormRef.value.resetFields()
      break
    case 'downloadFileDialog':
      openDownloadDialog.value = false
      downloadFileRuleFormRef.value.resetFields()
      break
    case 'borrowPlatformDialog':
      borrowPlatformDialog.value
      borrowPlatformRuleFormRef.value.resetFields()
  }
}

// 删除
const handleDelete = (type, id) => {
  switch (type) {
    case 'device':
      deleteDevice(id)
      break
    case 'group':
      deleteD_group(id)
      break
    case 'deviceType':
      deleteD_type(id)
      break
    case 'build':
      deleteBuild(id)
      break
    default:
      break
  }
}

const searchDevice = (val) => {
  searchForm.value.status = val
  getD_group(1, searchForm.value)
}
const searchDeviceName = (val) => {
  searchForm.value.name = val
  getD_group(1, searchForm.value)
}

onMounted(() => {
  ;['testbedManagement', 'buildManagement', 'showTestCase', 'serialServer'].includes(activeName.value) == true ? '' : (activeName.value = 'testbedManagement')
  getDevice()
  getD_typeApi()
  getD_group(1, '')
  getBuild()
})

// 分组管理 接口
const getD_group = async (...args) => {
  const page = args[0]
  const status = (args && args[1]) || ''
  const group = args[1] === '' ? await d_groupApi({ page }) : await d_groupApi({ page, status: searchForm.value.status || undefined, name: searchForm.value.name || undefined })
  group.data.data.forEach((item, index) => {
    item.isShowTermail = false
  })
  state.d_groupData = group.data.data
  state.d_groupData.map((item) => {
    item.uptime = utc2beijing(item.uptime)
  })
  groupTotal.value = group.data.total
}

// 分组管理 添加接口
const addD_group = async (params) => {
  let res = await addD_groupApi(params)
  if (res?.code === 1000) {
    getD_group(1, searchForm.value)
    ElMessage({
      message: '添加成功',
      type: 'success',
      duration: 1000
    })
  } else {
    ElMessage({
      message: res?.msg || '添加失败',
      type: 'error',
      duration: 3000
    })
  }
}

// 分组管理 编辑接口
const editD_group = async (params) => {
  let res = await editD_groupApi(params)
  if (res.code === 1000) {
    getD_group(1, searchForm.value)
    ElMessage({
      message: res?.msg || '编辑成功',
      type: 'success',
      duration: 1000
    })
  } else {
    ElMessage({
      message: res?.msg || '编辑失败',
      type: 'error',
      duration: 3000
    })
  }
}

// 分组管理 删除接口
const deleteD_group = async (id) => {
  let params = {
    id: id
  }
  let res = await deleteD_groupApi(params)
  if (res.code === 1000) {
    getD_group(1, searchForm.value)
    ElMessage({
      message: res?.msg || '删除成功',
      type: 'success',
      duration: 1000
    })
  }
}

// 设备管理 获取接口
const getDevice = async () => {
  let res = await deviceApi({ gid: gidID.value })
  state.deviceData = res.data
  state.deviceDataShow = res.data
  console.log('设备管理...', state.deviceData)
}

// 设备管理 添加接口
const addDevice = async (params) => {
  let res = await addDeviceApi(params)
  if (res?.code === 1000) {
    getDevice()
    ElMessage({
      message: '添加成功',
      type: 'success',
      duration: 1000
    })
  }
}

// 设备管理 编辑接口
const editDevice = async (params) => {
  let res = await editDeviceApi(params)
  if (res.code === 1000) {
    getDevice()
    ElMessage({
      message: res?.msg || '编辑成功',
      type: 'success',
      duration: 1000
    })
  }
}

// 设备管理 删除接口
const deleteDevice = async (id) => {
  let params = {
    id: id
  }
  let res = await deleteDeviceApi(params)
  if (res.code === 1000) {
    getDevice()
    ElMessage({
      message: res?.msg || '删除成功',
      type: 'success',
      duration: 1000
    })
  }
}

// 设备类型 获取接口
const getD_typeApi = async () => {
  let res = await d_typeApi()
  state.d_typeData = res.data
  remark.value = res?.migration || ''
  options.value[0].children = optionsPushType(state.d_typeData)
  console.log('设备类型...', state.d_typeData)
}

// 设备类型 添加接口
const addD_type = async (params) => {
  let res = await addD_typeApi(params)
  if (res?.code === 1000) {
    getD_typeApi()
    ElMessage({
      message: '添加成功',
      type: 'success',
      duration: 1000
    })
  } else {
    ElMessage({
      message: res?.msg || '添加失败',
      type: 'error',
      duration: 3000
    })
  }
}

// 设备类型 编辑接口
const editD_type = async (params) => {
  let res = await editD_typeApi(params)
  if (res.code === 1000) {
    getD_typeApi()
    ElMessage({
      message: res?.msg || '编辑成功',
      type: 'success',
      duration: 1000
    })
  } else {
    ElMessage({
      message: res?.msg || '编辑失败',
      type: 'error',
      duration: 3000
    })
  }
}

// 分组管理 删除接口
const deleteD_type = async (id) => {
  let params = {
    id: id
  }
  let res = await deleteD_typeApi(params)
  if (res.code === 1000) {
    getD_typeApi()
    ElMessage({
      message: res?.msg || '删除成功',
      type: 'success',
      duration: 1000
    })
  }
}

// build管理 获取接口
const getBuild = async () => {
  let res = await buildApi({ filetype: 'apvbuild' })
  state.buildName = res.data
  totalBuildData.value = res.data.map((item) => ({ name: item }))
  state.buildData = queryByPage(totalBuildData.value)
  buildTotal.value = res.data.length || 0
}

// 处理build - 实现分页
const queryByPage = (totalData) => {
  // 起始位置 = (当前页 - 1) x 每页的大小
  const start = (buildCurrentPage.value - 1) * buildPageSize.value
  // 结束位置 = 当前页 x 每页的大小
  const end = buildCurrentPage.value * buildPageSize.value
  return totalData.slice(start, end)
}

// build管理 删除接口
const deleteBuild = async (name) => {
  let params = {
    filename: name,
    filetype: 'apvbuild'
  }
  let res = await deleteBuildApi(params)
  if (res.code === 1000) {
    getBuild()
    ElMessage({
      message: res?.msg || '删除成功',
      type: 'success',
      duration: 1000
    })
  }
}

// 状态变更
const changeStatus = (data) => {
  ElMessage({
    message: '待接口联调',
    type: 'warning',
    duration: 2000
  })
}

// 平台借用/归还
const changePlatformStatus = async (status, id) => {
  const params = {
    id,
    user: JSON.parse(localStorage.getItem('userInfo'))?.nickname
  }
  let res = status === 'borrow' ? await borrow_groupApi(params) : await return_groupApi({ id })
  if (res.code === 1000) {
    ElMessage({
      message: status === 'borrow' ? '测试环境借用成功' : '测试环境归还成功',
      type: 'success',
      duration: 1000
    })
    getD_group(groupCurrentPage.value, searchForm.value)
  }
}

const changeType = (value) => {
  addDeviceForm.type = value[1]
  value[1] === 'buildservice' ? (isNoServerIp.value = false) : (isNoServerIp.value = true)
}

// 文件上传
const handleUpload = async (files) => {
  if (state.buildName.includes(files.file.name)) {
    ElMessage.error('请勿重复上传该文件！')
    return false
  }
  let formData = new FormData()
  formData.append('file', files.file)
  formData.append('filetype', 'apvbuild')
  buildUpload(formData)
}

const buildUpload = async (data) => {
  loadingInstance.value = true
  let res = await buildUploadApi(data)
  loadingInstance.value = false
  if (res.code === 1000) {
    loadingInstance.value = false
    getBuild()
    ElMessage({
      message: '上传成功',
      type: 'success',
      duration: 2000
    })
  } else {
    loadingInstance.value = false
    ElMessage({
      message: res.msg || '上传失败',
      type: 'error',
      duration: 3500
    })
  }
}

const handleSuccess: UploadProps['onSuccess'] = () => {
  getBuild()
}

const optionsPushType = (arr) => {
  let obj = {}
  // 将数组转化为对象
  for (let key in arr) {
    obj[key] = arr[key]
  }
  let newObj = Object.keys(obj).map((val) => ({
    label: obj[val],
    value: obj[val]
  }))
  return newObj
}

const openConsole = async (row) => {
  // if (isShowTermail.value) {
  //   ElMessage({
  //     message: '已有打开的终端,请先关闭!',
  //     type: 'warning'
  //   })
  //   return
  // }
  await getDeviceInfo(row)
  termmailId.value = row
}

const cloeConsole = (row) => {
  row.isShowTermail = false
  isShowTermail.value = false
  handleRemoveClick(row.name)
  sessionStorage.setItem('activeName', 'testbedManagement')
}

const handleGroupSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleGroupCurrentChange = (val: number) => {
  groupCurrentPage.value = val
  getD_group(groupCurrentPage.value, searchForm.value)
}

const handleBuildSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleBuildCurrentChange = (val: number) => {
  buildCurrentPage.value = val
  state.buildData = queryByPage(totalBuildData.value)
}

// 设备管理 获取终端用户名密码
const getDeviceInfo = async (data) => {
  let res = await deviceApi({ gid: data.id, type: 'Console' })
  if (res.code === 1000) {
    if (res.data.length === 0) {
      ElMessage({
        message: '该测试平台下暂无可用终端',
        type: 'error',
        duration: 2500
      })
    } else {
      termmailInfo.value = res.data[0]
      await (activeName.value = String(data.name))
      await consoleTabs.value.push(data)
      consoleTabs.value.map((item) => {
        item.component = markRaw(Termmail)
      })
      data.isShowTermail = true
      isShowTermail.value = true
      console.log(`output->data`, consoleTabs.value)
    }
  }
  console.log('设备管理...', termmailInfo.value)
}
</script>

<style lang="scss" scoped>
.remark {
  display: flex;
  width: 500px;
  color: #999999;
}

.moreButton {
  display: flex;
  flex-direction: column;
}

.tagType {
  margin: 0px 5px;
}

.search-wrap {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  .ignore-select-wrap {
    display: flex;
    align-items: center;
    .el-select {
      :deep(.el-input__wrapper) {
        width: 200px !important;
      }
    }
    .el-input {
      height: 38px;
      margin-left: 20px;
      :deep(.el-input__wrapper) {
        width: 200px !important;
      }
    }

    // width: 220px;
    margin: 0 10px;
  }
}

.addDevice-form {
  .el-select,
  .el-input {
    width: 350px;
  }
}

:deep(.el-cascader) {
  width: 350px !important;
}

:deep(.deviceDrawerStyle) {
  width: 50% !important;

  .el-drawer__header {
    margin-bottom: 0px;
  }
}

.deviceTitle {
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
  height: 40px;

  span {
    margin-right: 15px;
  }
}

.group-card,
.deivce-card,
.build-card {
  margin-top: 10px;
}

.build-card {
  .upload-demo {
    display: inline-block;
  }
}

.deivce-card {
  :deep(.el-card__body) {
    height: 70vh;
  }
}

.el-pagination {
  display: flex;
  justify-content: end;
  margin-top: 25px;
}

.hhh {
  // border-radius: 100%;
  -webkit-animation: breathe 1500ms ease infinite;
  -moz-animation: breathe 1500ms ease infinite;
  -o-animation: breathe 1500ms ease infinite;
  animation: breathe 1500ms ease infinite;
}

@-webkit-keyframes breathe {
  0% {
    opacity: 0.2;
    box-shadow: 0 1px 10px rgba(255, 255, 255, 0.1);
  }

  100% {
    opacity: 1;
    box-shadow: 0 1px 40px rgba(255, 107, 132, 0.5);
  }

  50% {
    opacity: 1;
    box-shadow: 0 1px 80px #ff6b84;
  }
}

@-moz-keyframes breathe {
  0% {
    opacity: 0.2;
    box-shadow: 0 1px 10px rgba(255, 255, 255, 0.1);
  }

  100% {
    opacity: 1;
    box-shadow: 0 1px 40px rgba(255, 107, 132, 0.5);
  }

  50% {
    opacity: 1;
    box-shadow: 0 1px 80px #ff6b84;
  }
}

@-o-keyframes breathe {
  0% {
    opacity: 0.2;
    box-shadow: 0 1px 10px rgba(255, 255, 255, 0.1);
  }

  100% {
    opacity: 1;
    box-shadow: 0 1px 40px rgba(255, 107, 132, 0.5);
  }

  50% {
    opacity: 1;
    box-shadow: 0 1px 80px #ff6b84;
  }
}

@keyframes breathe {
  0% {
    opacity: 0.2;
    box-shadow: 0 1px 10px rgba(255, 255, 255, 0.1);
  }

  100% {
    opacity: 1;
    box-shadow: 0 1px 40px rgba(255, 107, 132, 0.5);
  }

  50% {
    opacity: 1;
    box-shadow: 0 1px 80px #ff6b84;
  }
}

.status-point {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 3px;
}

:deep(.el-table .cell) {
  padding: 0px;
}
</style>

<style lang="scss">
.moreGroupPopover {
  min-width: 0px !important;
  width: 66px !important;

  .el-button {
    margin-bottom: 5px;
    margin-left: 0px;

    &:last-child {
      margin-bottom: 0px;
      margin-left: 0px;
    }
  }
}
</style>
