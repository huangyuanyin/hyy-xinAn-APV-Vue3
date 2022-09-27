<template>
  <div class="performanceManagement">
    <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
      <el-tab-pane label="测试平台管理" name="testbedManagement">
        <el-card class="group-card" shadow="never">
          <el-button type="primary" @click="openAddDialog('group', 'add', null)" style="margin-bottom: 20px">
            添加测试平台
          </el-button>
          <el-table :data="state.d_groupData" stripe>
            <el-table-column prop="name" label="测试平台名称" align="center" />
            <el-table-column prop="build" label="测试版本" align="center" />
            <el-table-column label="状态" align="center">
              <template #default="scope">
                <span v-if="scope.row.status === false">空闲</span>
                <span v-else>使用中</span>
              </template>
            </el-table-column>
            <el-table-column prop="user" label="使用人" align="center" />
            <el-table-column prop="uptime" label="更新时间" align="center" />
            <el-table-column fixed="right" label="操作" align="center">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="openAddDeviceDrawer(scope.row)">绑定设备
                </el-button>
                <el-button link type="primary" size="small" @click="changeStatus(scope.row)">状态变更
                </el-button>
                <el-button link type="primary" size="small" @click="openAddDialog('group', 'edit', scope.row.id)">编辑
                </el-button>
                <el-popconfirm title="确定删除这个测试平台?" trigger="click" confirm-button-text="确认删除" cancel-button-text="取消"
                  @confirm="handleDelete('group', scope.row.id)">
                  <template #reference>
                    <el-button link type="danger" size="small">删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-model:currentPage="groupCurrentPage" v-model:page-size="groupPageSize"
            :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="groupTotal"
            @size-change="handleGroupSizeChange" @current-change="handleGroupCurrentChange" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="build管理" name="buildManagement">
        <el-card class="build-card" shadow="never">
          <el-upload class="upload-demo" :show-file-list="false" action="action" :http-request="handleUpload"
            :on-success="handleSuccess">
            <el-button type="primary" style="margin-bottom: 20px" :auto-upload="false" :disabled="fileDisabled">
              上传文件
            </el-button>
          </el-upload>
          <el-table :data="state.buildData" border stripe>
            <el-table-column prop="name" label="版本名称" align="center" />
            <el-table-column fixed="right" label="Operations" align="center">
              <template #default="scope">
                <el-popconfirm title="确定删除这个文件?" trigger="click" confirm-button-text="确认删除" cancel-button-text="取消"
                  @confirm="handleDelete('build', scope.row.name)">
                  <template #reference>
                    <el-button link type="primary" size="small">删除文件</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-model:currentPage="buildCurrentPage" v-model:page-size="buildPageSize"
            :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="buildTotal"
            @size-change="handleBuildSizeChange" @current-change="handleBuildCurrentChange" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!--添加设备弹窗-->
    <el-dialog v-model="dialogVisible" :title="titleDialog" width="35%" @close="handleClose('deviceDialog')"
      :close-on-click-modal=" false" :close-on-press-escape="false">
      <span>
        <el-form :inline="false" :model="addDeviceForm" ref="addDeviceRuleFormRef" :rules="addDeviceFormRules"
          class="addDevice-form" label-width="100px">
          <el-form-item label="IP" prop="ip">
            <el-input v-model="addDeviceForm.ip" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addDeviceForm.username" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addDeviceForm.password" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="设备类型" prop="type">
            <el-select v-model="addDeviceForm.type" placeholder="请选择...">
              <el-option v-for="(item, index) in state.d_typeData" :key="'d_typeData' + index" :label="item"
                :value="item" />
            </el-select>
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
        <el-form :inline="false" :model="addGroupForm" ref="addGroupRuleFormRef" :rules="addGroupFormRules"
          class="addDevice-form" label-width="100px">
          <el-form-item label="平台IP" prop="ip">
            <el-input v-model="addGroupForm.ip" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="平台名称" prop="name">
            <el-input v-model="addGroupForm.name" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="BuildIp" prop="buildip">
            <el-input v-model="addGroupForm.buildip" placeholder="请输入..." />
          </el-form-item>
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
          <el-button type="primary" @click="onAddGroupForm(addGroupRuleFormRef)">添加</el-button>
        </span>
      </template>
    </el-dialog>

    <el-drawer custom-class="deviceDrawerStyle" v-model="deviceDrawer" :direction="direction">
      <template #header>
        <h4>设备管理</h4>
      </template>
      <template #default>
        <div class="deviceTitle">
          <span>设备管理列表</span>
          <el-button type="primary" link @click="openAddDialog('device', 'add', null)"> + 添加设备 </el-button>
        </div>
        <el-card class="deivce-card" shadow="never">
          <el-table :data="state.deviceDataShow" stripe>
            <el-table-column prop="uname" label="设备名称" align="center" />
            <el-table-column prop="ip" label="ip" align="center" />
            <el-table-column prop="type" label="设备类型" align="center" />
            <el-table-column prop="gid__name" label="测试平台" align="center" />
            <el-table-column fixed="right" label="更多" align="center">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="openAddDialog('device', 'edit', scope.row.id)">编辑
                </el-button>
                <el-popconfirm title="确定删除这个设备?" trigger="click" confirm-button-text="确认删除" cancel-button-text="取消"
                  @confirm="handleDelete('device', scope.row.id)">
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
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, toRefs } from "vue";
import { ref, reactive } from "vue";
import type { TabsPaneContext } from "element-plus";
import { ElMessage } from "element-plus";
import { CirclePlusFilled } from "@element-plus/icons-vue";
import type { FormInstance, FormRules, UploadProps } from "element-plus";
import { useRouter } from "vue-router";
import { deviceApi, addDeviceApi, editDeviceApi, deleteDeviceApi, d_groupApi, d_typeApi, addD_typeApi, editD_typeApi, deleteD_typeApi, addD_groupApi, editD_groupApi, deleteD_groupApi } from '@/api/APV/index.js'
import { buildApi, buildUploadApi, deleteBuildApi } from '@/api/APV/buildManagement.js'
import { utc2beijing } from '@/utils/util.js'
import { buildOptions } from './data.js'

const activeName = ref("testbedManagement");
const dialogVisible = ref(false);
const groupDialogVisible = ref(false)
const isShowMore = ref(false)
const deviceDrawer = ref(false)
const fileDisabled = ref(false)
const direction = ref('rtl')
const testName = ref('') // 绑定设备时传入的 测试平台名称name
const state: any = reactive({
  deviceData: [], // 设备管理数据
  deviceDataShow: [],
  d_typeData: [], // 设备类型数据
  d_groupData: [], // 测试平台管理数据
  groupIdList: [], // 分组ID集合
  buildData: [], // build管理数据
})
const titleDialog = ref("")
let addDeviceForm = reactive({
  id: null,
  ip: "",
  username: "",
  password: "",
  type: "",
  gid__name: "",
});
const addDeviceRuleFormRef = ref<FormInstance>();
const addDeviceFormRules = reactive<FormRules>({
  ip: [{ required: true, message: "ip不能为空", trigger: "blur" }],
  username: [
    { required: true, message: "用户名不能为空", trigger: "blur" },
  ],
  password: [
    { required: true, message: "密码不能为空", trigger: "blur" },
  ],
  type: [{ required: true, message: "请选择设备类型", trigger: "blur" }],
  gid__name: [
    { required: true, message: "请选择测试平台", trigger: "blur" },
  ],
});

// 测试平台管理form
let addGroupForm = reactive({
  id: "",
  name: "",
  ip: "",
  build: null,
  buildip: "",
  // status: null,
})
const addGroupRuleFormRef = ref<FormInstance>();
const addGroupFormRules = reactive<FormRules>({
  name: [
    { required: true, message: "平台名称不能为空", trigger: "blur" },
  ],
  ip: [
    { required: true, message: "平台ip不能为空", trigger: "blur" },
  ],
  build: [
    { required: true, message: "支持测试版本不能为空", trigger: "blur" },
  ],
  buildip: [
    { required: true, message: "buildip不能为空", trigger: "blur" },
  ],
  // status: [{ required: true, message: "请选择状态", trigger: "blur" }],
});

// 切换Tab
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

const getBuildName = (value) => {
  console.log("dada", value);
}

// 打开添加/编辑弹窗
const openAddDialog = (type, operation, id) => {
  switch (type) {
    case 'device':
      addDeviceForm.gid__name = testName.value
      operation == 'add' ? titleDialog.value = '添加设备' : titleDialog.value = '编辑设备'
      nextTick(() => { // nextTick 解决表单重置无效的问题
        getOneData(type, id)
      })
      dialogVisible.value = true;
      break;
    case 'group':
      operation == 'add' ? titleDialog.value = '添加测试平台' : titleDialog.value = '编辑测试平台'
      nextTick(() => {
        getOneData(type, id)
      })
      groupDialogVisible.value = true;
      break;
    default:
      break;
  }
}

const openAddDeviceDrawer = (data) => {
  state.deviceDataShow = []
  testName.value = data.name
  state.deviceData.map((item) => {
    if (item.gid__name == testName.value) {
      state.deviceDataShow.push(item)
    }
  })
  deviceDrawer.value = true
}

// 获取单个数据
const getOneData = (type, id) => {
  switch (type) {
    case "device":
      state.deviceDataShow.map(item => {
        if (item.id === id) {
          addDeviceForm.id = item.id
          addDeviceForm.ip = item.ip
          addDeviceForm.username = item.username
          addDeviceForm.password = item.password
          addDeviceForm.type = item.type
          addDeviceForm.gid__name = item.gid__name
        }
      })
      break;
    case 'group':
      state.d_groupData.map(item => {
        if (item.id === id) {
          addGroupForm.id = item.id
          addGroupForm.name = item.name
          addGroupForm.build = item.build
          addGroupForm.buildip = item.buildip
        }
      })
      break;
    default:
      break;
  }
}

// 添加设备
const onAddDeviceForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (titleDialog.value == '添加设备') {
        delete addDeviceForm.id
        addDevice(addDeviceForm)
      } else {
        editDevice(addDeviceForm)
      }
      addDeviceRuleFormRef.value.resetFields()
      dialogVisible.value = false;
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 添加测试平台管理
const onAddGroupForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (titleDialog.value == '添加测试平台') {
        delete addGroupForm.id
        addD_group(addGroupForm)
      } else {
        editD_group(addGroupForm)
      }
      addGroupRuleFormRef.value.resetFields()
      groupDialogVisible.value = false;
    }
  });
};

// 取消弹窗 - 测试平台管理
const onResetGroupRuleForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields()
  groupDialogVisible.value = false;
};

// 取消弹窗 - 设备管理
const onResetDeviceForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields()
  dialogVisible.value = false;
};

// 关闭弹窗
const handleClose = (type) => {
  if (type === 'deviceDialog') {
    dialogVisible.value = false;
    addDeviceRuleFormRef.value.resetFields()
  } else {
    groupDialogVisible.value = false
    addGroupRuleFormRef.value.resetFields()
  }
};

// 删除
const handleDelete = (type, id) => {
  switch (type) {
    case 'device':
      deleteDevice(id)
      break;
    case 'group':
      deleteD_group(id)
      break;
    case 'deviceType':
      deleteD_type(id)
      break;
    case 'build':
      deleteBuild(id)
      break
    default:
      break;
  }
}

onMounted(() => {
  getDevice()
  getD_typeApi()
  getD_group()
  getBuild()
})

// 分组管理 接口
const getD_group = async () => {
  let group = await d_groupApi()
  state.d_groupData = group.data.data
  state.d_groupData.map((item) => {
    item.uptime = utc2beijing(item.uptime)
  })
}

// 分组管理 添加接口
const addD_group = async (params) => {
  let res = await addD_groupApi(params)
  if (res.code === 1000) {
    getD_group()
    ElMessage({
      message: "添加成功",
      type: "success",
      duration: 1000,
    });
  } else {
    ElMessage({
      message: res?.msg || "添加失败",
      type: "error",
      duration: 3000,
    });
  }
}

// 分组管理 编辑接口
const editD_group = async (params) => {
  let res = await editD_groupApi(params)
  if (res.code === 1000) {
    getD_group()
    ElMessage({
      message: res?.msg || "编辑成功",
      type: "success",
      duration: 1000,
    });
  } else {
    ElMessage({
      message: res?.msg || "编辑失败",
      type: "error",
      duration: 3000,
    });
  }
}

// 分组管理 删除接口
const deleteD_group = async (id) => {
  let params = {
    id: id
  }
  let res = await deleteD_groupApi(params)
  if (res.code === 1000) {
    getD_group()
    ElMessage({
      message: res?.msg || "删除成功",
      type: "success",
      duration: 1000,
    });
  }
}

// 设备管理 获取接口
const getDevice = async () => {
  let res = await deviceApi()
  state.deviceData = res.data
  groupTotal.value = res.total
  console.log("设备管理...", state.deviceData);
}

// 设备管理 添加接口
const addDevice = async (params) => {
  let res = await addDeviceApi(params)
  if (res.code === 1000) {
    getDevice()
    ElMessage({
      message: "添加成功",
      type: "success",
      duration: 1000,
    });
  } else {
    ElMessage({
      message: res?.msg || "添加失败",
      type: "error",
      duration: 3000,
    });
  }
}

// 设备管理 编辑接口
const editDevice = async (params) => {
  let res = await editDeviceApi(params)
  if (res.code === 1000) {
    getDevice()
    ElMessage({
      message: res?.msg || "编辑成功",
      type: "success",
      duration: 1000,
    });
  } else {
    ElMessage({
      message: res?.msg || "编辑失败",
      type: "error",
      duration: 3000,
    });
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
      message: res?.msg || "删除成功",
      type: "success",
      duration: 1000,
    });
  }
}

// 设备类型 获取接口
const getD_typeApi = async () => {
  let res = await d_typeApi()
  state.d_typeData = res.data
  console.log("设备类型...", state.d_typeData);
}

// 设备类型 添加接口
const addD_type = async (params) => {
  let res = await addD_typeApi(params)
  if (res.code === 1000) {
    getD_typeApi()
    ElMessage({
      message: "添加成功",
      type: "success",
      duration: 1000,
    });
  } else {
    ElMessage({
      message: res?.msg || "添加失败",
      type: "error",
      duration: 3000,
    });
  }
}

// 设备类型 编辑接口 
const editD_type = async (params) => {
  let res = await editD_typeApi(params)
  if (res.code === 1000) {
    getD_typeApi()
    ElMessage({
      message: res?.msg || "编辑成功",
      type: "success",
      duration: 1000,
    });
  } else {
    ElMessage({
      message: res?.msg || "编辑失败",
      type: "error",
      duration: 3000,
    });
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
      message: res?.msg || "删除成功",
      type: "success",
      duration: 1000,
    });
  }
}

// build管理 获取接口
const getBuild = async () => {
  let res = await buildApi({ filetype: "apvbuild" })
  state.buildData = res.data.map(item => ({ name: item }))
  buildTotal.value = res.dada?.total || 0
}

// build管理 删除接口
const deleteBuild = async (name) => {
  let params = {
    "filename": name,
    'filetype': "apvbuild"
  }
  let res = await deleteBuildApi(params)
  if (res.code === 1000) {
    getBuild()
    ElMessage({
      message: res?.msg || "删除成功",
      type: "success",
      duration: 1000,
    });
  }
}

// 状态变更
const changeStatus = (data) => {
  ElMessage({
    message: "待接口联调",
    type: "warning",
    duration: 2000,
  });
}

// 文件上传
const handleUpload = async (files) => {
  fileDisabled.value = true
  console.log("onChange...", files)
  let formData = new FormData()
  formData.append('file', files.file)
  formData.append('filetype', "apvbuild")
  let res = await buildUploadApi(formData)
  if (res.code === 1000) {
    fileDisabled.value = false
    ElMessage({
      message: "上传成功",
      type: "success",
      duration: 2000,
    });
  } else {
    fileDisabled.value = false
    ElMessage({
      message: res.msg || "上传失败",
      type: "error",
      duration: 2000,
    });
  }
}

const handleSuccess: UploadProps['onSuccess'] = () => {
  getBuild()
}

const groupCurrentPage = ref(1)
const groupPageSize = ref(10)
const groupTotal = ref(0)
const handleGroupSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleGroupCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

const buildCurrentPage = ref(1)
const buildPageSize = ref(10)
const buildTotal = ref(0)
const handleBuildSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleBuildCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
</script>

<style lang="scss" scoped>
.addDevice-form {

  .el-select,
  .el-input {
    width: 350px;
  }
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
</style>

