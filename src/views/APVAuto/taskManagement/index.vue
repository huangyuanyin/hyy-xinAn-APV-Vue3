<template>
  <div class="performanceManagement">
    <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
      <el-tab-pane label="任务管理" name="taskManagement">
        <el-button type="primary" @click="openAddDialog('task', 'add', null)" style="margin-bottom: 20px">
          添加任务
        </el-button>
        <el-table :data="state.tableData">
          <el-table-column prop="name" label="任务名称" align="center" />
          <el-table-column prop="build" label="版本信息" align="center" />
          <el-table-column prop="group" label="分组信息" align="center" />
          <el-table-column prop="state" label="任务状态" align="center" />
          <el-table-column prop="user" label="负责人" align="center" />
          <el-table-column prop="uptime" label="更新时间" align="center" />
          <el-table-column fixed="right" label="Operations" align="center">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="openAddDialog('task', 'edit', scope.row.id)">编辑
              </el-button>
              <el-button link type="primary" size="small" @click="handleDelete('task', scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!--添加任务弹窗-->
    <el-dialog v-model="dialogVisible" :title="titleDialog" width="25%" :before-close="handleClose">
      <span>
        <el-form :inline="false" :model="addTaskForm" ref="addTaskRuleFormRef" :rules="addTaskFormRules"
          class="addDevice-form" label-width="110px">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="addTaskForm.name" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="负责人" prop="user">
            <el-input v-model="addTaskForm.user" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="版本信息" prop="build">
            <el-select v-model="addTaskForm.build" placeholder="请选择...">
              <el-option v-for="(item, index) in state.buildData" :key="'buildData' + index" :label="item.name"
                :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="分组名称" prop="group">
            <el-select v-model="addTaskForm.group" placeholder="请选择...">
              <el-option v-for="(item, index) in state.d_groupData" :key="'d_groupData' + index" :label="item.name"
                :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onResetDeviceForm(addTaskRuleFormRef)">取消</el-button>
          <el-button type="primary" @click="onAddDeviceForm(addTaskRuleFormRef)">添加</el-button>
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
import type { FormInstance, FormRules } from "element-plus";
import { useRouter } from "vue-router";
import { deviceApi, addDeviceApi, editDeviceApi, deleteDeviceApi, d_typeApi, addD_typeApi, editD_typeApi, deleteD_typeApi, d_groupApi, addD_groupApi, editD_groupApi, deleteD_groupApi } from '@/api/APV/index.js'
import { taskApi, addTaskApi, editTaskApi, deleteTaskApi } from '@/api/APV/taskManagement.js'
import { buildApi } from '@/api/APV/buildManagement.js'

const router = useRouter()
const activeName = ref("taskManagement");
const dialogVisible = ref(false);
const deviceTypeDialogVisible = ref(false)
const groupDialogVisible = ref(false)
const state: any = reactive({
  tableData: [],  // 任务管理数据
  getD_group: [],  // 分组信息
  buildData: [], // build管理数据
})
const titleDialog = ref("")
const addTaskForm = reactive({
  id: "",
  name: "",
  user: "",
  build: "",
  group: "",
});
const addTaskRuleFormRef = ref<FormInstance>();
const addTaskFormRules = reactive<FormRules>({
  name: [
    { required: true, message: "任务名称不能为空", trigger: "blur" },
  ],
  user: [
    { required: true, message: "负责人不能为空", trigger: "blur" },
  ],
  build: [{ required: true, message: "请选择版本信息", trigger: "blur" }],
  group: [
    { required: true, message: "请选择分组", trigger: "blur" },
  ],
});

// 切换Tab
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

// 打开添加/编辑弹窗
const openAddDialog = (type, operation, id) => {
  switch (type) {
    case 'task':
      operation == 'add' ? titleDialog.value = '添加任务' : titleDialog.value = '编辑任务'
      getOneData(type, id)
      dialogVisible.value = true;
      break;
    default:
      break;
  }
}

// 获取单个数据
const getOneData = (type, id) => {
  switch (type) {
    case "task":
      state.tableData.map(item => {
        if (item.id === id) {
          addTaskForm.id = item.id
          addTaskForm.name = item.name
          addTaskForm.user = item.user
          addTaskForm.build = item.build
          addTaskForm.group = item.group
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
      console.log("添加成功...", addTaskForm);
      if (titleDialog.value == '添加任务') {
        addDevice(addTaskForm)
      } else {
        editDevice(addTaskForm)
      }
      addTaskRuleFormRef.value.resetFields()
      dialogVisible.value = false;
    } else {
      console.log("error submit!", fields);
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
    case 'task':
      deleteDevice(id)
      break;
    case 'group':
      deleteD_group(id)
      break;
    case 'deviceType':
      deleteD_type(id)
    default:
      break;
  }
}

onMounted(async () => {
  await getD_group()
  await getTask()
  await getBuild()
})

// 任务管理 获取接口
const getTask = async () => {
  let res = await taskApi()
  state.tableData = res.data
  console.log("任务管理...", state.tableData);
  handleGroupId()
}

// 分组管理 获取接口
const getD_group = async () => {
  let group = await d_groupApi()
  state.d_groupData = group.data
}

// build管理 获取接口
const getBuild = async () => {
  let res = await buildApi({ filetype: "apvbuild" })
  state.buildData = res.data.map(item => ({ name: item }))
}

// 分组管理 ID集合处理展示
const handleGroupId = () => {
  state.tableData.map((item, index) => {
    console.log("item.group", item.group)
    state.d_groupData.map((it) => {
      if (it.id === item.group) {
        state.tableData[index].group = it[index].name
      }
    })
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

</script>

<style lang="scss" scoped>
.addDevice-form {
  .el-input {
    width: 214px;
  }
}
</style>

