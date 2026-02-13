<script setup lang="ts">
import type { FormItemProps } from './form-item'

const props = defineProps<FormItemProps>()
</script>

<template>
  <div class="form-item">
    <div class="form-item-label">{{ props.label }}</div>
    <div>form-item</div>
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/form-item';
</style>
