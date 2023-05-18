<template>
  <div>
    <el-card class="report-card">
      <div>
        <!-- <div class="ribbon">
          <span>打的标记</span>
        </div> -->
        <div class="top">
          <span>报告信息</span>
          <div>
            <el-button type="primary" @click="toBack">返回</el-button>
            <el-button type="primary" disabled>导出报告</el-button>
          </div>
        </div>
        <div class="content">
          <div class="content-item" v-for="(item, index) in contentItemList" :key="'item' + index">
            <span class="itemName">{{ item.name }}：</span>
            <span class="itemValue">{{ item.value }}</span>
          </div>
        </div>
        <div v-if="isShow" id="overview"></div>
      </div>
    </el-card>
  </div>

  <el-card class="detail-card">
    <!-- <el-tabs type="border-card">
      <el-tab-pane label="概览"> -->
    <el-table
      :data="modeTableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
      v-if="showModelTable"
      border
      style="width: 100%"
      height="47vh"
      @expand-change="getLog"
      :expand-row-keys="expands"
      :row-key="getRowKeys"
    >
      <!-- <el-table-column label="case_ID" prop="case_id" /> -->
      <el-table-column label="模块名" prop="Module" />
      <el-table-column label="Pass_Num" prop="Pass_Num">
        <template #default="scope">
          <el-button link :disabled="scope.row.Pass_Num === 0" type="primary" size="" @click="toSeeDeatil(scope.row, 'pass')">{{ scope.row.Pass_Num }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Fail_Num" prop="Fail_Num">
        <template #default="scope">
          <el-button link :disabled="scope.row.Fail_Num === 0" type="danger" size="" @click="toSeeDeatil(scope.row, 'fail')">{{ scope.row.Fail_Num }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Known_Issue" prop="Known_Issue">
        <template #default="scope">
          <el-button link :disabled="scope.row.Known_Issue === 0" type="warning" size="" @click="toSeeDeatil(scope.row, 'fail_issue')">{{ scope.row.Known_Issue }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Times(min)" prop="Times(min)" />
      <el-table-column label="通过率" prop="Pass_Rate(%)" />
      <!-- <el-table-column label="操作" fixed="right">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="toSeeLog(scope.row)">查看</el-button>
      </template>
    </el-table-column> -->
    </el-table>
    <el-pagination
      class="pagination"
      v-if="showModelTable"
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :small="true"
      :background="false"
      layout="total, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- </el-tab-pane>
      <el-tab-pane label="详情" class="detailsPane">
        <el-form :inline="true" :model="formInline" class="detailForm">
          <el-form-item label="">
            <el-select clearable v-model="status" class="m-2" placeholder="选择状态类型" size="default" @change="selectSearch(1)">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select clearable v-model="casValue" collapse-tags collapse-tags-tooltip placeholder="选择模块" style="width: 240px" @change="selectSearch(1)">
              <el-option v-for="item in caseOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-table :data="detailTableData" border style="width: 100%" height="45vh" @expand-change="getLog" :expand-row-keys="expands" :row-key="getRowKeys">
          <el-table-column label="case_ID" prop="case_id" />
          <el-table-column label="模块" prop="module" />
          <el-table-column label="响应时间" prop="use_time" />
          <el-table-column label="Comment" prop="comment" />
          <el-table-column label="结果" prop="result" />
          <el-table-column label="操作" fixed="right">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="toSeeLog(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          :small="false"
          :background="false"
          layout="total, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-tab-pane>
    </el-tabs> -->
    <div class="el-pagination-style" v-if="!showModelTable">
      <div class="el-pagination-style-left">
        <el-button type="primary" size="" @click="goBack">返回模块列表</el-button>
        <div>
          当前模块：<span style="font-weight: 600">{{ currentModel }}</span>
        </div>
      </div>
      <el-pagination
        v-model:currentPage="currentDetailPage"
        v-model:page-size="detailPageSize"
        :page-sizes="[10, 20, 30, 40]"
        :small="true"
        :background="false"
        layout="total, prev, pager, next, jumper"
        :total="detailTotal"
        @size-change="handleDetailSizeChange"
        @current-change="handleDetailCurrentChange"
      />
    </div>
    <el-table :data="detailTableData" border style="width: 100%" height="47vh" @expand-change="getLog" :expand-row-keys="expands" :row-key="getRowKeys" v-if="!showModelTable">
      <el-table-column label="case_ID" prop="case_id" />
      <el-table-column label="响应时间" prop="use_time" />
      <el-table-column label="Comment" prop="comment" />
      <el-table-column label="结果" prop="result" />
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="toSeeLog(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!--case脚本详情-->
  <el-dialog :model-value="isShowCaseScriptDialog" custom-class="caseScriptDialog" title="case脚本详情" @close="closeCaseScriptDialog">
    <div class="detailCaseScript">
      <monacoEditor v-model="caseScriptValue" :language="language" width="800px" height="500px" theme="vs-dark" @editor-mounted="editorMounted"></monacoEditor>
    </div>
  </el-dialog>
  <DataTemplateDialog :dialogData="dialogData" :isShowDialog="isShowDialog" @closeDialog="closeDialog" />
  <el-dialog :model-value="isShowLogDialog" custom-class="caseScriptDialog2" @close="isShowLogDialog = false" :show-close="false" fullscreen>
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header" style="display: flex; align-items: center; justify-content: space-between">
        <div style="display: flex; align-items: center">
          <h4 :id="titleId" :class="titleClass">{{ logTitle }}</h4>
        </div>
        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          关闭
        </el-button>
      </div>
    </template>
    <div class="detailCaseScript">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="用例脚本" name="first">
          <!-- <json-viewer :value="jsonData" copyable boxed sort /> -->
          <el-input v-model="case_script" :autosize="{ minRows: 12, maxRows: 36 }" type="textarea" placeholder="暂无用例脚本" />
        </el-tab-pane>
        <el-tab-pane label="脚本执行日志" name="second">
          <!-- <json-viewer :value="jsonData" copyable boxed sort /> -->
          <el-input v-model="case_log" :autosize="{ minRows: 12, maxRows: 36 }" type="textarea" placeholder="暂无脚本执行日志" />
        </el-tab-pane>
        <template v-for="(item, index) in shell_log" :key="'shell_log' + index">
          <el-tab-pane :label="'交互日志' + (index + 1)" :name="item.value">
            <el-input v-model="item.value" :autosize="{ minRows: 12, maxRows: 36 }" type="textarea" placeholder="暂无交互日志" />
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, inject, nextTick } from 'vue'
import { getReportDetailApi, getLogApi, getHistoryReportDetailApi } from '@/api/APV/testReport.js'
import { useRoute, useRouter } from 'vue-router'
import DataTemplateDialog from './components/dataTemplateDialog.vue'
import { getDataApi } from '@/utils/getApi.js'
import { utc2beijing } from '@/utils/util.js'
import { options } from './data.js'
import * as monaco from 'monaco-editor'
import type { TabsPaneContext } from 'element-plus'
import { CircleCloseFilled, FullScreen } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const reportId = route.query.resultid || route.params.detailId || route.query.historyResultid || ''
const isHistory = route.query.resultid ? false : true
const isShowDialog = ref(false)
const modeTableData = ref([]) // 模块数据
const tableData = ref([]) // 详情数据
const detailTableData = ref([])
const isShowLogDialog = ref(false) // 日志详情弹窗
const logTitle = ref('') // 日志详情弹窗标题
const contentItemList = ref([
  { name: '报告名称', label: 'name', value: '' },
  { name: '成功', label: 'pass', value: '' },
  { name: '失败', label: 'fail', value: '' },
  { name: '已知问题', label: 'issue', value: '' },
  { name: '总数', label: 'total', value: '' },
  { name: '开始时间', label: 'start_time', value: '' },
  { name: '用时', label: 'time', value: '' },
  { name: '负责人', label: 'user', value: '' }
])
let obj = {
  name: 'qiu', //字符串
  age: 18, //数组
  isMan: false, //布尔值
  date: new Date(),
  fn: () => {},
  arr: [1, 2, 5]
}
const showModelTable = ref(true)
const jsonData = reactive(obj)
const case_script = ref('')
const case_log = ref('')
const shell_log = ref([])
const logData = ref(
  '20 | 400 | slb_rr_100.pl | Thursday, September 08, 2022 AM02:30:04 CST \n20 | 200 |  TIP all 10015100161000710008 \n20 | 200 |  TIP  10015:10016 \n20 | 200 |  2:30:4-172.16.26.215-ttyS0 :  user sunyb pass click1 \n20 | 200 |  2:30:5-172.16.26.215-ttyS0 : script dir /home/sunyb/sunyb.ws/src_apv/result/log//2022-09-08-02:29:22--Beta_APV_10_5_0_42.array/smoke_test//result/mnet_env//T_0001/shell-ttyS0.txt \n20 | 200 |  2:30:5-172.16.26.215-ttyS0 : Test Machine ip 172.16.26.215 \n20 | 200 |  2:30:5-172.16.26.215-ttyS0 : login user root \n20 | 200 |   \n20 | 200 |  the last prompt \n20 | 200 |  command timed-out at ../../util/cli/ca.pm line 159 \n20 | 200 |   \n 50 | 255 | Unkonw | FAIL | Unkonw Exit Code 255 \n20 | 500 | slb_rr_100.pl | Thursday, September 08, 2022 AM02:30:54 CST \nunable to update smoke test result'
)
const activeName = ref('first')
const expands = ref([]) // 通过该属性设置Table目前的展开行，需要设置row-key属性才能使用，该属性为展开行的keys数组
const casValue: any = ref([])
const caseOptions = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const isShow = ref(false)
const currentDetailPage = ref(1)
const detailPageSize = ref(20)
const detailTotal = ref(0)
const currentRow = ref(null)
const currentType = ref(null)
const currentModel = ref(null)

// 调用 测试报告详情接口
const getReportDetail = async (id) => {
  let res = await getReportDetailApi({ id, detail: 'True' })
  if (res?.code === 1000) {
    isShow.value = true
    contentItemList.value.map((item) => {
      item.value = res.data[item.label]
      if (item.label === 'total') {
        item.value = res.data['fail'] + res.data['issue'] + res.data['pass']
      }
      if (item.label === 'time') {
        item.value = (res.data['time(min)'] / 60).toFixed(1) + '小时'
      }
      if (item.label === 'start_time') {
        item.value = item.value === null ? '无' : utc2beijing(item.value)
      }
    })
    res.data && res.data['pass'] ? (contentItemList.value[1].value = res.data['pass']) : (contentItemList.value[1].value = '0')
    const headers = res.data.group_module[0]
    const result = []

    for (let i = 1; i < res.data.group_module.length; i++) {
      const obj = {}
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = res.data.group_module[i][j]
      }
      result.push(obj)
    }

    caseOptions.value = result
    total.value = result.length || 0
    // res.modules &&
    //   res.modules.map((item) => {
    //     caseOptions.value.push({
    //       value: item,
    //       label: item
    //     })
    //   })
    modeTableData.value = caseOptions.value
  }
}

// 调用 历史测试报告详情接口
const getHistoryReportDetail = async (id) => {
  isShow.value = true
  let res = await getHistoryReportDetailApi({ id, detail: 'True' })
  if (res?.code === 1000) {
    contentItemList.value.map((item) => {
      item.value = res.data[item.label]
      if (item.label === 'total') {
        item.value = res.data['fail'] + res.data['issue'] + res.data['pass']
      }
      if (item.label === 'time') {
        item.value = (res.data['time(min)'] / 60).toFixed(1) + '小时'
      }
      if (item.label === 'start_time') {
        item.value = utc2beijing(item.value)
      }
    })
    res.data && res.data['pass'] ? (contentItemList.value[1].value = res.data['pass']) : (contentItemList.value[1].value = '0')
    const headers = res.data.group_module[0]
    const result = []
    for (let i = 1; i < res.data.group_module.length; i++) {
      const obj = {}
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = res.data.group_module[i][j]
      }
      result.push(obj)
    }
    caseOptions.value = result
    total.value = result.length || 0
    // res.modules &&
    //   res.modules.map((item) => {
    //     caseOptions.value.push({
    //       value: item,
    //       label: item
    //     })
    //   })
    modeTableData.value = caseOptions.value
  }
}

const getReportModuleDetail = async (params) => {
  let res = await getReportDetailApi(params)
  if (res?.code == 1000) {
    detailTableData.value = res.data || []
    detailTotal.value = res.total || 0
  }
}

const getHistoryReportModuleDetail = async (params) => {
  let res = await getHistoryReportDetailApi(params)
  if (res?.code == 1000) {
    detailTableData.value = res.data || []
    detailTotal.value = res.total || 0
  }
}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const formInline = ref({
  value: '',
  id: ''
})

const statusOptions = ref(options)
const status = ref('')

// 选择状态/模块
const selectSearch = async (page) => {
  currentPage.value = page
  const params = {
    id: reportId,
    details: 'True',
    result: status.value ? status.value : undefined,
    module: casValue.value ? casValue.value : undefined,
    page: currentPage.value
  }
  isHistory ? getHistoryReportModuleDetail(params) : getReportModuleDetail(params)
}

let echarts: any = inject('echarts')
const dataX: any = ref([])
const dialogData = ref([])
const isShowCaseScriptDialog = ref(false)

const caseScriptValue = ref(
  '20 | 400 | slb_rr_100.pl | Thursday, September 08, 2022 AM02:30:04 CST \n20 | 200 |  TIP all 10015100161000710008 \n20 | 200 |  TIP  10015:10016 \n20 | 200 |  2:30:4-172.16.26.215-ttyS0 :  user sunyb pass click1 \n20 | 200 |  2:30:5-172.16.26.215-ttyS0 : script dir /home/sunyb/sunyb.ws/src_apv/result/log//2022-09-08-02:29:22--Beta_APV_10_5_0_42.array/smoke_test//result/mnet_env//T_0001/shell-ttyS0.txt \n20 | 200 |  2:30:5-172.16.26.215-ttyS0 : Test Machine ip 172.16.26.215 \n20 | 200 |  2:30:5-172.16.26.215-ttyS0 : login user root \n20 | 200 |   \n20 | 200 |  the last prompt \n20 | 200 |  command timed-out at ../../util/cli/ca.pm line 159 \n20 | 200 |   \n 50 | 255 | Unkonw | FAIL | Unkonw Exit Code 255 \n20 | 500 | slb_rr_100.pl | Thursday, September 08, 2022 AM02:30:54 CST \nunable to update smoke test result'
)
const language = ref('perl')
const editorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
  console.log('editor实例加载完成', editor)
}

const closeCaseScriptDialog = () => {
  isShowCaseScriptDialog.value = false
}

const showOverview = () => {
  const chartBox = echarts.init(document.getElementById('overview'))
  var img =
    'data:image/png;base64,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'
  var trafficWay = [
    {
      name: '成功数',
      value: Number(contentItemList.value[1].value)
    },
    {
      name: '失败数',
      value: Number(contentItemList.value[2].value)
    },
    {
      name: '已知问题',
      value: Number(contentItemList.value[3].value)
    }
  ]

  var data = []
  var color = ['#00ffff', '#00cfff', '#006ced', '#ffe000', '#ffa800', '#ff5b00', '#ff3000']
  for (var i = 0; i < trafficWay.length; i++) {
    data.push(
      {
        value: trafficWay[i].value,
        name: trafficWay[i].name,
        itemStyle: {
          normal: {
            borderWidth: 5,
            shadowBlur: 20,
            borderColor: color[i],
            shadowColor: color[i]
          }
        }
      },
      {
        value: 2,
        name: '',
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            color: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 0
          }
        }
      }
    )
  }
  var seriesOption = [
    {
      name: '',
      type: 'pie',
      clockWise: false,
      radius: [85, 89],
      hoverAnimation: false,
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'outside',
            color: '#ddd',
            formatter: function (params) {
              var percent = ''
              var total = 0
              for (var i = 0; i < trafficWay.length; i++) {
                total += trafficWay[i].value
              }
              percent = ((params.value / total) * 100).toFixed(0)
              if (params.name !== '') {
                return params.name + '：' + params.value + '\n' + '\n' + '占百分比：' + percent + '%'
              } else {
                return ''
              }
            }
          },
          labelLine: {
            length: 16,
            length2: 100,
            show: true,
            color: '#00ffff'
          }
        }
      },
      data: data
    }
  ]
  const option = {
    backgroundColor: '#0A2E5D',
    color: color,
    title: {
      text: Number(contentItemList.value[4].value),
      subtext: '总数',
      top: '40%',
      x: 'center',
      y: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'normal',
        align: 'center',
        width: '200px'
      },
      subtextStyle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'normal',
        align: 'center'
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: '#CCCCCC'
    },
    graphic: {
      elements: [
        {
          type: 'image',
          z: 3,
          style: {
            image: img,
            width: 148,
            height: 148
          },
          left: 'center',
          top: 'center',
          position: [100, 100]
        }
      ]
    },
    legend: {
      icon: 'circle',
      orient: 'horizontal',
      data: ['成功数', '失败数', '已知问题', '总数'],
      right: 200,
      bottom: 30,
      align: 'right',
      textStyle: {
        color: '#fff'
      },
      itemGap: 20
    },
    toolbox: {
      show: false
    },
    series: seriesOption
  }
  document.getElementById('overview').removeAttribute('_echarts_instance_')
  chartBox.setOption(option)
  // 根据页面大小自动响应图表大小
  window.addEventListener('resize', function () {
    chartBox.resize()
  })
}

// 折线图
const changetype = () => {
  // 获取组件实例
  const machart = echarts.init(document.getElementById('detail'))
  // 设置配置项
  const option = {
    backgroundColor: 'rgba(5,39,58,1)', //背景色
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '6%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      data: ['cc', 'cps', 'cpu', 'dut_cc', 'dut_cps', 'dut_rps', 'response', 'ssl_ae', 'ssl_se', 'throughput', 'tps', 'unsuccessful'],
      triggerEvent: true,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        show: true,
        rotate: 0,
        interval: 0,
        textStyle: {
          padding: [14, 0, 0, 0],
          fontSize: 14,
          color: 'rgba(255,255,255,1)'
        }
      }
    },
    yAxis: {
      type: 'log',
      min: 1,
      // name: "单位：个数",
      triggerEvent: true,
      nameTextStyle: {
        color: 'rgba(255,255,255,1)',
        fontSize: 16,
        padding: [0, 0, 10, -20]
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,.1)'
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,.1)'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: 'rgb(148,159,167)',
          fontSize: 16
        }
      }
    },
    // color: ["#e54035"],
    series: [
      {
        name: '值',
        barMinHeight: 10,
        type: 'pictorialBar',
        barCategoryGap: '60%',
        // symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
        symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
        itemStyle: {
          normal: {
            //barBorderRadius: 5,
            //渐变色
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#01EAED'
              },
              {
                offset: 0.5,
                color: '#02C4DD'
              },
              {
                offset: 1,
                color: '#029ED9'
              }
            ])
          }
        },
        label: {
          normal: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#fff',
              fontSize: 20
            }
          }
        },
        data: dataX.value,
        z: 10
      }
    ]
  }
  // 复制
  machart.setOption(option)
  // 根据页面大小自动响应图表大小
  window.addEventListener('resize', function () {
    machart.resize()
  })
}

const toBack = () => {
  router.go(-1)
}

// 关闭弹窗
const closeDialog = (value) => {
  isShowDialog.value = value
}

const fullScreen = () => {
  const terminalContainer = document.getElementById('tabs')
  if (terminalContainer.requestFullscreen) {
    terminalContainer.requestFullscreen()
  }
}

const getLog = (row, expandedRows) => {
  if (expands.value.includes(row.case_id)) {
    expands.value = expands.value.filter((val) => val !== row.case_id)
    return false
  } else {
    if (expands.value.length != 0) {
      //如果存在展开行,清空expands数组,使它关闭
      expands.value.splice(0, expands.value.length)
      //打开点击的行
      expands.value.push(row.case_id)
    } else {
      //如果不存在展开行,直接push打开点击的行
      expands.value.push(row.case_id)
    }
  }
  activeName.value = 'first'
  let LogList = []
  LogList.push(row.case_script, row.case_log)
  LogList.map(async (item, index) => {
    await getLogApi({ url: String(item) }).then((res) => {
      switch (index) {
        case 0:
          case_script.value = res.data || '请求错误'
          break
        case 1:
          case_log.value = res.data || '请求错误'
          break
        default:
          break
      }
    })
  })
  shell_log.value = []
  row.shell_log.map(async (item, index) => {
    await getLogApi({ url: String(item) }).then((res) => {
      shell_log.value.push({
        value: res.data || '请求错误'
      })
    })
  })
}

const getRowKeys = (row) => {
  // 行数据的Key
  return row.case_id
}

const toDetailCase = (log) => {
  // getLog(log)
  isShowCaseScriptDialog.value = true
}

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  selectSearch(currentPage.value)
}

const handleDetailSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}

const handleDetailCurrentChange = (val: number) => {
  currentDetailPage.value = val
  toSeeDeatil(currentRow.value, currentType.value)
}

const toSeeLog = (row) => {
  logTitle.value = `【 ${row.case_id}】的日志详情`
  activeName.value = 'first'
  let LogList = []
  LogList.push(row.case_script, row.case_log)
  LogList.map(async (item, index) => {
    await getLogApi({ url: String(item) }).then((res) => {
      switch (index) {
        case 0:
          case_script.value = res.data || '请求错误'
          break
        case 1:
          case_log.value = res.data || '请求错误'
          break
        default:
          break
      }
    })
  })
  shell_log.value = []
  row.shell_log.map(async (item, index) => {
    await getLogApi({ url: String(item) }).then((res) => {
      shell_log.value.push({
        value: res.data || '请求错误'
      })
    })
  })
  isShowLogDialog.value = true
}

const toSeeDeatil = (row, type) => {
  currentRow.value = row
  currentType.value = type
  currentModel.value = row.Module
  showModelTable.value = false
  const params = {
    id: reportId,
    details: 'True',
    result: type,
    module: row.Module,
    page: currentDetailPage.value
  }
  isHistory ? getHistoryReportModuleDetail(params) : getReportModuleDetail(params)
}

const goBack = () => {
  showModelTable.value = true
  currentPage.value = 1
  isHistory ? getHistoryReportModuleDetail({ id: reportId, details: 'True', page: 1 }) : getReportModuleDetail({ id: reportId, details: 'True', page: 1 })
}

onMounted(async () => {
  isHistory ? await getHistoryReportDetail(reportId) : await getReportDetail(reportId)
  isHistory ? await getHistoryReportModuleDetail({ id: reportId, details: 'True', page: 1 }) : await getReportModuleDetail({ id: reportId, details: 'True', page: 1 })
  nextTick(() => {
    showOverview()
  })
})
</script>

<style lang="scss" scoped>
.demo-tabs {
  padding: 0px 5px !important;
}

.report-card {
  position: relative;

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    z-index: 9;
    width: 95%;
    top: 6%;
    padding-left: 40px;

    span {
      font-size: 20px;
      font-weight: 800;
      color: #fff;
    }
  }

  .content {
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    z-index: 9;
    color: #fff;
    top: 20%;
    padding-left: 50px;
    width: 40vw;

    .content-item {
      width: 350px;
      margin: 15px 0;

      span {
        font-size: 15px;
      }
    }
  }

  :deep(.el-card__body) {
    // padding-left: 75px;
  }

  .ribbon {
    background-color: #1890ff;
    overflow: hidden;
    white-space: nowrap;
    position: absolute;
    left: -55px; // 根据实际调整即可
    top: 17px; // 根据实际调整即可
    transform: rotate(-45deg);
    box-shadow: 0 0 10px #888;
    opacity: 0.8;
    z-index: 9;

    span {
      color: #000;
      padding: 5px 50px;
      display: block;
    }
  }
}

.detail-card {
  margin-top: 20px;

  .detailsPane {
    .detailForm {
      display: flex !important;

      :deep(.el-cascader .el-input) {
        height: 32px;
        width: 300px;
      }

      :deep(.el-select__tags) {
        z-index: 1000;
      }
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-weight: 600;
  }
}

.card-detail {
  display: flex;
  flex-flow: wrap;

  .item {
    display: flex;
    flex: 33%;
    margin-top: 10px;

    span {
      font-size: 18px;
      color: #555;
      min-width: 80px;
      display: inline-block;
    }

    .right {
      margin-left: 15px;
      max-width: 400px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

#detail {
  max-height: 500px;
  height: 500px;
  margin-top: 30px;
  margin-bottom: 15px;
}

.top {
  margin-bottom: 10px;

  .left {
    display: flex;
  }

  :deep(.el-card__body) {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-size: 16px;
      display: inline-block;
      height: 16px;
      line-height: 16px;
      margin-left: 5px;
    }
  }
}

:deep(.el-card__body) {
  padding: 0px;
}
.pagination {
  margin: 10px 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.el-pagination-style {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px 0 20px;
  margin: 10px 0;
  .el-pagination-style-left {
    display: flex;
    align-items: center;
    .el-button {
      margin-right: 20px;
    }
  }
}

.modelTable {
  margin-top: 20px;
}

#overview {
  width: 90vw;
  height: 300px;
}
</style>

<style lang="scss">
.caseScriptDialog2 {
  .el-dialog__body {
    padding-top: 0px !important;
  }
  .el-dialog__header {
    padding-top: 0px !important;
    padding-bottom: 0px;
  }
  .full-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .full-icon:hover {
    color: #1890ff;
  }
}
.caseScriptDialog {
  .el-dialog__body {
    padding-top: 0px !important;
  }

  .codeEditBox {
    width: 100%;
  }
}
</style>
