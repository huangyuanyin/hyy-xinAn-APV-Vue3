<template>
  <div class="performanceManagement">
    <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
      <el-tab-pane label="设备管理" name="instrumentManagement">
        <el-button type="primary" @click="openAddDialog('device')" style="margin-bottom: 20px">添加设备</el-button>
        <el-table :data="state.tableData">
          <el-table-column prop="uname" label="设备名称" align="center" />
          <el-table-column prop="ip" label="ip" align="center" />
          <el-table-column prop="tid__name" label="设备类型" align="center" />
          <el-table-column prop="gid__name" label="gid__name" align="center" />
          <el-table-column fixed="right" label="Operations" align="center">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleDedit">编辑</el-button>
              <el-button link type="primary" size="small" @click="handleDelete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="设备类型" name="third">
        <el-button type="primary" @click="openAddDialog('deviceType')" style="margin-bottom: 20px">添加设备类型</el-button>
        <el-table :data="state.d_typeData" border>
          <el-table-column prop="name" label="设备类型" align="center" />
          <el-table-column fixed="right" label="Operations" align="center">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleDedit">编辑</el-button>
              <el-button link type="primary" size="small" @click="handleDelete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="分组管理" name="second">
        <el-button type="primary" @click="openAddDialog('group')" style="margin-bottom: 20px">添加分组</el-button>
        <el-table :data="state.d_groupData">
          <el-table-column prop="name" label="分组名称" align="center" />
          <el-table-column prop="buildip" label="ip" align="center" />
          <el-table-column prop="status" label="状态" align="center" />
          <el-table-column fixed="right" label="Operations" align="center">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleDedit">编辑</el-button>
              <el-button link type="primary" size="small" @click="handleDelete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="dialogVisible" title="添加设备" width="25%" :before-close="handleClose">
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
    <el-dialog v-model="deviceTypeDialogVisible" title="添加设备类型" width="25%" :before-close="handleClose">
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

    <!-- 添加分组管理弹窗-->
    <el-dialog v-model="groupDialogVisible" title="添加分组" width="25%" :before-close="handleClose">
      <span>
        <el-form :inline="false" :model="addGroupForm" ref="addGroupRuleFormRef" :rules="addGroupFormRules"
          class="addDevice-form" label-width="110px">
          <el-form-item label="分组名称" prop="name">
            <el-input v-model="addGroupForm.name" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="buildip" prop="buildip">
            <el-input v-model="addGroupForm.buildip" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="addGroupForm.status" placeholder="请选择...">
              <el-option label="空闲" value="false" />
              <el-option label="使用中" value="true" />
            </el-select>
          </el-form-item>
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
import type { FormInstance, FormRules } from "element-plus";
import { useRouter } from "vue-router";
import { deviceApi, d_groupApi, d_typeApi } from '@/api/APV/index.js'

const router = useRouter()
const activeName = ref("instrumentManagement");
const dialogVisible = ref(false);
const deviceTypeDialogVisible = ref(false)
const groupDialogVisible = ref(false)
const state: any = reactive({
  tableData: [],
  d_groupData: [], // 分组管理数据
  d_typeData: [], // 设备类型数据
})
const addDeviceForm = reactive({
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
const addDeviceTypeForm = reactive({
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
  name: "",
  buildip: "",
  status: "",
})
const addGroupRuleFormRef = ref<FormInstance>();
const addGroupFormRules = reactive<FormRules>({
  name: [
    { required: true, message: "设备类型名称不能为空", trigger: "blur" },
  ],
  buildip: [
    { required: true, message: "buildip不能为空", trigger: "blur" },
  ],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
});

// 切换Tab
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

// 打开添加设备弹窗
const openAddDialog = (type) => {
  switch (type) {
    case 'device':
      dialogVisible.value = true;
      break;
    case 'deviceType':
      deviceTypeDialogVisible.value = true;
      break;
    case 'group':
      groupDialogVisible.value = true;
      break;
    default:
      break;
  }
}

// 添加设备
const onAddDeviceForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("添加成功...", addDeviceForm);
      dialogVisible.value = false;
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 添加设备类型
const onAddDeviceTypeForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("添加成功...", addDeviceTypeForm);
      deviceTypeDialogVisible.value = false;
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 添加分组管理 
const onAddGroupForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("添加成功...", addGroupForm);
      groupDialogVisible.value = false;
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

// 编辑设备
const handleDedit = () => {
  console.log("编辑")
}

// 删除设备
const handleDelete = () => {
  console.log('删除')
}

onMounted(() => {
  getDeviceApi()
  getD_groupApi()
  getD_typeApi()
})

// 分组管理 接口
const getD_groupApi = async () => {
  let group = await d_groupApi()
  state.d_groupData = group.data
}

// 设备管理 接口
const getDeviceApi = async () => {
  let res = await deviceApi()
  state.tableData = res.data
  console.log("设备管理...", state.tableData);
}

// 设备类型 接口
const getD_typeApi = async () => {
  let res = await d_typeApi()
  state.d_typeData = res.data
  console.log("设备类型...", state.d_typeData);
}

</script>

<style lang="scss" scoped>
.addDevice-form {
  .el-input {
    width: 214px;
  }
}
</style>

