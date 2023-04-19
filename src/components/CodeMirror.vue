<template>
  <!-- :indent-with-tab="true" 是否自动获取焦点-->
  <codemirror v-model="props.code" placeholder="Code gose here..." :style="{ height: '50vh' }" :autofocus="true" :tabSize="2" :extensions="extensions" v-bind:disabled="true" />
</template>
<!-- @ready="ready('ready', $event)" @change="Change('change', $event)" @focus="focus('focus', $event)" @blur="blur('blur', $event)" -->
<script lang="ts" setup>
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { onMounted, ref, watch } from 'vue'
import { EditorView } from '@codemirror/view'

const props = defineProps({
  code: {
    type: String,
    default: ''
  }
})

let myTheme = EditorView.theme(
  {
    '&': {
      color: '#fff',
      backgroundColor: '#000'
    },
    '.cm-content': {
      caretColor: '#fff',
      color: 'white' // 所有内容为白色
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: '#fff'
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: '#fff'
    },
    '.cm-gutters': {
      backgroundColor: '#000',
      color: '#fff',
      border: 'none'
    },
    '.cm-scroller': {
      backgroundColor: 'black' // 防止高亮
    },
    '.cm-number': {
      color: 'white' // 数字也设置为白色
    }
  },
  { dark: true }
)

const editorOptions = ref({
  readOnly: true, // 禁止文本输入
  cursorBlinkRate: -1 // 禁止光标闪烁
})

const extensions = [oneDark]

const Change = () => {}

onMounted(() => {})
</script>
