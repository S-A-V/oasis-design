<script setup lang="ts">
import type { ButtonProps, ButtonEmits } from './types'

defineOptions({ name: 'OsDemoButton' })

const props = withDefaults(defineProps<ButtonProps>(), {
  // 必传的属性不需要定义默认值，只需要定义类型即可
  disabled: false,
})
const emit = defineEmits<ButtonEmits>()

const handleClick = (e: MouseEvent) => {
  emit('click', e)
}
</script>

<template>
  <el-button :disabled="props.disabled" @click="handleClick">
    <slot></slot>
  </el-button>
</template>

<style lang="scss">
@use './styles/index';
</style>
