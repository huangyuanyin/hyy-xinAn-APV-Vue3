<template>
  <div class="console-wrap" id="console-wrap">
    <div class="console" id="terminal" v-show="refreshTer" tabindex="0"></div>
    <el-button class="ignore-button1" type="default" @click="backList()"> 返回列表 </el-button>
    <el-button v-if="!isFullScreen" class="ignore-button2" type="primary" @click="fullScreen()"> 全屏操作 </el-button>
    <el-button v-else class="ignore-button2" type="primary" @click="exitFullScreen()"> 退出全屏 </el-button>
    <el-button v-if="!isFullScreen" class="ignore-button3" type="info" @click="operationalDocument()"> 操作文档 </el-button>
    <el-button v-if="!isFullScreen" class="ignore-button4" type="success" @click="toMark()"> 设备升级 </el-button>
    <el-button v-if="!isFullScreen" class="ignore-button5" type="warning" @click="seeProcess()"> 升级进度 </el-button>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch, watchEffect } from 'vue'
import Terminal from '../config/Xterm'

const props = defineProps({
  terminal: {
    type: Object,
    default: {
      pid: 1,
      name: 'terminal',
      cols: 700,
      rows: 100
    }
  },
  termmailInfo: {
    type: Object,
    default: () => {}
  },
  TerminalCols: {
    type: Number,
    default: 43
  },
  isShowClose: {
    type: Boolean,
    default: true
  },
  isPropFullScreen: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['toMark', 'operationalDocument', 'backList', 'fullScreen', 'exitFullScreen', 'seeProcess'])

const term = ref(null)
const terminalSocket = ref(null)
const refreshTer = ref(true)
const isFullScreen = ref(false)

watch(
  () => props.isPropFullScreen,
  () => {
    if (!props.isPropFullScreen) {
      exitFullScreen()
    }
  }
)

watchEffect(() => {
  if (props.isPropFullScreen) {
    isFullScreen.value = true
  }
})

const toMark = () => {
  emit('toMark')
}

const seeProcess = () => {
  emit('seeProcess')
}

const operationalDocument = () => {
  emit('operationalDocument')
}

const backList = () => {
  emit('backList')
}

const fullScreen = () => {
  term.value.resize(term.value.cols, 50)
  isFullScreen.value = true
  emit('fullScreen')
}

const exitFullScreen = () => {
  term.value.resize(term.value.cols, 43)
  isFullScreen.value = false
  emit('exitFullScreen')
}

const runRealTerminal = () => {
  console.log('webSocket is finished')
}

// const errorRealTerminal = () => {
//   console.log('error')
// }
// const closeRealTerminal = () => {
//   console.log('close')
// }

// const closeTermmail = () => {
//   refreshTer.value = false
//   emit('closeTermmail')
// }

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  refreshTer.value = true
  const { name, id } = props.termmailInfo
  console.log('pid : ' + props.terminal.pid + ' is on ready')
  let terminalContainer = document.getElementById('terminal')
  term.value = new Terminal({
    rendererType: 'canvas', //渲染类型
    cursorBlink: true, //光标闪烁
    // cursorStyle: "underline", //光标样式
    disableStdin: false, // 启用输入
    scrollback: 50, //终端中的回滚量
    convertEol: true, //启用时，光标将设置为下一行的开头
    theme: {
      foreground: '#ECECEC', //字体
      background: '#000000', //背景色
      cursor: 'help', //设置光标
      lineHeight: 20
    }
  })
  term.value.resize(term.value.cols, props.TerminalCols)
  term.value.open(terminalContainer)
  // open websocket
  terminalSocket.value = new WebSocket(`ws://${import.meta.env.VITE_XTERM_URL}/ws/chat/${name}/${id}`)
  console.log('dada', terminalSocket.value)
  terminalSocket.value.onopen = runRealTerminal
  // terminalSocket.value.onclose = closeRealTerminal
  // terminalSocket.value.onerror = errorRealTerminal
  term.value.attach(terminalSocket.value)
  term.value._initialized = true
})
// name: 'Console',
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
  terminalSocket.value = null
  term.value = null
})
function handleKeyDown(event) {
  // 忽略其他按键，只处理可见字符
  if (event.key.length !== 1) {
    return
  }
  // 将输入的字符发送到终端
  const char = event.key
  if (term.value) {
    term.value.write(char)
  }
}
</script>

<style lang="scss" scoped>
.console-wrap {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  height: 80vh;
  .console {
    // margin-top: 45px;
    height: 100%;
    :deep(.xterm-text-layer) {
      width: 100%;
      height: 80vh;
    }
    :deep(.terminal) {
      height: 80vh;
    }
    ::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  }
  .ignore-button1 {
    top: 40px;
    right: 10px;
    position: absolute;
  }
  .ignore-button2 {
    top: 80px;
    right: 10px;
    position: absolute;
  }
  .ignore-button3 {
    top: 120px;
    right: 10px;
    position: absolute;
  }
  .ignore-button4 {
    top: 160px;
    right: 10px;
    position: absolute;
  }
  .ignore-button5 {
    top: 200px;
    right: 10px;
    position: absolute;
  }
}
</style>

<style>
.xterm-screen,
.xterm-cursor-layer,
.xterm-link-layer,
.xterm-selection-layer,
.xterm-text-layer {
  height: 100% !important;
}
</style>
