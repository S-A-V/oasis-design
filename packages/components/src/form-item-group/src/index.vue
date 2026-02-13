<script setup>
import { WFormContainer } from '../../form-container';
import { WFormHeader } from '../../form-header';

defineOptions({
  name: 'WFormItemGroup',
});

defineProps({
  title: {
    type: String,
    default: '',
  },
  layoutOptions: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<template>
  <slot v-if="title || $slots.title" name="title">
    <w-form-header :title="title" />
  </slot>

  <w-form-container v-bind="layoutOptions">
    <div class="w-form-item-group">
      <slot></slot>
    </div>
  </w-form-container>
</template>
