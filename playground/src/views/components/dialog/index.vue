<script setup lang="ts">
import {
  CustomUsageForm,
  CustomUsageTable,
  CustomUsageTables,
  CustomUsageFormAndTable,
  CustomUsageFormAndTables,
} from './components'
</script>

<template>
  <w-container>
    <el-scrollbar class="pr-2 pl-2">
      <custom-usage-form></custom-usage-form>
      <custom-usage-table></custom-usage-table>
      <custom-usage-tables></custom-usage-tables>
      <custom-usage-form-and-table></custom-usage-form-and-table>
      <custom-usage-form-and-tables></custom-usage-form-and-tables>
    </el-scrollbar>
  </w-container>
</template>
