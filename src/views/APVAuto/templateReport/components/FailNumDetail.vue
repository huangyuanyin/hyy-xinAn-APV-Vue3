<template>
  <el-button type="primary" class="backButton" @click="router.go(-1)">返回</el-button>
  <el-table :data="detailTableData" border style="width: 100%" height="80vh" v-loading="loading">
    <el-table-column type="expand">
      <template #default="props">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="用例脚本" name="first">
            <!-- <json-viewer :value="jsonData" copyable boxed sort /> -->
            <el-input v-model="logData" :autosize="{ minRows: 2, maxRows: 12}" type="textarea"
              placeholder="Please input" />
          </el-tab-pane>
          <el-tab-pane label="脚本执行日志" name="second">
            <!-- <json-viewer :value="jsonData" copyable boxed sort /> -->
            <el-input v-model="logData" :autosize="{ minRows: 2, maxRows: 12}" type="textarea"
              placeholder="Please input" />
          </el-tab-pane>
          <el-tab-pane label="APV交互日志" name="three">
            <!-- <json-viewer :value="jsonData" copyable boxed sort /> -->
            <el-input v-model="logData" :autosize="{ minRows: 2, maxRows: 12 }" type="textarea"
              placeholder="Please input" />
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-table-column>
    <el-table-column label="case_ID" prop="case_id" />
    <el-table-column label="模块" prop="module" />
    <el-table-column label="响应时间" prop="use_time" />
    <el-table-column label="Comment" prop="comment" />
    <el-table-column label="结果" prop="result" />
  </el-table>
  <!--case脚本详情-->
  <el-dialog :model-value="isShowCaseScriptDialog" custom-class="caseScriptDialog" title="case脚本详情"
    @close="closeCaseScriptDialog">
    <div class="detailCaseScript">
      <monacoEditor v-model="caseScriptValue" :language="language" width="800px" height="500px" theme="vs-dark"
        @editor-mounted="editorMounted"></monacoEditor>
    </div>
  </el-dialog>
</template>

<script lang='ts' setup>
import { onMounted, ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import * as monaco from 'monaco-editor'
import { getReportDetailApi, getLogApi, getHistoryReportApi } from "@/api/APV/testReport.js"
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const failId = route.query.resultid ? route.query.resultid || '' : route.query.historyResultid || ''
const isHistoty = route.query.resultid ? false : true
const detailTableData = ref([])
const activeName = ref('first');
const logData = ref("20 | 400 | slb_rr_100.pl | Thursday, September 08, 2022 AM02:30:04 CST \n20 | 200 |  TIP all 10015100161000710008 \n20 | 200 |  TIP  10015:10016 \n20 | 200 |  2:30:4-172.16.26.215-ttyS0 :  user sunyb pass click1 \n20 | 200 |  2:30:5-172.16.26.215-ttyS0 : script dir /home/sunyb/sunyb.ws/src_apv/result/log//2022-09-08-02:29:22--Beta_APV_10_5_0_42.array/smoke_test//result/mnet_env//T_0001/shell-ttyS0.txt \n20 | 200 |  2:30:5-172.16.26.215-ttyS0 : Test Machine ip 172.16.26.215 \n20 | 200 |  2:30:5-172.16.26.215-ttyS0 : login user root \n20 | 200 |   \n20 | 200 |  the last prompt \n20 | 200 |  command timed-out at ../../util/cli/ca.pm line 159 \n20 | 200 |   \n 50 | 255 | Unkonw | FAIL | Unkonw Exit Code 255 \n20 | 500 | slb_rr_100.pl | Thursday, September 08, 2022 AM02:30:54 CST \nunable to update smoke test result")
const caseScriptValue = ref("20 | 400 | slb_rr_100.pl | Thursday, September 08, 2022 AM02:30:04 CST \n20 | 200 |  TIP all 10015100161000710008 \n20 | 200 |  TIP  10015:10016 \n20 | 200 |  2:30:4-172.16.26.215-ttyS0 :  user sunyb pass click1 \n20 | 200 |  2:30:5-172.16.26.215-ttyS0 : script dir /home/sunyb/sunyb.ws/src_apv/result/log//2022-09-08-02:29:22--Beta_APV_10_5_0_42.array/smoke_test//result/mnet_env//T_0001/shell-ttyS0.txt \n20 | 200 |  2:30:5-172.16.26.215-ttyS0 : Test Machine ip 172.16.26.215 \n20 | 200 |  2:30:5-172.16.26.215-ttyS0 : login user root \n20 | 200 |   \n20 | 200 |  the last prompt \n20 | 200 |  command timed-out at ../../util/cli/ca.pm line 159 \n20 | 200 |   \n 50 | 255 | Unkonw | FAIL | Unkonw Exit Code 255 \n20 | 500 | slb_rr_100.pl | Thursday, September 08, 2022 AM02:30:54 CST \nunable to update smoke test result")
const language = ref('perl')
const editorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
  console.log('editor实例加载完成', editor)
}
const isShowCaseScriptDialog = ref(false)
const loading = ref(false)

const toDetailCase = () => {
  isShowCaseScriptDialog.value = true
}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const closeCaseScriptDialog = () => {
  isShowCaseScriptDialog.value = false
}

// 测试报告失败数详情
const getReportModuleDetail = async (params) => {
  loading.value = true
  let res = await getReportDetailApi(params)
  loading.value = false
  if (res.code == 1000) {
    detailTableData.value = res.data || []
  }
}

// 历史报告失败数详情 
const getHistoryReportModuleDetail = async (params) => {
  loading.value = true
  let res = await getHistoryReportApi(params)
  loading.value = false
  if (res.code == 1000) {
    detailTableData.value = res.data || []
  }
}

onMounted(() => {
  isHistoty ? getHistoryReportModuleDetail({ id: failId, details: 'True', result: "fail" }) : getReportModuleDetail({ id: failId, details: 'True', result: "fail" })
})

</script>

<style lang="scss" scoped>
.backButton {
  position: fixed;
  top: 70px;
  right: 25px;
}
</style>