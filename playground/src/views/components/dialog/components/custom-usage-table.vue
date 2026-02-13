<script setup lang="ts">
import BasicTable from './basic-table.vue'

const visible = ref(false)
</script>

<template>
  <el-card class="mb-2">
    <template #header>表格</template>

    <el-button @click="visible = true">打开对话框</el-button>
  </el-card>

  <el-dialog v-model="visible" title="对话框" :width="680" align-center body-class="w-dialog-body">
    <basic-table></basic-table>
  </el-dialog>
</template>
