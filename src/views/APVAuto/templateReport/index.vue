<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="formInline" class="exportForm">
      <el-form-item label="">
        <el-input v-model="formInline.id" placeholder="搜索build版本、测试平台、负责人..." />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onQuery">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%; margin-top: 10px"
      @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column property="id" label="报告ID" align="center" />
      <el-table-column property="name" label="任务名称" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="toDetail(scope.row.id,'detail')">{{ scope.row.name }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column property="counts" label="用例总数" align="center" />
      <el-table-column property="fail_cases" label="失败数" show-overflow-tooltip align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="toDetail(scope.row.id,'FailNumDetail')">22</el-button>
        </template>
      </el-table-column>
      <el-table-column property="uptime" label="更新时间" width="220" align="center" />
      <el-table-column property="user" label="负责人" align="center" />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="toMark(scope.row.id)">标记</el-button>
          <el-button link type="primary" size="small" @click="toDetail(scope.row.id,'history')">历史报告</el-button>
          <!-- <el-button link type="danger" size="small">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="bottomWrap">
      <div class="buttonGroup">
        <el-button @click="toDataAnalysis()" type="primary" disabled> 批量删除 </el-button>
        <el-button @click="clearSelection()">重新选择</el-button>
      </div>
      <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
        :small="false" :background="true" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </el-card>
  <MarkDialog :markData="markData" :isShowDialog="isShowMarkDialog" v-on:closeMarkDialog="closeMarkDialog(res)" />
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, toRef, toRefs } from "vue";
import { getReportApi } from "@/api/APV/testReport.js"
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getDataApi } from "@/utils/getApi.js"
import MarkDialog from './components/MarkDialog.vue';

const router = useRouter();
const multipleTableRef = ref();
const multipleSelection = ref([]);
const tableData = ref([]);
const dialogData = ref([])
const isShowDialog = ref(false)
const isShowMarkDialog = ref(false)
const markData = ref({})
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const formInline: any = reactive({
  id: "",
  user: "",
  date1: "",
  date2: "",
  status: "",
  apv_model: "",
  ipversion: "",
  build: "",
});

const getReport = async () => {
  let res = await getReportApi()
  if (res.code === 1000) {
    tableData.value = res.data
  }
}

const onQuery = () => {
  // getDatas(filterData(formInline));
};
const onReset = () => {
  Object.keys(formInline).map((key) => {
    formInline[key] = "";
  });
};
const clearSelection = () => {
  multipleTableRef.value!.clearSelection();
};
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
const toDataAnalysis = () => {

};

// 跳转详情
const toDetail = (id, type) => {
  switch (type) {
    case 'detail': {
      router.push({
        path: "/APVAuto/reportDetail",
        query: {
          resultid: id,
        }
      })
      break;
    }
    case 'history':
      router.push({
        path: "/APVAuto/historyReport",
        query: {
          resultid: id,
        }
      })
      break;
    case 'FailNumDetail':
      router.push({
        path: "/APVAuto/failNumDetail",
        query: {
          resultid: id,
        }
      })
    default:
      break;
  }
}

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}

const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

const toMark = (id) => {
  isShowMarkDialog.value = true
}
const closeMarkDialog = (res) => {
  isShowMarkDialog.value = res
}

onMounted(() => {
  getReport()
});

</script>

<style lang="scss" scoped>
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
</style>
