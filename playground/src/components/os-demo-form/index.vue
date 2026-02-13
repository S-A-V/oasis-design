<script setup lang="ts">
import FormItem from './components/form-item.vue'
import type { FormProps, FormEmits } from './types'

defineOptions({ name: 'OsDemoForm' })

const props = withDefaults(defineProps<FormProps>(), {
  // 必传的属性不需要定义默认值，只需要定义类型即可
  disabled: false,
})
defineEmits<FormEmits>()
</script>

<template>
  <div class="os-demo-form">
    <form-item label="姓名" :disabled="props.disabled"></form-item>
  </div>
</template>

<style lang="scss">
@use './styles/index';
</style>
