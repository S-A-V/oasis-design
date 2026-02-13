<script setup>
import { computed, inject } from 'vue';
import { addUnit } from '@way-ui/internal-utils';

defineOptions({
  name: 'WDescriptionsItem',
});

const props = defineProps({
  // 占据的列数
  span: {
    type: Number,
    default: 1,
    validator: (value) => value >= 1,
  },
  // 标签文本
  label: {
    type: String,
    default: '',
  },
  // 标签宽度
  labelWidth: {
    type: [String, Number],
    default: '',
  },
});

const descriptions = inject('descriptionsKey', {});

const labelStyle = computed(() => {
  const width = addUnit(props.labelWidth || descriptions.labelWidth || '');
  if (width) return { width };
  return {};
});

const currentLabel = computed(() => `${props.label || ''}${descriptions?.labelSuffix || ''}`);
</script>

<template>
  <div class="w-descriptions-item" :class="[props.span > 1 && `col-span-${props.span}`]">
    <div class="w-descriptions-item-label" :style="labelStyle">
      {{ currentLabel }}
    </div>
    <div class="w-descriptions-item-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
.w-descriptions-item {
  display: flex;

  &-label {
    display: inline-flex;
    flex-shrink: 0;
    justify-content: flex-end;
    padding-right: 4px;
    line-height: 20px;
  }

  &-content {
    display: flex;
    flex-grow: 1;
    min-width: 0;
    line-height: 20px;
    word-break: break-all;
  }
}
</style>
