<script setup lang="ts">
defineOptions({
  name: 'LocalDisabledStatus',
})
</script>

<template>
  <el-card class="mb-2">
    <template #header>禁用状态</template>

    <el-button type="primary" disabled>确认</el-button>
    <el-button disabled>取消</el-button>
    <el-button type="primary" plain disabled>查看详情</el-button>
    <el-button type="primary" plain size="small" disabled>编辑</el-button>
    <el-button size="small" disabled>编辑</el-button>
    <el-button class="violet" plain disabled>呼叫</el-button>
    <el-button type="warning" plain disabled>延后</el-button>
    <el-button type="success" plain disabled>恢复</el-button>
    <el-button type="danger" plain disabled>暂停</el-button>
  </el-card>
</template>
