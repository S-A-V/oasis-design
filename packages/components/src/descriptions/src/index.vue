<script setup>
import { provide } from 'vue';

defineOptions({
  name: 'WDescriptions',
});

const props = defineProps({
  // 列数
  column: {
    type: Number,
    default: 4,
  },
  // 标签宽度
  labelWidth: {
    type: [String, Number],
    default: '124px',
  },
  // 标签后缀
  labelSuffix: {
    type: String,
    default: '：',
  },
});

provide('descriptionsKey', props);
</script>

<template>
  <div class="w-descriptions">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.w-descriptions {
  --column: v-bind('props.column');

  display: grid;
  grid-template-columns: repeat(var(--column), 1fr);
  row-gap: 12px;
  font-size: 14px;
  color: var(--el-text-color-primary);
  background-color: var(--el-fill-color-blank);
}
</style>
