<template>
  <div class="console-wrap">
    <div class="console" id="terminal" v-if="refreshTer"></div>
    <el-button v-if="isShowClose" type="primary" link @click="closeTermmail">关闭终端</el-button>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Terminal from '../config/Xterm'

const emit = defineEmits(['closeTermmail'])
const props = defineProps({
  terminal: {
    type: Object,
    default: {
      pid: 1,
      name: 'terminal',
      cols: 400,
      rows: 400
    }
  },
  termmailInfo: {
    type: Object,
    default: () => {}
  },
  TerminalCols: {
    type: Number,
    default: 40
  },
  isShowClose: {
    type: Boolean,
    default: true
  }
})

const term = ref(null)
const terminalSocket = ref(null)
const refreshTer = ref(true)

// const runRealTerminal = () => {
//   console.log('webSocket is finished')
// }
// const errorRealTerminal = () => {
//   console.log('error')
// }
// const closeRealTerminal = () => {
//   console.log('close')
// }

const closeTermmail = () => {
  refreshTer.value = false
  emit('closeTermmail')
}

onMounted(() => {
  refreshTer.value = true
  const { uname, passw, ip } = props.termmailInfo
  console.log('pid : ' + props.terminal.pid + ' is on ready')
  let terminalContainer = document.getElementById('terminal')
  term.value = new Terminal({
    rendererType: 'canvas', //渲染类型
    cursorBlink: true, //光标闪烁
    // cursorStyle: "underline", //光标样式
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
  terminalSocket.value = new WebSocket(`ws://${import.meta.env.VITE_XTERM_URL}/terminal/wensock?host_ip=${ip}&host_por=22&user=${uname}&passwd=${passw}`)
  console.log('dada', terminalSocket.value)
  // terminalSocket.value.onopen = runRealTerminal
  // terminalSocket.value.onclose = closeRealTerminal
  // terminalSocket.value.onerror = errorRealTerminal
  term.value.attach(terminalSocket.value)
  term.value._initialized = true
})
// name: 'Console',
onBeforeUnmount(() => {
  terminalSocket.value = null
  term.value = null
})
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
      height: 100%;
    }
    :deep(.terminal) {
      height: 100%;
    }
    ::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  }
  .el-button {
    right: 5px;
    position: absolute;
  }
}
</style>
