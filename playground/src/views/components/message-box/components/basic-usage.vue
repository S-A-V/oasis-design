<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'

const open = () => {
  ElMessageBox.confirm(
    'proxy will permanently delete the file. Continue?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({type: 'success',message: 'Delete completed',})
    })
    .catch(() => {
      ElMessage({type: 'info',message: 'Delete canceled',})
    })
}
</script>

<template>
  <el-card class="mb-2">
    <template #header>基础用法</template>

    <div>
      <el-button plain @click="open">Click to open the Message Box</el-button>
    </div>
  </el-card>
</template>
