<script setup lang="ts">
import BasicForm from './basic-form.vue'
import BasicTable from './basic-table.vue'
import BasicPagination from './basic-pagination.vue'

const visible = ref(false)
</script>

<template>
  <el-card class="mb-2">
    <template #header>表单和多个表格</template>

    <el-button @click="visible = true">打开对话框</el-button>
  </el-card>

  <el-dialog v-model="visible" title="对话框" :width="1280" align-center body-class="w-dialog-body">
    <div class="flex grow flex-col min-w-0">
      <basic-form :style="{ borderBottom: 'var(--w-border)' }"></basic-form>
      <div class="flex grow min-h-0">
        <basic-table class="-mb-px"></basic-table>
        <div class="ml-2 flex w-3/5 flex-col pb-2">
          <basic-table :style="{ borderBottom: 'var(--w-border)' }"></basic-table>
          <basic-pagination class="mt-2"></basic-pagination>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button type="primary">确认</el-button>
      <el-button>取消</el-button>
    </template>
  </el-dialog>
</template>
