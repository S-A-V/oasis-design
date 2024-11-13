<template>
  <component :is="type" v-bind="linkProps()">
    <slot />
  </component>
</template>

<script setup>
import { computed, getCurrentInstance } from 'vue';

const props = defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
});

const { proxy } = getCurrentInstance();

const isExt = computed(() => {
  return proxy.$validator.isExternalLink(props.to);
});

const type = computed(() => {
  if (isExt.value) {
    return 'a';
  }
  return 'router-link';
});

function linkProps() {
  if (isExt.value) {
    return {
      href: props.to,
      target: '_blank',
      rel: 'noopener',
    };
  }
  return {
    to: props.to,
  };
}
</script>
