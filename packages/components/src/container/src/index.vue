<template>
  <div :class="['w-container', `is-${direction}`]">
    <div class="w-container-header">
      <slot name="header">
        <w-breadcrumb />
      </slot>
    </div>

    <div class="w-container-main">
      <slot></slot>
    </div>

    <div v-if="$slots.footer" class="w-container-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { WBreadcrumb } from '../../breadcrumb';

defineOptions({
  name: 'WContainer',
});

defineProps({
  direction: {
    type: String,
    default: 'vertical', // vertical | horizontal
  },
});
</script>

<style lang="scss">
.w-container {
  display: flex;
  flex-direction: column;
  height: 100%;

  &.is-horizontal {
    flex-direction: row;
  }

  &-header {
    flex-shrink: 0;
  }

  &-main {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 0;

    > .w-table-container {
      + .w-pagination-container {
        padding-top: 0;
      }
    }
  }

  &-footer {
    flex-shrink: 0;
  }
}
</style>
