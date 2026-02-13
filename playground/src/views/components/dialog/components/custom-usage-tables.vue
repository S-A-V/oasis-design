<script setup lang="ts">
import BasicTable from './basic-table.vue'

const visible = ref(false)
</script>

<template>
  <el-card class="mb-2">
    <template #header>多个表格</template>

    <el-button @click="visible = true">打开对话框</el-button>
  </el-card>

  <el-dialog v-model="visible" title="对话框" :width="1280" align-center body-class="w-dialog-body">
    <div class="flex grow min-w-0">
      <basic-table class="!grow-0 w-2/5"></basic-table>
      <basic-table class="ml-2"></basic-table>
    </div>
  </el-dialog>
</template>
