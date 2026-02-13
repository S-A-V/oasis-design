<script setup lang="ts">
import BasicForm from './basic-form.vue'
import BasicTable from './basic-table.vue'
import BasicPagination from './basic-pagination.vue'

const visible = ref(false)
</script>

<template>
  <el-card class="mb-2">
    <template #header>表单和表格</template>

    <el-button @click="visible = true">打开对话框</el-button>
  </el-card>

  <el-dialog v-model="visible" title="对话框" :width="680" align-center body-class="w-dialog-body">
    <div class="flex grow flex-col">
      <basic-form></basic-form>
      <basic-table></basic-table>
      <basic-pagination class="mt-2 mb-2"></basic-pagination>
    </div>

    <template #footer>
      <el-button type="primary">确认</el-button>
      <el-button>取消</el-button>
    </template>
  </el-dialog>
</template>
