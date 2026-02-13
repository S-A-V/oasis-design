<script setup lang="ts">
import { BasicUsage, BasicUsageRange } from './components'
</script>

<template>
  <w-container>
    <el-scrollbar class="pr-2 pl-2">
      <basic-usage></basic-usage>
      <basic-usage-range></basic-usage-range>
    </el-scrollbar>
  </w-container>
</template>
