<template>
  <el-card class="serialServer-wrap" shadow="never">
    <div class="search-wrap">
      <div>
        <el-button type="primary" @click="openAddDialog('add', null)" style="margin-bottom: 20px"> 添加 </el-button>
      </div>
      <div class="ignore-select-wrap">
        <el-select size="large" clearable v-model="searchForm.status" placeholder="请选择硬件设备型号..." @change="searchDevice">
          <el-option v-for="(item, index) in statusOptions" :key="'buildData' + index" :label="item.label" :value="item.value" />
        </el-select>
      </div>
    </div>
    <el-table :data="serialServerData" stripe>
      <el-table-column prop="ip" label="服务器IP" align="center" width="200" />
      <el-table-column prop="name" label="端口" align="center" width="180" />
      <el-table-column prop="user" label="密码" align="center" />
      <el-table-column prop="uptime" label="硬件设备型号" align="center" width="200" />
      <el-table-column fixed="right" label="操作" align="center" width="220">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="openAddDialog('edit', scope.row.id)">编辑 </el-button>
          <el-popconfirm title="确定删除这个串口服务器?" trigger="click" confirm-button-text="确认删除" cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button link type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="serialServerCurrentPage"
      v-model:page-size="serialServerPageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, prev, pager, next, jumper"
      :total="serialServerTotal"
      @size-change="handleSerialServerSizeChange"
      @current-change="handleSerialServerCurrentChange"
    />
  </el-card>

  <!-- 弹窗-->
  <el-dialog v-model="serialServerDialog" :title="titleDialog" width="35%" @close="handleClose">
    <span>
      <el-form :inline="false" :model="addSerialServerForm" ref="addSerialServerRuleFormRef" :rules="addSerialServerFormRules" class="serialServer-form" label-width="150px">
        <el-form-item label="物理机IP" prop="ip">
          <el-input v-model="addSerialServerForm.ip" placeholder="请输入..." />
        </el-form-item>
        <el-form-item label="端口" prop="name">
          <el-input v-model="addSerialServerForm.name" placeholder="请输入..." />
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input v-model="addSerialServerForm.pass" placeholder="请输入..." />
        </el-form-item>
        <el-form-item label="硬件设备型号" prop="uptime">
          <el-input v-model="addSerialServerForm.uptime" placeholder="请输入..." />
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onReseSerialServerRuleForm(addSerialServerRuleFormRef)">取消</el-button>
        <el-button type="primary" @click="onAddSerialServerForm(addSerialServerRuleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'

const serialServerDialog = ref(false)
const titleDialog = ref('')
const serialServerData = ref([
  {
    ip: '10.210.23.23',
    name: '22',
    user: '123456',
    uptime: 'xxx-YUIO'
  },
  {
    ip: '10.210.23.23',
    name: '22',
    user: '123456',
    uptime: 'xxx-YUIO'
  },
  {
    ip: '10.210.23.23',
    name: '22',
    user: '123456',
    uptime: 'xxx-YUIO'
  },
  {
    ip: '10.210.23.23',
    name: '22',
    user: '123456',
    uptime: 'xxx-YUIO'
  },
  {
    ip: '10.210.23.23',
    name: '22',
    user: '123456',
    uptime: 'xxx-YUIO'
  },
  {
    ip: '10.210.23.23',
    name: '22',
    user: '123456',
    uptime: 'xxx-YUIO'
  },
  {
    ip: '10.210.23.23',
    name: '22',
    user: '123456',
    uptime: 'xxx-YUIO'
  },
  {
    ip: '10.210.23.23',
    name: '22',
    user: '123456',
    uptime: 'xxx-YUIO'
  },
  {
    ip: '10.210.23.23',
    name: '22',
    user: '123456',
    uptime: 'xxx-YUIO'
  },
  {
    ip: '10.210.23.23',
    name: '22',
    user: '123456',
    uptime: 'xxx-YUIO'
  }
])
const searchForm = ref({
  status: ''
})
const addSerialServerForm = ref({
  ip: '',
  name: '',
  pass: '',
  uptime: ''
})
const addSerialServerRuleFormRef = ref<FormInstance>()
const addSerialServerFormRules = reactive<FormRules>({
  ip: [{ required: true, message: '平台名称不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '平台名称不能为空', trigger: 'blur' }],
  pass: [{ required: true, message: '支持测试版本不能为空', trigger: 'blur' }],
  uptime: [{ required: true, message: '支持测试版本不能为空', trigger: 'blur' }]
})
const statusOptions = [
  {
    value: '1',
    label: '型号1'
  },
  {
    value: '2',
    label: '型号2'
  }
]

const searchDevice = (val) => {
  searchForm.value.status = val
}

const serialServerCurrentPage = ref(1)
const serialServerPageSize = ref(10)
const serialServerTotal = ref(0)

const openAddDialog = (type, id) => {
  titleDialog.value = '新增'
  serialServerDialog.value = true
}

const handleClose = () => {
  addSerialServerRuleFormRef.value.resetFields()
  serialServerDialog.value = false
}

const handleDelete = (id) => {
  console.log(id)
}

const onReseSerialServerRuleForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  serialServerDialog.value = false
}

const onAddSerialServerForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
    }
  })
}

const handleSerialServerSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleSerialServerCurrentChange = (val: number) => {
  serialServerCurrentPage.value = val
}
</script>

<style lang="scss" scoped>
.serialServer-wrap {
  margin-top: 10px;
  .search-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .el-pagination {
    display: flex;
    justify-content: end;
    margin-top: 25px;
  }
}
</style>
