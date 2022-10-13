<template>
  <el-table :data="casesTableData" :border="parentBorder" style="width: 100%">
    <el-table-column type="expand">
      <template #default="props">
        <div m="4">
          <h3>模块数详情：</h3>
          <el-table style="width: 100%" :data="props.row.children" :border="childBorder" :show-header="false">
            <el-table-column v-for="(item, index) in casesHeaders" :key="index" :prop="item.prop" :label="item.label">
            </el-table-column>
          </el-table>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="版本名" prop="name" />
    <el-table-column label=" 用例数" prop="value" />
    <el-table-column label="模块数" prop="moduleLength" />
  </el-table>
</template>

<script lang='ts' setup>
import { ref, computed, onMounted } from 'vue'
import { getCaseApi } from '@/api/APV/taskManagement.js'

const parentBorder = ref(false)
const childBorder = ref(true)
const casesHeaders = ref([
  {
    prop: 'name',
    label: '模块名',
  },
  {
    prop: 'value',
    label: 'runCase数',
  }
])
const casesTableData = ref([])

const getHeaders = computed(() => {
  //["title", "模块名", "runCase"]
  return casesTableData.value.reduce((pre, cur, index) => pre.concat(`value${index}`), ['title'])
})

// watch(() => props.row.children,)

const getValues = computed(() => {
  return casesHeaders.value.map((item) => {
    console.log("casesTableData.value", casesTableData.value);
  })
})

const optionsProps = {
  label: 'name',
  value: 'name'
}
// 调用 获取用例集接口
const getCase = async () => {
  let res = await getCaseApi()
  casesTableData.value = res.data || []
  await handleData(casesTableData.value)
}

// 改造 用例集数据
const handleData = (data) => {
  console.log("data", data);

  data.map((item) => {
    item.moduleLength = item.children.length
  })
}

onMounted(() => {
  console.log("get", getValues);

  getCase()
})

</script>

<style scoped lang="scss">
.testCase {
  height: 70vh;

  :deep(.el-scrollbar .el-cascader-menu__wrap) {
    height: 100%;
  }
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>