<template>
  <el-card>
    <el-form :inline="true" :model="formInline" class="exportForm">
      <el-form-item label="">
        <el-input v-model="formInline.id" placeholder="搜索任务名称、报告ID、负责人..." />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onQuery">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%; margin-top: 10px"
      @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column property="id" label="报告ID" width="120" align="center" />
      <el-table-column property="name" label="任务名称" width="200" align="center">
        <template #default="scope">
          <el-icon color="#409eff" style="margin-right:3px">
            <Document />
          </el-icon>
          <el-button link type="primary" size="small" @click="toDetail(scope.row.id)">{{ scope.row.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column property="status" label="用例总数" width="120" align="center" />
      <el-table-column property="apv_model" label="成功数" width="200" align="center" />
      <el-table-column property="errorNumber" label="失败数" show-overflow-tooltip align="center" />
      <el-table-column property="ipversion" label="创建时间" width="120" align="center" />
      <el-table-column property="user" label="负责人" align="center" />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" disabled>历史报告</el-button>
          <el-button link type="danger" size="small">移除</el-button>
          <!-- <el-button link type=" primary" size="small" @click="openReportDialog(scope.row.id)">生成报告</el-button>
          <el-upload :action="upload.url" :on-success="onSuccess" :on-error="onError" :headers="upload.header"
            :beforeUpload="beforeUpload">
            <el-button type="primary" link size="small">上传文件</el-button>
          </el-upload> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="bottomWrap">
      <div class="buttonGroup">
        <el-button @click="toDataAnalysis()" type="primary"> 批量删除 </el-button>
        <el-button @click="clearSelection()">重新选择</el-button>
      </div>
      <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
        :small="false" :background="true" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </el-card>
  <DataTemplateDialog :dialogData="dialogData" :isShowDialog="isShowDialog" @closeDialog="closeDialog" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, toRef, toRefs } from "vue";
import { datas } from "@/api/POC/index.js";
import { filterData } from "@/utils/util.js";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getDataApi } from "@/utils/getApi.js"
import DataTemplateDialog from './components/dataTemplateDialog.vue';
import {
  Document,
} from "@element-plus/icons-vue";
export default defineComponent({
  components: {
    DataTemplateDialog, Document
  },
  setup() {
    const state = reactive({
      upload: {
        url: ``,
        header: {
          token: ""
        },
        resData: {}
      },
    })
    const router = useRouter();
    const multipleTableRef = ref();
    const multipleSelection = ref([]);
    const tableData = ref([
      { id: "3", name: "平台测试", status: "120", apv_model: "22", errorNumber: "33", ipversion: "2022-9-22", user: "hyy" },
      { id: "3", name: "平台测试", status: "120", apv_model: "22", errorNumber: "33", ipversion: "2022-9-22", user: "hyy" },
      { id: "3", name: "平台测试", status: "120", apv_model: "22", errorNumber: "33", ipversion: "2022-9-22", user: "hyy" },
      { id: "3", name: "平台测试", status: "120", apv_model: "22", errorNumber: "33", ipversion: "2022-9-22", user: "hyy" },
      { id: "3", name: "平台测试", status: "120", apv_model: "22", errorNumber: "33", ipversion: "2022-9-22", user: "hyy" },
      { id: "3", name: "平台测试", status: "120", apv_model: "22", errorNumber: "33", ipversion: "2022-9-22", user: "hyy" },
      { id: "3", name: "平台测试", status: "120", apv_model: "22", errorNumber: "33", ipversion: "2022-9-22", user: "hyy" },
    ]);
    const dialogData = ref([])
    const isShowDialog = ref(false)
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
    const onQuery = () => {
      getDatas(filterData(formInline));
    };
    const onReset = () => {
      Object.keys(formInline).map((key) => {
        formInline[key] = "";
      });
    };
    const clearSelection = () => {
      // if (rows) {
      //   rows.forEach((row) => {
      //     // TODO: improvement typing when refactor table
      //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //     multipleTableRef.value!.toggleRowSelection(row);
      //     router.push("/POCTest/dataAnalysis");
      //   });
      // } else {
      //   multipleTableRef.value!.clearSelection();
      // }
      multipleTableRef.value!.clearSelection();
    };
    const handleSelectionChange = (val) => {
      multipleSelection.value = val;
      console.log("选中的...", multipleSelection.value);
    };
    // 数据分析
    const toDataAnalysis = () => {
      if (multipleSelection.value.length < 2) {
        ElMessage({
          message: "请至少选择两组数据进入数据对比....",
          type: "warning",
        });
        return;
      }
      sessionStorage.setItem(
        "dataList",
        JSON.stringify(multipleSelection.value)
      );
      router.push("/POCTest/dataAnalysis");
    };
    // 生成报告
    const openReportDialog = (id) => {
      isShowDialog.value = true
      getDataApi(id).then(res => {
        dialogData.value = res[0];
      })
    }
    const closeDialog = () => {
      isShowDialog.value = false
    }
    // 报告详情
    const toDetail = (id) => {
      router.push({
        path: "/APVAuto/reportDetail",
        query: {
          resultid: id
        }
      })
    }

    const onSuccess = () => {

    }

    const onError = () => {
      ElMessage({
        message: "上传失败!",
        type: "error",
      });
    }
    const beforeUpload = (file) => {
      const sizeLimit = file.size / 1024 / 1024 > 10
      if (sizeLimit) {
        ElMessage({
          message: "上传文件大小不能超过 10MB!",
          type: "warning",
        });
      }
      const fileFamart = file.name.split('.')[file.name.split('.').length - 1];
      console.log("上传...", fileFamart);
      if (fileFamart !== 'zip' || fileFamart !== 'rar') {
        ElMessage({
          message: "必须上传zip/rar格式的文件!",
          type: "warning",
        });
      }
      return !sizeLimit && (fileFamart === 'zip' || fileFamart === 'rar')
    }

    const handleSizeChange = (val: number) => {
      console.log(`${val} items per page`)
    }

    const handleCurrentChange = (val: number) => {
      console.log(`current page: ${val}`)
    }

    // 列表数据
    const getDatas = async (params) => {
      loading.value = true
      const res = await datas(params);
      if (res.code == 1000) {
        setTimeout(() => {
          loading.value = false
        }, 500);
        tableData.value = res.data;
        total.value = res.total
      } else {
        setTimeout(() => {
          loading.value = false
        }, 500);
      }
    };
    onMounted(() => {
      // getDatas(filterData(formInline));
    });
    return {
      ...toRefs(state),
      total,
      currentPage,
      pageSize,
      dialogData,
      isShowDialog,
      router,
      formInline,
      onQuery,
      onReset,
      multipleTableRef,
      multipleSelection,
      tableData,
      clearSelection,
      handleSelectionChange,
      toDataAnalysis,
      getDatas,
      openReportDialog,
      closeDialog,
      toDetail,
      onSuccess,
      onError,
      beforeUpload,
      loading,
      handleSizeChange,
      handleCurrentChange
    };
  },
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
