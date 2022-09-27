<template>
  <div class="performanceManagement">
    <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
      <!-- <el-tab-pane label="任务管理" name="taskManagement"> -->
      <el-card class="box-card" shadow="never">
        <el-button type="primary" @click="openAddDialog('task', 'add', null)" style="margin-bottom: 20px">
          添加任务
        </el-button>
        <el-table :data="state.tableData" stripe style="width: 100%" v-loading="tableLoading">
          <el-table-column prop="name" label="任务名称" align="center" width="200" />
          <el-table-column prop="build" label="build版本" align="center" width="300" />
          <el-table-column prop="groupAfter" label="测试平台" align="center" width="400">
            <template #default="scope">
              <el-tag class="tagType" v-for="item,index in scope.row.groupAfter" :key="'groupAfter'+index">
                {{item.label}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="example" label="用例数" align="center" width="120" />
          <el-table-column prop="state" label="任务状态" align="center" width="120">
            <template #default="scope">
              <div class="stateStyle" v-if="scope.row.state === 'stop'">
                <div class="status-point" style=" background-color:#696969"></div>
                <span style="color:#696969">已停止</span>
              </div>
              <div class="stateStyle fail" v-if="scope.row.state === 'fail'">
                <div class="status-point" style=" background-color:#f56c6c"></div>
                <span style="color:#f56c6c">已失败</span>
              </div>
              <div class="stateStyle hhh" v-if="scope.row.state === 'running'">
                <div class="status-point hhh" style=" background-color:#67C23A"></div>
                <span style="color:#67C23A">运行中</span>
              </div>
              <div class="stateStyle" v-if="scope.row.state === 'create'">
                <div class="status-point" style=" background-color:#E6A23C"></div>
                <span style="color:#E6A23C">已创建</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="user" label="负责人" align="center" width="120" />
          <el-table-column prop="uptimeAfter" label="更新时间" align="center" width="186" />
          <el-table-column fixed="right" label="操作" align="center" width="200">
            <template #default="scope">
              <el-popover placement="bottom" :width="10" trigger="click" popper-class="morePopover">
                <template #reference>
                  <el-button link type="primary" size="small">启停</el-button>
                </template>
                <div class="moreButton">
                  <el-button link type="primary" size="small" v-if="scope.row.state === 'running'"
                    @click="changeTaskStatus('stop',scope.row.id)">
                    任务终止
                  </el-button>
                  <el-button link type="primary" size="small" v-else @click="changeTaskStatus('start',scope.row.id)">
                    任务启动
                  </el-button>
                </div>
              </el-popover>
              <el-button link type="primary" size="small" @click="openAddDialog('task', 'edit', scope.row)">
                编辑
              </el-button>
              <el-popconfirm title="确定删除此项任务?" trigger="click" confirm-button-text="确认删除" cancel-button-text="取消"
                @confirm="handleDelete('task', scope.row)">
                <template #reference>
                  <el-button link type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
              <el-popover placement="bottom" :width="10" trigger="hover" popper-class="morePopover">
                <template #reference>
                  <el-button link type="info" size="small">更多</el-button>
                </template>
                <div class="moreButton">
                  <el-button link type="primary" size="small" @click="taskProgress(scope.row.id)">任务进度</el-button>
                  <el-button link type="primary" size="small" @click="openTestPlatformDialog(scope.row)">测试平台
                  </el-button>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- </el-tab-pane> -->
    </el-tabs>
    <!--添加任务弹窗-->
    <el-dialog v-model="dialogVisible" :title="titleDialog" width="30%" :before-close="handleClose">
      <span>
        <el-form :inline="false" :model="addTaskForm" ref="addTaskRuleFormRef" :rules="addTaskFormRules"
          class="addDevice-form" label-width="110px">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="addTaskForm.name" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="build版本" prop="build">
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
          <el-form-item label="负责人" prop="user">
            <el-input v-model="addTaskForm.user" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="用例模块" prop="userModule">
            <el-select multiple clearable v-model="addTaskForm.userModule" placeholder="暂不支持..."
              @change="getGroupDataId" disabled>
              <el-option v-for="(item, index) in state.d_groupData" :key="'d_groupData' + index" :label="item.name"
                :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onResetTaskForm(addTaskRuleFormRef)">取消</el-button>
          <el-button type="primary" @click="onAddTaskForm(addTaskRuleFormRef)">{{buttonText}}</el-button>
        </span>
      </template>
    </el-dialog>
    <!--任务进度弹窗-->
    <el-dialog v-model="taskProgressDialog" title="任务进度" width="50%" :before-close="handleClose">
      <div class="dashboard">
        <el-progress type="dashboard" :percentage="percentage2" :color="colors" :width=200 />
        <el-progress type="dashboard" :percentage="percentage2" :color="colors" :width=200 />
      </div>
      <el-input v-model="textarea" :rows="10" type="textarea" placeholder="暂无log日志..." />
    </el-dialog>
    <!--平台弹窗-->
    <el-dialog v-model="platformDialog" title="修改测试平台" custom-class="platformDialog" width="50%"
      :before-close="handleTestPlatClose">
      <div class="tagList">
        <span class="title">已有测试平台：</span>
        <el-tag v-if="testPlatList.length == 0" class="ml-2" type="info">暂无测试平台</el-tag>
        <div>
          <el-tag class="tagType" v-for="item,index in testPlatList" :key="'testPlatList'+index" closable
            @close="handleCloseTag(item,item.id)">
            {{item.label}}
          </el-tag>
        </div>
      </div>
      <el-form :inline="false" :model="addTestPlatForm" ref="addTestPlatFormRef" class="addDevice-form"
        label-width="130px">
        <el-form-item label="添加测试平台：">
          <el-select clearable v-model="addTestPlatForm.group" placeholder="请选择要添加的测试平台..." @change="getTestPlatDataId">
            <el-option v-for="(item, index) in state.d_groupDataAfter" :key="'d_groupDataAfter' + index"
              :label="item.name" :value="item.id" :disabled="item.disabled" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onResetTaskForm(addTestPlatFormRef)">取消</el-button>
          <el-button type="primary" @click="onAddTestPlatForm(addTestPlatFormRef)">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, toRefs, nextTick } from "vue";
import { ref, reactive } from "vue";
import type { TabsPaneContext } from "element-plus";
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from "element-plus";
import { ElInput } from 'element-plus'
import { useRouter } from "vue-router";
import { deviceApi, addDeviceApi, editDeviceApi, deleteDeviceApi, d_typeApi, addD_typeApi, editD_typeApi, deleteD_typeApi, d_groupApi, addD_groupApi, editD_groupApi, deleteD_groupApi } from '@/api/APV/index.js'
import { taskApi, addTaskApi, editTaskApi, deleteTaskApi, taskRunApi, taskStatusApi, deleteTestPlatApi, putTestPlatApi } from '@/api/APV/taskManagement.js'
import { buildApi } from '@/api/APV/buildManagement.js'
import { utc2beijing } from '@/utils/util.js'

const activeName = ref("taskManagement");
const dialogVisible = ref(false);
const deviceTypeDialogVisible = ref(false)
const groupDialogVisible = ref(false)
const taskProgressDialog = ref(false)
const platformDialog = ref(false)
const taskStatus = ref(false)
const tableLoading = ref(false)
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()
const percentage2 = ref(0)
const textarea = ref('')
const testPlatList = ref([]) // 已有测试平台集合List
const buttonText = ref("添加")

const colors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]

const state: any = reactive({
  tableData: [],  // 任务管理数据
  getD_group: [],  // 测试平台数据
  buildData: [], // 压测版本数据
  d_groupDataAfter: []
})

// 添加测试平台数据
const addTestPlatForm = reactive({
  id: null,
  group: null
})
const addTestPlatFormRef = ref<FormInstance>();

const titleDialog = ref("")
const addTaskForm = reactive({
  id: "",
  name: "",
  user: "",
  build: "",
  group: [],
  userModule: []
});
const addTaskRuleFormRef = ref<FormInstance>();
const addTaskFormRules = reactive<FormRules>({
  name: [
    { required: true, message: "任务名称不能为空", trigger: "blur" },
  ],
  user: [
    { required: true, message: "负责人不能为空", trigger: "blur" },
  ],
  build: [{ required: true, message: "请选择测build版本", trigger: "blur" }],
  group: [
    { required: true, message: "请选择测试平台", trigger: "blur" },
  ],
});

// 切换Tab
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

// 打开添加/编辑弹窗
const openAddDialog = (type, operation, data) => {
  switch (type) {
    case 'task':
      operation == 'add' ? (titleDialog.value = '添加任务') && (buttonText.value = '添加') : (titleDialog.value = '编辑任务') && (buttonText.value = '确定')
      if (data && data.state === 'running') {
        return ElMessage({
          message: "任务运行中，禁止编辑！",
          type: "warning",
          duration: 1000,
        });
      }
      nextTick(() => {
        getOneData(type, data?.id)
      })
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
        arr.push(it.id)
      }
    })
  })
  addTaskForm.group = arr
  console.log("测试平台回显数据", addTaskForm.group);
}

// 添加任务
const onAddTaskForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      delete addTaskForm.userModule
      // addTaskForm.group = "[" + String(addTaskForm.group) + "]"
      if (titleDialog.value == '添加任务') {
        delete addTaskForm.id
        console.log("添加成功...", addTaskForm.group);
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
const handleDelete = (type, data) => {
  switch (type) {
    case 'task':
      if (data.state === 'running') {
        return ElMessage({
          message: "任务运行中，禁止删除！",
          type: "warning",
          duration: 1000,
        });
      }
      deleteTask(data.id)
      break;
    default:
      break;
  }
}

onMounted(async () => {
  await getD_group()
  await getTask()
  await getBuild()
  await handle()
})

// 处理数据 - 表格 测试平台/更新时间 字段回显
const handle = () => {
  state.tableData.map((item, index) => {
    item.uptimeAfter = utc2beijing(item.uptime) // '2022-09-16T17:44:08Z' => '2022/9/16 16:43:40'
    // let groupData = item.group.replace(/\[|]/g, '').split(",") // 将 '[21,22,23]' => [21,22,23]
    item.groupAfter = []
    item.group.map((it) => {
      state.d_groupData.forEach((d_item, index) => {
        if (it == d_item.id) {
          item.groupAfter.push({
            value: d_item.id,
            label: d_item.name
          })
        }
      })
    })
  })
  tableLoading.value = false
}

// 任务管理 获取接口
const getTask = async () => {
  tableLoading.value = true
  let res = await taskApi()
  if (res.code == 1000) {
    state.tableData = res.data
  } else {
    ElMessage({
      message: res.msg || "请求失败",
      type: "error",
      duration: 2000,
    });
  }
  console.log("任务管理...", state.tableData);
}

// 任务管理 添加接口
const addTask = async (params) => {
  let res = await addTaskApi(params)
  if (res.code === 1000) {
    await getTask()
    await handle()
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

// 任务管理 删除接口
const deleteTask = async (id) => {
  let params = {
    id: id
  }
  let res = await deleteTaskApi(params)
  if (res.code === 1000) {
    await getTask()
    await handle()
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
  console.log("选择...", value);
  addTaskForm.group = value
}

// 测试平台 下拉选择框
const getTestPlatDataId = (value) => {
  addTestPlatForm.group = value
}

// 打开添加测试平台弹窗
const openTestPlatformDialog = (data) => {
  if (data.state === 'fail') {
    return ElMessage({
      message: "任务已失败，禁止修改测试平台！",
      type: "warning",
      duration: 1000,
    });
  }
  console.log("state.d_groupData", state.d_groupData);
  let group = []
  testPlatList.value = []
  addTestPlatForm.id = data.id
  state.tableData.map(item => {
    if (item.id === data.id) {
      // group = item.group.toString().replace(/\[|]/g, "").split(",") // 后端返回 '[21,22]' => 前端回显 ["21","22"]
      group = item.group
    }
  })
  state.d_groupDataAfter = JSON.parse(JSON.stringify(state.d_groupData))
  group.map((item) => {
    state.d_groupDataAfter.map(it => {
      if (it.id == item) {
        it.disabled = true
        testPlatList.value.push({
          label: it.name,
          id: it.id
        })
      }
    })
  })
  platformDialog.value = true
}

// 添加测试平台
const onAddTestPlatForm = async (formEl: FormInstance | undefined) => {
  await formEl.validate(async (valid, fields) => {
    if (addTestPlatForm.group != '') {
      const params = {
        id: addTestPlatForm.id,
        group: addTestPlatForm.group
      }
      putTestPlat(params)
    } else {
      platformDialog.value = false
      console.log("error submit!", fields);
    }
  });
}

// 添加测试平台 api
const putTestPlat = async (params) => {
  let res = await putTestPlatApi(params)
  if (res) {

  } else {
    ElMessage({
      message: res?.msg || "请求失败",
      type: "error",
      duration: 2500,
    });
  }
}

// 删除测试环境平台
const handleCloseTag = (data, id) => {
  ElMessageBox.confirm(
    '确认删除该测试平台?',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      const params = {
        id,
        group: data.id
      }
      deleteTestPlat(params)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}

// 删除测试环境平台 api
const deleteTestPlat = async (params) => {
  let res = await deleteTestPlatApi(params)
  if (res) {

  } else {
    ElMessage({
      message: res?.msg || "请求失败",
      type: "error",
      duration: 2500,
    });
  }
}

// 任务进度
const taskProgress = (id) => {
  taskProgressDialog.value = true
  textarea.value = ''
  setInterval(() => {
    percentage2.value = (percentage2.value % 100) + 10
  }, 500)
  setTimeout(() => {
    getTaskRun(id)
  }, 5000)
}

// 任务启动/终止
const changeTaskStatus = (val, id) => {
  const params = {
    id,
    state: val
  }
  getTaskStatus(params)
}

// 任务start or stop api
const getTaskStatus = async (params) => {
  let res = await taskStatusApi(params)
  console.log("aaa", res);
  if (res.code === 1000) {
    await getTask()
    await handle()
    ElMessage({
      message: res?.msg || "任务已启动",
      type: "success",
      duration: 1500,
    });
  } else {
    ElMessage({
      message: res?.msg || "请求失败",
      type: "error",
      duration: 2500,
    });
  }
}

// 任务进度 接口
const getTaskRun = async (id) => {
  let res = await taskRunApi({ id })
  if (res.code === 1000) {
    textarea.value += res.data.log || ''
  } else {
    ElMessage({
      message: res?.msg || "请求失败",
      type: "error",
      duration: 2500,
    });
  }
}

// 取消弹窗
const onResetTaskForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  dialogVisible.value = false;
  deviceTypeDialogVisible.value = false;
  groupDialogVisible.value = false;
  platformDialog.value = false;
  addTestPlatForm.group = ''
};

// 关闭弹窗
const handleClose = (done: () => void) => {
  dialogVisible.value = false;
  deviceTypeDialogVisible.value = false
  groupDialogVisible.value = false
  taskProgressDialog.value = false
  platformDialog.value = false
  addTaskRuleFormRef.value.resetFields()
};

// 关闭测试平台弹窗
const handleTestPlatClose = (done: () => void) => {
  platformDialog.value = false
  addTestPlatForm.group = ''
  addTestPlatFormRef.value.resetFields()
};

</script>

<style lang="scss" scoped>
.status-point {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 3px;
}

.addDevice-form {

  .el-input,
  .el-select {
    width: 300px;
  }
}

.moreButton {
  display: flex;
  flex-direction: column;
}

.tagType {
  margin: 2px;
}

.dashboard {
  display: flex;
  justify-content: space-around;
}

.platformDialog {

  .tagList {
    display: flex;
    align-items: center;
    height: 80px;
    font-size: 14px;
    margin-left: 20px;


    .title {
      width: 98px;
      margin-right: 12px;
    }

    .tagType {
      margin-right: 6px;
    }

    .el-input {
      width: 100px;
    }

  }
}

.hhh {
  // border-radius: 100%;
  webkit-animation: breathe 1500ms ease infinite;
  -moz-animation: breathe 1500ms ease infinite;
  -o-animation: breathe 1500ms ease infinite;
  animation: breathe 1500ms ease infinite;
}

@-webkit-keyframes breathe {
  0% {
    opacity: .2;
    box-shadow: 0 1px 10px rgba(255, 255, 255, 0.1)
  }

  100% {
    opacity: 1;
    box-shadow: 0 1px 40px rgba(255, 107, 132, 0.5)
  }

  50% {
    opacity: 1;
    box-shadow: 0 1px 80px #ff6b84
  }
}

@-moz-keyframes breathe {
  0% {
    opacity: .2;
    box-shadow: 0 1px 10px rgba(255, 255, 255, 0.1)
  }

  100% {
    opacity: 1;
    box-shadow: 0 1px 40px rgba(255, 107, 132, 0.5)
  }

  50% {
    opacity: 1;
    box-shadow: 0 1px 80px #ff6b84
  }
}

@-o-keyframes breathe {
  0% {
    opacity: .2;
    box-shadow: 0 1px 10px rgba(255, 255, 255, 0.1)
  }

  100% {
    opacity: 1;
    box-shadow: 0 1px 40px rgba(255, 107, 132, 0.5)
  }

  50% {
    opacity: 1;
    box-shadow: 0 1px 80px #ff6b84
  }
}

@keyframes breathe {
  0% {
    opacity: .2;
    box-shadow: 0 1px 10px rgba(255, 255, 255, 0.1)
  }

  100% {
    opacity: 1;
    box-shadow: 0 1px 40px rgba(255, 107, 132, 0.5)
  }

  50% {
    opacity: 1;
    box-shadow: 0 1px 80px #ff6b84
  }
}

:deep(.el-table .cell) {
  padding: 0px;
}

:deep(.el-table td.el-table__cell) {
  padding: 20px 0px;
}
</style>

<style lang="scss">
.morePopover {
  min-width: 0px !important;
  width: auto !important;

  .el-button {
    margin-bottom: 5px;

    &:last-child {
      margin-bottom: 0px;
      margin-left: 0px;
    }
  }
}

.platformDialog {
  .el-dialog__body {
    padding-top: 0px !important;
  }

}
</style>

