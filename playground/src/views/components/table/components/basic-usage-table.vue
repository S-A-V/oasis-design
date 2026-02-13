<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { date: '2016-05-10', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { date: '2016-05-09', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { date: '2016-05-08', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { date: '2016-05-07', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { date: '2016-05-06', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { date: '2016-05-05', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { date: '2016-05-04', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { date: '2016-05-03', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { date: '2016-05-02', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { date: '2016-05-01', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
])
</script>

<template>
  <w-table-container>
    <el-table :data="tableData" stripe border highlight-current-row :style="{ height: '100%' }">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </w-table-container>
</template>
