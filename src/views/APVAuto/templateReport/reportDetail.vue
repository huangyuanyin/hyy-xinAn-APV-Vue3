<template>
  <el-card class="report-card">
    <div class="top">
      <span>报告信息</span>
      <div>
        <el-button type="primary" @click="toBack">返回</el-button>
        <el-button type="primary" disabled>导出报告</el-button>
      </div>
    </div>
    <div class="content">
      <div class="content-item" v-for="(item,index) in contentItemList" :key="'item'+index">
        <span class="itemName">{{item.name}}：</span>
        <span class="itemValue">{{item.value}}</span>
      </div>
    </div>
  </el-card>
  <el-card class="detail-card">
    <el-tabs type="border-card">
      <el-tab-pane label="概览">
        <div id="overview" style="width: 100%;height:500px;"></div>
      </el-tab-pane>
      <el-tab-pane label="详情" class="detailsPane">
        <el-form :inline="true" :model="formInline" class="detailForm">
          <el-form-item label="">
            <el-select v-model="formInline.value" class="m-2" placeholder="选择类型" size="default">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- <div>
            <el-form-item label="">
              <el-input v-model="formInline.id" placeholder="搜索任务名称、报告ID、负责人..." style="width: 300px;" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">搜索</el-button>
              <el-button>重置</el-button>
            </el-form-item>
          </div> -->
        </el-form>
        <el-table :data="detailTableData2" border style="width: 100%">
          <el-table-column type="expand">
            <template #default="props">
              <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="请求详情" name="first">
                  <json-viewer :value="jsonData" copyable boxed sort />
                </el-tab-pane>
                <el-tab-pane label="响应详情" name="second">
                  <json-viewer :value="jsonData" copyable boxed sort />
                </el-tab-pane>
              </el-tabs>
            </template>
          </el-table-column>
          <el-table-column label="case_ID" prop="date" />
          <el-table-column label="case_脚本" prop="name">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="toDetailCase">详情</el-button>
            </template>
          </el-table-column>
          <el-table-column label="Comment" prop="methods" />
          <el-table-column label="响应时间" prop="time" />
          <el-table-column label="测试结果" prop="result" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
  <!--case脚本详情-->
  <el-dialog :model-value="isShowCaseScriptDialog" custom-class="caseScriptDialog" title="case脚本详情"
    @close="closeCaseScriptDialog">
    <div class="detailCaseScript">
      <monacoEditor v-model="caseScriptValue" :language="language" width="800px" height="500px" theme="vs-dark"
        @editor-mounted="editorMounted"></monacoEditor>
    </div>
  </el-dialog>

  <!-- <el-card class="detail-card" style="margin-top:30px">
    <template #header>
      <div class="card-header">
        <span>报告详情</span>
        <el-button class="button" link type="primary" @click="openDialog">生成报告</el-button>
      </div>
    </template>
    <div class="card-detail">
      <div class="item" v-for="(item, index) in itemList" :key="'itemList' + index">
        <span>{{ item.label }}</span>
        <span class="right">{{ item.value }}</span>
      </div>
      <el-table :data="tableData" border stripe style="width: 100%;margin-top: 30px;">
        <el-table-column prop="cc" label="cc" align="center" />
        <el-table-column prop="cps" label="cps" align="center" />
        <el-table-column prop="cpu" label="cpu" align="center" />
        <el-table-column prop="dut_cc" label="dut_cc" align="center" />
        <el-table-column prop="dut_rps" label="dut_rps" align="center" />
        <el-table-column prop="response" label="response" align="center" />
        <el-table-column prop="ssl_ae" label="ssl_ae" align="center" />
        <el-table-column prop="ssl_se" label="ssl_se" align="center" />
        <el-table-column prop="throughput" label="throughput" align="center" />
        <el-table-column prop="tps" label="tps" align="center" />
        <el-table-column prop="unsuccessful" label="unsuccessful" align="center" />
      </el-table>
    </div>
    <div id="detail"></div>
  </el-card> -->
  <DataTemplateDialog :dialogData="dialogData" :isShowDialog="isShowDialog" @closeDialog="closeDialog" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, inject, nextTick } from 'vue'
import { datas } from "@/api/POC/index.js";
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeftBold } from "@element-plus/icons-vue";
import DataTemplateDialog from './components/dataTemplateDialog.vue';
import { getDataApi } from "@/utils/getApi.js"
import { detailTableData } from './data.js'
import * as monaco from 'monaco-editor'
import type { TabsPaneContext } from 'element-plus'

export default defineComponent({
  components: {
    ArrowLeftBold, DataTemplateDialog
  },
  setup() {
    const isShowDialog = ref(false)
    const tableData = ref([]) // 详情数据
    const contentItemList = ref([
      { name: "报告名称", value: "123" },
      { name: "成功", value: "6" },
      { name: "失败", value: "6" },
      { name: "错误", value: "33" },
      { name: "总数", value: "63" },
      { name: "开始时间", value: "2022-09-01T15:27:29" },
      { name: "用时", value: "0" },
      { name: "负责人", value: "hyy" }
    ])
    let obj = {
      name: "qiu",//字符串
      age: 18,//数组
      isMan: false,//布尔值
      date: new Date(),
      fn: () => { },
      arr: [1, 2, 5]
    };
    const jsonData = reactive(obj);
    const activeName = ref('first');
    const handleClick = (tab: TabsPaneContext, event: Event) => {
      console.log(tab, event)
    }
    const formInline = ref({
      value: "",
      id: ""
    })
    const detailTableData2 = ref(detailTableData)
    const value = ref('')
    const options = [
      {
        value: 'success',
        label: 'success',
      },
      {
        value: 'failed',
        label: 'failed',
      },
      {
        value: 'error',
        label: 'error',
      },
      {
        value: 'skipped',
        label: 'skipped',
      }
    ]
    const itemList: any = ref([])
    const route = useRoute();
    const router = useRouter()
    let echarts: any = inject("echarts");
    const dataX: any = ref([])
    const dialogData = ref([])
    const isShowCaseScriptDialog = ref(false)

    const caseScriptValue = ref("[2022-09-28 06:05:10]: 测试任务开始执行\n[2022-09-28 06:05:10]: 测试任务状态修改成功\n[2022-09-28 06:05:10]: 开始校验ArrayOS-Beta_APV_10_5_0_36.array文件\n[2022-09-28 06:05:10]: 测试环境 29 验证通过\n[2022-09-28 06:05:10]: 开始同步测试用例\n[2022-09-28 06:05:15]: ArrayOS-Beta_APV_10_5_0_36.array, 同步测试用例成功\n[2022-09-28 06:05:15]: smart_huawei.pl\n[2022-09-28 06:05:15]: 测试用例同步成功\n[2022-09-28 06:05:15]: 开始向测试环境上传build文件\n[2022-09-28 06:05:15]: 29 开始上传build\n[2022-09-28 06:05:20]: 29 build 上传成功\n[2022-09-28 06:05:20]: 向测试环境上传build文件结束\n[2022-09-28 06:05:20]: 开始进行APV设备，build版本升级\n[2022-09-28 06:05:20]: 开始测试环境29，apv设备，build升级\n[2022-09-28 06:05:20]: 测试设备29build升级成功\n[2022-09-28 06:05:46]: apv 设备ttyS0(172.16.35.66)build升级成功\n[2022-09-28 06:05:46]: 测试设备29build升级成功\n[2022-09-28 06:05:46]: APV设备升级结束\n[2022-09-28 06:05:55]: 测试环境29执行测试成功\n[2022-09-28 06:05:55]: 测试环境[29]正常启动，开始执行测试任务\n")
    const language = ref('perl')
    const editorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
      console.log('editor实例加载完成', editor)
    }
    const closeCaseScriptDialog = () => {
      isShowCaseScriptDialog.value = false
    }

    const showOverview = () => {
      const chartBox = echarts.init(document.getElementById('overview'));
      var img = 'data:image/png;base64,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';
      var trafficWay = [{
        name: '成功数',
        value: 20,
      }, {
        name: '失败数',
        value: 10
      }, {
        name: '错误数',
        value: 30
      }, {
        name: '总数',
        value: 100
      }];

      var data = [];
      var color = ['#00ffff', '#00cfff', '#006ced', '#ffe000', '#ffa800', '#ff5b00', '#ff3000']
      for (var i = 0; i < trafficWay.length; i++) {
        data.push({
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
        }, {
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
        });
      }
      var seriesOption = [{
        name: '',
        type: 'pie',
        clockWise: false,
        radius: [105, 109],
        hoverAnimation: false,
        itemStyle: {
          normal: {
            label: {
              show: true,
              position: 'outside',
              color: '#ddd',
              formatter: function (params) {
                var percent = '';
                var total = 0;
                for (var i = 0; i < trafficWay.length; i++) {
                  total += trafficWay[i].value;
                }
                percent = ((params.value / total) * 100).toFixed(0);
                if (params.name !== '') {
                  return params.name + "：" + params.value + '\n' + '\n' + '占百分比：' + percent + '%';
                } else {
                  return '';
                }
              },
            },
            labelLine: {
              length: 60,
              length2: 100,
              show: true,
              color: '#00ffff'
            }
          }
        },
        data: data
      }];
      const option = {
        backgroundColor: '#0A2E5D',
        color: color,
        title: {
          "text": 24,
          "subtext": "总数",
          "top": '40%',
          "x": "center",
          "y": "center",
          "textStyle": {
            "color": "#fff",
            "fontSize": 60,
            "fontWeight": "normal",
            "align": "center",
            "width": "200px"
          },
          "subtextStyle": {
            "color": "#fff",
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: "#CCCCCC"
        },
        graphic: {
          elements: [{
            type: "image",
            z: 3,
            style: {
              image: img,
              width: 178,
              height: 178
            },
            left: 'center',
            top: 'center',
            position: [100, 100]
          }]
        },
        legend: {
          icon: "circle",
          orient: 'horizontal',
          data: ['成功数', '失败数', '错误数', '总数'],
          right: 250,
          bottom: 100,
          align: 'right',
          textStyle: {
            color: "#fff"
          },
          itemGap: 20
        },
        toolbox: {
          show: false
        },
        series: seriesOption
      }
      chartBox.setOption(option);
      // 根据页面大小自动响应图表大小
      window.addEventListener("resize", function () {
        chartBox.resize();
      });
    }

    // 获取数据
    const getDatas = () => {
      getDataApi(route.query.resultid).then(res => {
        tableData.value = res;
        handleData(tableData.value)
      }).then(() => {
        changetype()
      })
    };
    // 折线图
    const changetype = () => {
      // 获取组件实例
      const machart = echarts.init(document.getElementById("detail"));
      // 设置配置项
      const option = {
        backgroundColor: "rgba(5,39,58,1)", //背景色
        tooltip: {
          trigger: "axis",
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "4%",
          right: "4%",
          bottom: "6%",
          top: "15%",
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
              color: "rgba(255,255,255,1)"
            }
          }
        },
        yAxis: {
          type: "log",
          min: 1,
          // name: "单位：个数",
          triggerEvent: true,
          nameTextStyle: {
            color: "rgba(255,255,255,1)",
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
              color: "rgb(148,159,167)",
              fontSize: 16
            }
          }
        },
        // color: ["#e54035"],
        series: [
          {
            name: "值",
            barMinHeight: 10,
            type: "pictorialBar",
            barCategoryGap: "60%",
            // symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
            symbol: "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
            itemStyle: {
              normal: {
                //barBorderRadius: 5,
                //渐变色
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: "#01EAED"
                },
                {
                  offset: 0.5,
                  color: "#02C4DD"
                },
                {
                  offset: 1,
                  color: "#029ED9"
                }
                ])
              }
            },
            label: {
              normal: {
                show: true,
                position: "top",
                textStyle: {
                  color: "#fff",
                  fontSize: 20
                }
              }
            },
            data: dataX.value,
            z: 10
          },
        ]
      }
      // 复制
      machart.setOption(option);
      // 根据页面大小自动响应图表大小
      window.addEventListener("resize", function () {
        machart.resize();
      });
    };
    // 处理数据
    const handleData = (tableData) => {
      itemList.value = [
        { label: '任务ID:', value: tableData[0]?.id },
        { label: "测试时间:", value: tableData[0].time },
        { label: "测试结果状态:", value: tableData[0].status },
        { label: "设备型号:", value: tableData[0].apv_model },
        { label: "版本:", value: tableData[0].build },
        { label: "ipversion:", value: tableData[0].ipversion },
      ]
      let { apv_model, build, dut_throughput, id, ipversion, protocol, test_case, status, time, ...params } = tableData[0]
      dataX.value = Object.values(params)
    }
    const toBack = () => {
      router.go(-1)
    }
    // 生成报告 弹窗
    const openDialog = () => {
      isShowDialog.value = true
      dialogData.value = tableData.value[0]
      console.log("测试数据...", dialogData.value)
    }
    // 关闭弹窗
    const closeDialog = (value) => {
      isShowDialog.value = value
    }
    const toDetailCase = () => {
      isShowCaseScriptDialog.value = true
    }
    onMounted(async () => {
      await getDatas();
      showOverview()
    });
    return {
      dialogData,
      isShowDialog,
      openDialog,
      closeDialog,
      dataX,
      changetype,
      echarts,
      route,
      router,
      tableData,
      itemList,
      getDatas,
      handleData,
      toBack, contentItemList, formInline, value, options, detailTableData2, showOverview, toDetailCase, isShowCaseScriptDialog, caseScriptValue, language, editorMounted, closeCaseScriptDialog, jsonData,
      activeName, handleClick
    }
  },
})
</script>

<style lang="scss" scoped>
.demo-tabs {
  padding: 0px 5px !important;
}

.report-card {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-size: 18px;
      font-weight: 800;
    }
  }

  .content {
    display: flex;
    flex-wrap: wrap;

    .content-item {
      width: 400px;
      margin: 10px 0;

      span {
        font-size: 14px;
      }
    }
  }
}

.detail-card {
  margin-top: 20px;

  .detailsPane {
    .detailForm {
      display: flex !important;
      justify-content: space-between !important;
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
</style>

<style lang="scss">
.caseScriptDialog {
  .el-dialog__body {
    padding-top: 0px !important;
  }

  .codeEditBox {
    width: 100%;
  }
}
</style>
