<script setup lang="ts">
import { BasicUsage, CustomUsage } from './components'
</script>

<template>
  <w-container>
    <el-scrollbar class="pr-2 pl-2">
      <basic-usage></basic-usage>
      <custom-usage></custom-usage>
    </el-scrollbar>
  </w-container>
</template>
