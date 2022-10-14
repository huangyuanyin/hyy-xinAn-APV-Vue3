<template>
  <el-table :data="casesTableData" :border="parentBorder" style="width: 100%" stripe>
    <el-table-column type="expand">
      <template #default="props">
        <div m="4">
          <h3>模块数详情：</h3>
          <el-table style="width: 100%;margin: 10px;" v-if="props.row.headList.length>0" :data="props.row.valueList"
            :border="childBorder" :show-header="true">
            <el-table-column v-for="(item, index) in props.row.headList.slice(0,10)" :key="index" :prop="item.value"
              :label="item.key" align="center">
            </el-table-column>
          </el-table>
          <el-table style="width: 100%;margin: 10px;" v-if="props.row.headList.length>9" :data="props.row.valueList"
            :border="childBorder" :show-header="true">
            <el-table-column prop="runCase" label="模块名" align="center">runCase</el-table-column>
            <el-table-column v-for="(item, index) in props.row.headList.slice(10,19)" :key="index" :prop="item.value"
              :label="item.key" align="center">
            </el-table-column>
          </el-table>
          <el-table style="width: 100%;margin: 10px;" v-if="props.row.headList.length>19" :data="props.row.valueList"
            :border="childBorder" :show-header="true">
            <el-table-column prop="runCase" label="模块名" align="center">runCase</el-table-column>
            <el-table-column v-for="(item, index) in props.row.headList.slice(19,28)" :key="index" :prop="item.value"
              :label="item.key" align="center">
            </el-table-column>
          </el-table>
          <el-table style="width: 100%;margin: 10px;" v-if="props.row.headList.length>28" :data="props.row.valueList"
            :border="childBorder" :show-header="true">
            <el-table-column prop="runCase" label="模块名" align="center">runCase</el-table-column>
            <el-table-column v-for="(item, index) in props.row.headList.slice(28,37)" :key="index" :prop="item.value"
              :label="item.key" align="center">
            </el-table-column>
          </el-table>
          <el-table style="width: 100%;margin: 10px;" v-if=" props.row.headList.length>=37" :data="props.row.valueList"
            :border="childBorder" :show-header="true">
            <el-table-column prop="runCase" label="模块名" align="center">runCase</el-table-column>
            <el-table-column v-for="(item, index) in props.row.headList.slice(37,46)" :key="index" :prop="item.value"
              :label="item.key" align="center">
            </el-table-column>
          </el-table>
          <el-table style="width: 100%;margin: 10px;" v-if="props.row.headList.length>=47" :data="props.row.valueList"
            :border="childBorder" :show-header="true">
            <el-table-column prop="runCase" label="模块名" align="center">runCase</el-table-column>
            <el-table-column v-for="(item, index) in props.row.headList.slice(46,55)" :key="index" :prop="item.value"
              :label="item.key" align="center">
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
const casesTableData = ref([])

const optionsProps = {
  label: 'name',
  value: 'name'
}
// 调用 获取用例集接口
const getCase = async () => {
  let res = await getCaseApi()
  res.data.map((item) => {
    item.headList = [],
      item.valueList = [],
      item.moduleLength = item.children.length
  })
  casesTableData.value = res.data || []
  await handleData(casesTableData.value)
}

// 处理用例集数据展示
const handleData = (data) => {
  data.map((val) => {
    let headList: any = [{ key: '模块名', value: 'taghead' }];
    let valueList: any = [
      {
        taghead: 'runCase',
      },
    ];
    val.children.map((v: any) => {
      headList.push({
        key: String(v.name),
        value: String(v.name),
      });
      valueList[0][`${v.name}`] = v.value;
    });
    val.headList = headList;
    val.valueList = valueList;
  });
}

onMounted(() => {
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