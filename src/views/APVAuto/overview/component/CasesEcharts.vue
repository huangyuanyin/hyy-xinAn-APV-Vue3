<template>
  <div id="com-container" class="com-container">
    <h2>cases数据</h2>
    <!-- <div style="100%"> -->
    <div class="tip" v-if="isRefreshLoding">更新数据中，请稍后...</div>
    <div id="main" v-else></div>
    <!-- </div> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue' // 主要
import { getCasesData, getRefreshCasesData } from '@/utils/getApi.js'

let echarts = inject('echarts') // 主要

const props = defineProps({
  isRefresh: {
    type: Boolean,
    default: () => false
  }
})

const list = ref(<any>[])
const versionName = ref(<any>[]) // 版本名称
const versionNumber = ref(<any>[]) // 版本用例数
const isRefreshLoding = ref(false)

const handleData = async () => {
  if (props.isRefresh) {
    isRefreshLoding.value = true
    await getRefreshCasesData().then((res: any) => {
      isRefreshLoding.value = false
      res.map((it) => {
        versionName.value.push(it.name)
        versionNumber.value.push(it.value)
        list.value.push(it)
      })
    })
  } else {
    await getCasesData().then((res: any) => {
      res.map((it) => {
        versionName.value.push(it.name)
        versionNumber.value.push(it.value)
        list.value.push(it)
      })
    })
  }
}

// 基本柱形图
const change = () => {
  const chartBox = echarts.init(document.getElementById('main')) // 主要

  // 数据
  var dateBase = new Date()
  var year = dateBase.getFullYear()
  var dottedBase = +dateBase + 1000 * 3600 * 24
  var weekCategory = []

  // 周数据
  for (var i = 0; i < 7; i++) {
    // 日期
    var date = new Date((dottedBase -= 1000 * 3600 * 24))
    weekCategory.unshift([date.getMonth() + 1, date.getDate()].join('/'))
  }

  const option = {
    backgroundColor: '',
    title: {
      // text: 'cases数据',
      // textStyle: {
      //   color: '#fff',
      //   fontSize: 32,
      //   fontWeight: 'normal'
      // },
      // subtext: year + '/' + weekCategory[6],
      // subtextStyle: {
      //   color: '#fff',
      //   fontSize: 16,
      // },
      // top: 50,
      // left: 80
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        return (
          '<div>' +
          params[0].name +
          '<br>' +
          params[0].marker +
          '用例数' +
          ':' +
          '<span style="color: #00B83F;">' +
          params[0].value +
          '</span>' +
          '<br>' +
          params[0].marker +
          '模块数：' +
          '<span style="color: #00B83F;">' +
          params[0].data.children.length +
          '</div>'
        )
      }
    },
    grid: {
      left: 60,
      right: 80,
      bottom: 40,
      top: '5%'
    },
    legend: {
      top: 220,
      left: 80,
      orient: 'vertical',
      itemGap: 15,
      itemWidth: 12,
      itemHeight: 12,
      data: ['10_4_runcase', '10_5_runcase', '8_5_runcase', '8_6_runcase'],
      textStyle: {
        color: '#fff',
        fontSize: 14
      }
    },
    xAxis: [
      {
        name: '版本',
        type: 'category',
        data: versionName.value || [],
        axisLine: {
          lineStyle: {
            color: '#FFFFFF'
          }
        },
        axisLabel: {
          interval: 0, // 横轴信息全部展示
          rotate: 15, // 15度角倾斜显示
          margin: 10,
          color: '#e2e9ff',
          textStyle: {
            fontSize: 12
          }
        },
        axisTick: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        name: '用例数',
        axisLabel: {
          formatter: '{value}',
          color: '#e2e9ff'
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0,186,255,.6)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.12)'
          }
        }
      }
    ],
    series: {
      name: '',
      type: 'bar',
      data: list.value || [],
      barWidth: '28px',
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: 'rgba(0,244,255,1)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(0,77,167,1)' // 100% 处的颜色
              }
            ],
            false
          ),
          shadowColor: 'rgba(0,160,221,1)',
          shadowBlur: 4
        }
      },
      label: {
        normal: {
          show: true,
          lineHeight: 30,
          width: 80,
          height: 30,
          backgroundColor: 'rgba(0,160,221,0.1)',
          borderRadius: 200,
          position: ['-8', '-60'],
          distance: 1,
          formatter: ['    {d|●}', ' {a|{c}}     \n', '    {b|}'].join(''),
          rich: {
            d: {
              color: '#3CDDCF'
            },
            a: {
              color: '#fff',
              align: 'center'
            },
            b: {
              width: 1,
              height: 30,
              borderWidth: 1,
              borderColor: '#234e6c',
              align: 'left'
            }
          }
        }
      }
    }
  }
  document.getElementById('main').removeAttribute('_echarts_instance_')
  chartBox.setOption(option, true)
  // 根据页面大小自动响应图表大小
  window.addEventListener('resize', function () {
    chartBox.resize()
  })
}

onMounted(async () => {
  await handleData()
  await change()
})
</script>

<style lang="scss" scoped>
#main {
  min-width: 31.25rem;
  min-height: calc(100% - 35px);
}

.com-container {
  background-color: rgba(3, 14, 70, 0.5) !important;
  height: 100%;

  h2 {
    color: #007bff !important;
    text-align: center;
    margin: 0;
    line-height: 40px;
  }
  .tip {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
