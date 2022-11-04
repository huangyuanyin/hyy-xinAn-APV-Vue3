<template>
  <div id='com-container' class="com-container">
    <h2>任务列表</h2>
    <el-table :data="tableData" border style="width: 100%;" class="taskTable"
      :header-cell-style="{background:'rgba(7, 10, 88, 0.99) ',color: '#fff'}"
      :row-style="{background:'rgba(3, 14, 70, 0.5)',color: '#fff'}">
      <el-table-column prop="date" label="Date" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </div>
</template>

<script lang='ts' setup>
import { onMounted, inject } from 'vue'
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
onMounted(async () => {
})

</script>

<style lang="scss" scoped>
.com-container {
  background-color: rgba(3, 14, 70, 0.5) !important;
  height: 100%;
  padding: 0 20px;

  h2 {
    color: #007bff !important;
    text-align: center;
    margin: 0;
    line-height: 40px;
  }
}

::v-deep(.el-table) {
  background-color: rgba(3, 14, 70, 0.5) !important;

  .el-table__header {
    background-color: rgba(3, 14, 70, 0.5) !important;
  }
}

::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color: rgba(3, 14, 70, 0.5);
}
</style>

<style lang="scss">

</style>