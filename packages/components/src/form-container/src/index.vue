<script setup>
import { computed } from 'vue';

defineOptions({
  name: 'WFormContainer',
});

const props = defineProps({
  // 指定列数
  columns: {
    type: Number,
    default: undefined,
  },
  // 指定容器内边距
  padding: {
    type: Array,
    default: undefined,
  },
  // 每行间距
  rowGap: {
    type: Number,
    default: undefined,
  },
});

const DEFAULT_COLUMNS = 2;
const DEFAULT_PADDING = [24, 48, 24, 24];
const DEFAULT_ROW_GAP = DEFAULT_PADDING[0];

function formatPadding(padding) {
  const [top, right = top, bottom = top, left = right] = padding;
  return [top, right, Math.max(bottom - _rowGap.value, 0), left];
}

const _columns = computed(() => {
  if (props.columns) return props.columns;
  return DEFAULT_COLUMNS;
});

const _padding = computed(() => {
  if (props.padding) return props.padding;
  return DEFAULT_PADDING;
});

const _rowGap = computed(() => {
  if (props.rowGap) return props.rowGap;
  if (_padding.value) return _padding.value[0] || DEFAULT_ROW_GAP;
  return DEFAULT_ROW_GAP;
});

const layout = computed(() => {
  return {
    columns: _columns.value,
    padding: formatPadding(_padding.value)
      .map((v) => `${v}px`)
      .join(' '),
    rowGap: `${_rowGap.value}px`,
  };
});
</script>

<template>
  <div class="w-form-container">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.w-form-container {
  --columns: v-bind('layout.columns');

  .el-form:has(> .el-form-item),
  .w-form-item-group {
    display: grid;
    grid-template-columns: repeat(var(--columns), 1fr);
    gap: 0;
    padding: v-bind('layout.padding');
    background-color: var(--el-fill-color-blank);
  }

  + .w-form-header {
    border-top: 1px solid var(--el-border-color-light);
  }

  .el-form-item {
    align-self: flex-start;
    margin-right: 0;
    margin-bottom: v-bind('layout.rowGap');
  }
}
</style>
