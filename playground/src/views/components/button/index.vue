<script setup lang="ts">
import {
  ElementPlusBasicUsage,
  ElementPlusDisabledStatus,
  ElementPlusLinkButton,
  ElementPlusTextButton,
  ElementPlusButtonGroup,
  ElementPlusLoadingButton,
  LocalBasicUsage,
  LocalDisabledStatus,
} from './components'
</script>

<template>
  <w-container>
    <el-scrollbar class="pr-2 pl-2">
      <local-basic-usage></local-basic-usage>
      <local-disabled-status></local-disabled-status>
      <el-divider></el-divider>
      <element-plus-basic-usage></element-plus-basic-usage>
      <element-plus-disabled-status></element-plus-disabled-status>
      <element-plus-link-button></element-plus-link-button>
      <element-plus-text-button></element-plus-text-button>
      <element-plus-button-group></element-plus-button-group>
      <element-plus-loading-button></element-plus-loading-button>
    </el-scrollbar>
  </w-container>
</template>
