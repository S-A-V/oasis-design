<script setup>
defineOptions({
  name: 'WFormHeader',
});

defineProps({
  title: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div class="w-form-header">
    <div class="w-form-header-title">
      <slot name="title">{{ title }}</slot>
    </div>

    <div v-if="$slots.extra" class="w-form-header-extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<style lang="scss">
.w-form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 12px;

  &::before {
    display: inline-block;
    width: 6px;
    height: 14px;
    margin-right: 8px;
    content: '';
    background-color: var(--el-color-primary);
  }

  &-title {
    flex-grow: 1;
    font-size: 14px;
    font-weight: bold;
    line-height: 20px;
    color: var(--el-text-color-primary);
  }

  + .w-form-container {
    border-top: 1px solid var(--el-border-color-light);
  }
}
</style>
