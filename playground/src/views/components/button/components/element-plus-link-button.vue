<script setup lang="ts">
const buttons = [
  { type: '', text: 'plain' },
  { type: 'primary', text: 'primary' },
  { type: 'success', text: 'success' },
  { type: 'info', text: 'info' },
  { type: 'warning', text: 'warning' },
  { type: 'danger', text: 'danger' },
] as const
</script>

<template>
  <el-card class="mb-2">
    <template #header>链接按钮</template>

    <div class="mb-4">
      <el-button v-for="button in buttons" :key="button.text" :type="button.type" link>
        {{ button.text }}
      </el-button>
    </div>

    <div>
      <el-button v-for="button in buttons" :key="button.text" :type="button.type" link disabled>
        {{ button.text }}
      </el-button>
    </div>
  </el-card>
</template>
