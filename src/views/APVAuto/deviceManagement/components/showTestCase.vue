<template>
  <el-cascader-panel class="testCase" :props="optionsProps" :options="options">
    <template #default="{ node, data }">
      <span>{{ data.name }}</span>
      <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
    </template>
  </el-cascader-panel>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { getCaseApi } from '@/api/APV/taskManagement.js'

const optionsProps = {
  label: 'name',
  value: 'name'
}
const options = ref([])

// 调用 获取用例集接口
const getCase = async () => {
  let res = await getCaseApi()
  options.value = res.data || []
}

getCase()

</script>

<style scoped lang="scss">
.testCase {
  height: 70vh;

  :deep(.el-scrollbar .el-cascader-menu__wrap) {
    height: 100%;
  }
}
</style>