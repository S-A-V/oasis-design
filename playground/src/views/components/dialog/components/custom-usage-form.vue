<script setup lang="ts">
import BasicForm from './basic-form.vue'

const visible = ref(false)
</script>

<template>
  <el-card class="mb-2">
    <template #header>表单</template>

    <el-button @click="visible = true">打开对话框</el-button>
  </el-card>

  <el-dialog v-model="visible" title="对话框" :width="680" align-center body-class="w-dialog-body">
    <div class="overflow-y-auto">
      <basic-form></basic-form>
      <w-form-header title="用户资料"></w-form-header>
      <w-descriptions :column="2" class="py-4 pr-6">
        <w-descriptions-item label="姓名">王嘉尔</w-descriptions-item>
        <w-descriptions-item label="性别">男</w-descriptions-item>
        <w-descriptions-item label="家庭地址">中国香港</w-descriptions-item>
        <w-descriptions-item label="职业">歌手</w-descriptions-item>
      </w-descriptions>
    </div>

    <template #footer>
      <el-button type="primary">确认</el-button>
      <el-button>取消</el-button>
    </template>
  </el-dialog>
</template>
