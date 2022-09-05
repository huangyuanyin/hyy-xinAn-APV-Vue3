<template>
  <div class="performanceManagement">
    <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
      <el-tab-pane label="设备管理" name="instrumentManagement">
        <el-button type="primary" @click="openAddDialog('device', 'add', null)" style="margin-bottom: 20px">
          添加设备
        </el-button>
        <el-table :data="state.tableData">
          <el-table-column prop="uname" label="设备名称" align="center" />
          <el-table-column prop="ip" label="ip" align="center" />
          <el-table-column prop="tid__name" label="设备类型" align="center" />
          <el-table-column prop="gid__name" label="gid__name" align="center" />
          <el-table-column fixed="right" label="Operations" align="center">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="openAddDialog('device', 'edit', scope.row.id)">编辑
              </el-button>
              <el-button link type="primary" size="small" @click="handleDelete('device', scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="设备类型" name="third">
        <el-button type="primary" @click="openAddDialog('deviceType', 'add', null)" style="margin-bottom: 20px">
          添加设备类型
        </el-button>
        <el-table :data="state.d_typeData" border>
          <el-table-column prop="name" label="设备类型" align="center" />
          <el-table-column fixed="right" label="Operations" align="center">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="openAddDialog('deviceType', 'edit', scope.row.id)">编辑
              </el-button>
              <el-button link type="primary" size="small" @click="handleDelete('deviceType', scope.row.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="测试环境管理" name="second">
        <el-button type="primary" @click="openAddDialog('group', 'add', null)" style="margin-bottom: 20px">
          添加测试环境
        </el-button>
        <el-table :data="state.d_groupData">
          <el-table-column prop="name" label="测试环境名称" align="center" />
          <el-table-column prop="buildip" label="buildIp" align="center" />
          <el-table-column prop="build" label="build" align="center" />
          <el-table-column prop="status" label="状态" align="center" />
          <el-table-column fixed="right" label="Operations" align="center">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="openAddDialog('group', 'edit', scope.row.id)">编辑
              </el-button>
              <el-button link type="primary" size="small" @click="handleDelete('group', scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="build管理" name="buildManagement">
        <el-upload class="upload-demo" :show-file-list="false" action="action" :http-request="handleUpload"
          :on-success="handleSuccess">
          <el-button type="primary" style="margin-bottom: 20px" :auto-upload="false">上传文件</el-button>
        </el-upload>
        <el-table :data="state.buildData">
          <el-table-column prop="name" label="文件名称" align="center" />
          <el-table-column fixed="right" label="Operations" align="center">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleDelete('build', scope.row.name)">删除文件
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!--添加设备弹窗-->
    <el-dialog v-model="dialogVisible" :title="titleDialog" width="25%" :before-close="handleClose">
      <span>
        <el-form :inline="false" :model="addDeviceForm" ref="addDeviceRuleFormRef" :rules="addDeviceFormRules"
          class="addDevice-form" label-width="110px">
          <el-form-item label="IP" prop="ip">
            <el-input v-model="addDeviceForm.ip" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="设备名称" prop="uname">
            <el-input v-model="addDeviceForm.uname" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="设备类型" prop="tid__name">
            <el-select v-model="addDeviceForm.tid__name" placeholder="请选择...">
              <el-option v-for="(item, index) in state.d_typeData" :key="'d_typeData' + index" :label="item.name"
                :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="分组名称" prop="gid__name">
            <el-select v-model="addDeviceForm.gid__name" placeholder="请选择...">
              <el-option v-for="(item, index) in state.d_groupData" :key="'d_groupData' + index" :label="item.name"
                :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onResetDeviceForm(addDeviceRuleFormRef)">取消</el-button>
          <el-button type="primary" @click="onAddDeviceForm(addDeviceRuleFormRef)">添加</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加设备类型弹窗-->
    <el-dialog v-model="deviceTypeDialogVisible" :title="titleDialog" width="25%" :before-close="handleClose">
      <span>
        <el-form :inline="false" :model="addDeviceTypeForm" ref="addDeviceTypeRuleFormRef"
          :rules="addDeviceTypeFormRules" class="addDevice-form" label-width="110px">
          <el-form-item label="设备类型名称" prop="name">
            <el-input v-model="addDeviceTypeForm.name" placeholder="请输入..." />
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onResetDeviceForm(addDeviceTypeRuleFormRef)">取消</el-button>
          <el-button type="primary" @click="onAddDeviceTypeForm(addDeviceTypeRuleFormRef)">添加</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加测试环境管理弹窗-->
    <el-dialog v-model="groupDialogVisible" :title="titleDialog" width="25%" :before-close="handleClose">
      <span>
        <el-form :inline="false" :model="addGroupForm" ref="addGroupRuleFormRef" :rules="addGroupFormRules"
          class="addDevice-form" label-width="110px">
          <el-form-item label="分组名称" prop="name">
            <el-input v-model="addGroupForm.name" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="build" prop="build">
            <el-select v-model="addGroupForm.build" placeholder="请选择...">
              <el-option v-for="(item, index) in state.buildData" :key="'buildData' + index" :label="item.name"
                :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="buildip" prop="buildip">
            <el-input v-model="addGroupForm.buildip" placeholder="请输入..." />
          </el-form-item>
          <!-- <el-form-item label="状态" prop="status">
            <el-select v-model="addGroupForm.status" placeholder="请选择...">
              <el-option label="空闲" value="false" />
              <el-option label="使用中" value="true" />
            </el-select>
          </el-form-item> -->
        </el-form>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onResetDeviceForm(addGroupRuleFormRef)">取消</el-button>
          <el-button type="primary" @click="onAddGroupForm(addGroupRuleFormRef)">添加</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, toRefs } from "vue";
import { ref, reactive } from "vue";
import type { TabsPaneContext } from "element-plus";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules, UploadProps } from "element-plus";
import { useRouter } from "vue-router";
import { deviceApi, addDeviceApi, editDeviceApi, deleteDeviceApi, d_groupApi, d_typeApi, addD_typeApi, editD_typeApi, deleteD_typeApi, addD_groupApi, editD_groupApi, deleteD_groupApi } from '@/api/APV/index.js'
import { buildApi, buildUploadApi, deleteBuildApi } from '@/api/APV/buildManagement.js'

const router = useRouter()
const activeName = ref("instrumentManagement");
const dialogVisible = ref(false);
const deviceTypeDialogVisible = ref(false)
const groupDialogVisible = ref(false)
const state: any = reactive({
  tableData: [],
  d_typeData: [], // 设备类型数据
  d_groupData: [], // 分组管理数据
  groupIdList: [], // 分组ID集合
  buildData: [], // build管理数据
})
const titleDialog = ref("")
const addDeviceForm = reactive({
  id: "",
  ip: "",
  uname: "",
  tid__name: "",
  gid__name: "",
});
const addDeviceRuleFormRef = ref<FormInstance>();
const addDeviceFormRules = reactive<FormRules>({
  ip: [{ required: true, message: "ip不能为空", trigger: "blur" }],
  uname: [
    { required: true, message: "设备名称不能为空", trigger: "blur" },
  ],
  tid__name: [{ required: true, message: "请选择设备类型", trigger: "blur" }],
  gid__name: [
    { required: true, message: "请选择分组", trigger: "blur" },
  ],
});

// 设备类型form
let addDeviceTypeForm = reactive({
  id: "",
  name: ""
})
const addDeviceTypeRuleFormRef = ref<FormInstance>();
const addDeviceTypeFormRules = reactive<FormRules>({
  name: [
    { required: true, message: "设备类型名称不能为空", trigger: "blur" },
  ],
});

// 分组管理form
const addGroupForm = reactive({
  id: "",
  name: "",
  build: null,
  buildip: "",
  // status: null,
})
const addGroupRuleFormRef = ref<FormInstance>();
const addGroupFormRules = reactive<FormRules>({
  name: [
    { required: true, message: "设备类型名称不能为空", trigger: "blur" },
  ],
  build: [
    { required: true, message: "build不能为空", trigger: "blur" },
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

// 打开添加/编辑弹窗
const openAddDialog = (type, operation, id) => {
  switch (type) {
    case 'device':
      operation == 'add' ? titleDialog.value = '添加设备' : titleDialog.value = '编辑设备'
      getOneData(type, id)
      dialogVisible.value = true;
      break;
    case 'deviceType':
      operation == 'add' ? titleDialog.value = '添加设备类型' : titleDialog.value = '编辑设备类型'
      getOneData(type, id)
      deviceTypeDialogVisible.value = true;
      break;
    case 'group':
      operation == 'add' ? titleDialog.value = '添加分组' : titleDialog.value = '编辑分组'
      getOneData(type, id)
      groupDialogVisible.value = true;
      break;
    default:
      break;
  }
}

// 获取单个数据
const getOneData = (type, id) => {
  switch (type) {
    case "device":
      state.tableData.map(item => {
        if (item.id === id) {
          addDeviceForm.id = item.id
          addDeviceForm.ip = item.ip
          addDeviceForm.uname = item.uname
          addDeviceForm.tid__name = item.tid__name
          addDeviceForm.gid__name = item.gid__name
        }
      })
      break;
    case 'deviceType':
      state.d_typeData.map(item => {
        if (item.id === id) {
          addDeviceTypeForm.name = item.name
          addDeviceTypeForm.id = item.id
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
      console.log("添加成功...", addDeviceForm);
      if (titleDialog.value == '添加设备') {
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

// 添加设备类型
const onAddDeviceTypeForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("添加成功...", addDeviceTypeForm);
      if (titleDialog.value == '添加设备类型') {
        addD_type(addDeviceTypeForm)
      } else {
        editD_type(addDeviceTypeForm)
      }
      addDeviceTypeRuleFormRef.value.resetFields()
      deviceTypeDialogVisible.value = false;
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 添加分组管理 
const onAddGroupForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("添加成功...", addGroupForm);
      if (titleDialog.value == '添加分组') {
        addD_group(addGroupForm)
      } else {
        editD_group(addGroupForm)
      }
      addGroupRuleFormRef.value.resetFields()
      groupDialogVisible.value = false;
    }
  });
};

// 取消弹窗
const onResetDeviceForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  dialogVisible.value = false;
  deviceTypeDialogVisible.value = false;
  groupDialogVisible.value = false;
};

// 关闭弹窗
const handleClose = (done: () => void) => {
  dialogVisible.value = false;
  deviceTypeDialogVisible.value = false
  groupDialogVisible.value = false
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
  state.d_groupData = group.data
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
  state.tableData = res.data
  console.log("设备管理...", state.tableData);
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

// 文件上传
const handleUpload = async (files) => {
  console.log("onChange...", files)
  let formData = new FormData()
  formData.append('file', files.file)
  formData.append('filetype', "apvbuild")
  let res = await buildUploadApi(formData)
  if (res.code === 1000) {
    ElMessage({
      message: "上传成功",
      type: "success",
      duration: 2000,
    });
  }
}

const handleSuccess: UploadProps['onSuccess'] = () => {
  getBuild()
}

</script>

<style lang="scss" scoped>
.addDevice-form {
  .el-input {
    width: 214px;
  }
}
</style>

