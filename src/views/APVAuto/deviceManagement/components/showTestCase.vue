<template>
  <el-card shadow="never" style="margin-top: 10px">
    <el-button type="primary" style="margin-bottom: 10px" @click="refresh">更新用例清单</el-button>
    <el-table :data="casesTableData" :border="false" style="width: 100%" stripe v-loading="isRefreshLoading" element-loading-text="更新用例集中，请稍等哦...">
      <el-table-column type="expand">
        <template #default="props">
          <div m="4">
            <h3>模块数详情：</h3>
            <div class="card-wrap">
              <el-card v-for="index in Math.ceil(props.row.children.length / 12)" :key="index">
                <el-table style="margin: 10px" :data="props.row.children.slice((index - 1) * 12, index * 12)" :border="childBorder" :show-header="true">
                  <el-table-column prop="name" label="模块名"></el-table-column>
                  <el-table-column prop="value" label="数量"></el-table-column>
                </el-table>
              </el-card>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="版本名" prop="name" />
      <el-table-column label=" 用例数" prop="value" />
      <el-table-column label="模块数" prop="moduleLength" />
    </el-table>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { getCaseApi, getCaseRefreshApi } from '@/api/APV/taskManagement.js'

const childBorder = ref(false)
const isRefreshLoading = ref(false)
const casesTableData = ref([])

const optionsProps = {
  label: 'name',
  value: 'name'
}
// 调用 获取用例集接口
const getCase = async (isTrue) => {
  isRefreshLoading.value = true
  let res = isTrue ? await getCaseRefreshApi() : await getCaseApi()
  isRefreshLoading.value = false
  res.data.map((item) => {
    ;(item.headList = []), (item.valueList = []), (item.moduleLength = item.children.length)
  })
  casesTableData.value = res.data || []
  // await handleData(casesTableData.value)
}

// 处理用例集数据展示
const handleData = (data) => {
  data.map((val) => {
    let headList: any = [{ key: '模块名', value: 'taghead' }]
    let valueList: any = [
      {
        taghead: '数量'
      }
    ]
    val.children.map((v: any) => {
      headList.push({
        key: String(v.name),
        value: String(v.name)
      })
      valueList[0][`${v.name}`] = v.value
    })
    val.headList = headList
    val.valueList = valueList
  })
}

const refresh = () => {
  getCase(true)
}

onMounted(() => {
  getCase(false)
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

.card-wrap {
  display: flex;
  flex-wrap: wrap;

  .el-card {
    width: 21%;
    margin-bottom: 10px;
    margin-left: 20px;
    margin-right: 20px;
  }

  :deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
    border-bottom: none;
  }
}
</style>
