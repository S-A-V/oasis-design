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
  <div class="flex flex-col grow overflow-y-hidden">
    <w-form-header title="表格" class="shrink-0">
      <template #extra>
        <el-button size="small">导出</el-button>
      </template>
    </w-form-header>

    <el-table :data="tableData" stripe border>
      <el-table-column prop="name" label="昵称" width="180" />
      <el-table-column prop="date" label="创建日期" width="180" />
      <el-table-column prop="address" label="家庭地址" />
    </el-table>

    <template v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </div>
</template>
