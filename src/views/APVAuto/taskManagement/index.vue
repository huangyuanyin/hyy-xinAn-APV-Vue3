<template>
  <div class="performanceManagement">
    <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
      <el-tab-pane label="任务管理" name="taskManagement">
        <el-button type="primary" @click="openAddDialog('task', 'add', null)" style="margin-bottom: 20px">
          添加任务
        </el-button>
        <el-table :data="state.tableData">
          <el-table-column prop="name" label="任务名称" align="center" />
          <el-table-column prop="build" label="压测版本" align="center" />
          <el-table-column prop="group" label="测试平台" align="center" />
          <el-table-column prop="state" label="任务状态" align="center" />
          <el-table-column prop="user" label="负责人" align="center" />
          <el-table-column prop="uptime" label="更新时间" align="center" />
          <el-table-column fixed="right" label="Operations" align="center">
            <template #default="scope">
              <el-button link type="primary" size="small">启动</el-button>
              <el-button link type="primary" size="small" @click="openAddDialog('task', 'edit', scope.row.id)">编辑
              </el-button>
              <el-popconfirm title="确定删除此项任务?" trigger="click" confirm-button-text="确认删除" cancel-button-text="取消"
                @confirm="handleDelete('task', scope.row.id)">
                <template #reference>
                  <el-button link type="primary" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!--添加任务弹窗-->
    <el-dialog v-model="dialogVisible" :title="titleDialog" width="30%" :before-close="handleClose">
      <span>
        <el-form :inline="false" :model="addTaskForm" ref="addTaskRuleFormRef" :rules="addTaskFormRules"
          class="addDevice-form" label-width="110px">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="addTaskForm.name" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="负责人" prop="user">
            <el-input v-model="addTaskForm.user" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="压测版本" prop="build">
            <el-select v-model="addTaskForm.build" placeholder="请选择...">
              <el-option v-for="(item, index) in state.buildData" :key="'buildData' + index" :label="item.name"
                :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="测试平台" prop="group">
            <el-select multiple clearable v-model="addTaskForm.group" placeholder="请选择..." @change="getGroupDataId">
              <el-option v-for="(item, index) in state.d_groupData" :key="'d_groupData' + index" :label="item.name"
                :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onResetTaskForm(addTaskRuleFormRef)">取消</el-button>
          <el-button type="primary" @click="onAddTaskForm(addTaskRuleFormRef)">添加</el-button>
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
  getD_group: [],  // 测试平台数据
  buildData: [], // 压测版本数据
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
  build: [{ required: true, message: "请选择压测版本", trigger: "blur" }],
  group: [
    { required: true, message: "请选择测试平台", trigger: "blur" },
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
          addTaskForm.group = item.group.toString().replace(/\[|]/g, "").split(",") // 后端返回 '[21,22]' => 前端回显 ["21","22"]
          handleSelectData(addTaskForm.group)
        }
      })
      break;
    default:
      break;
  }
}

// 处理 测试平台回显数据
const handleSelectData = (data) => {
  let arr = []
  data.forEach((item) => {
    state.d_groupData.map(it => {
      if (it.id == item) {
        arr.push(it.name)
      }
    })
  })
  addTaskForm.group = JSON.parse(JSON.stringify(arr)) // 转为proxy对象
}

// 添加任务
const onAddTaskForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      addTaskForm.group = "[" + String(addTaskForm.group) + "]"
      console.log("添加成功...", addTaskForm);
      if (titleDialog.value == '添加任务') {
        delete addTaskForm.id
        addTask(addTaskForm)
      } else {
        addTask(addTaskForm)
      }
      addTaskRuleFormRef.value.resetFields()
      dialogVisible.value = false;
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 删除
const handleDelete = (type, id) => {
  switch (type) {
    case 'task':
      deleteTask(id)
      break;
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
}

// 任务管理 添加接口
const addTask = async (params) => {
  let res = await addTaskApi(params)
  if (res.code === 1000) {
    getTask()
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

// 任务管理 编辑接口

// 任务管理 删除接口
const deleteTask = async (id) => {
  let params = {
    id: id
  }
  let res = await deleteTaskApi(params)
  if (res.code === 1000) {
    getTask()
    ElMessage({
      message: res?.msg || "删除成功",
      type: "success",
      duration: 1000,
    });
  }
}

// 分组管理 获取接口
const getD_group = async () => {
  let group = await d_groupApi()
  state.d_groupData = group.data
}

// 压测版本 获取接口
const getBuild = async () => {
  let res = await buildApi({ filetype: "apvbuild" })
  state.buildData = res.data.map(item => ({ name: item }))
}

// 分组名称 下拉选择框
const getGroupDataId = (value) => {
  addTaskForm.group = value
}

// 取消弹窗
const onResetTaskForm = (formEl: FormInstance | undefined) => {
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

</script>

<style lang="scss" scoped>
.addDevice-form {
  .el-input {
    width: 214px;
  }
}
</style>

