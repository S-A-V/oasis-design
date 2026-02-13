<script setup>
defineOptions({
  name: 'ChartContainer',
});
</script>

<template>
  <div class="chart-container">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.chart-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 12px;
  padding: 0 8px;
}
</style>
