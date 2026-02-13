<script setup>
import { watchEffect } from 'vue';
import { ElInputNumber, ElFormItem } from 'element-plus';

const form = defineModel('form', { required: true, type: Object });

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  labelWidth: String,

  field: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '请输入',
  },
  min: {
    type: Number,
    default: -Infinity,
  },
  max: {
    type: Number,
    default: Infinity,
  },
  _change: String,
});

const emit = defineEmits(['_change']);

watchEffect(() => {
  if (form.value[props.field]) {
    if (props?._change) {
      emit('_change', props._change, form.value[props.field]);
    }
  }
});
const genContent = () => {
  return {
    label: props.label,
    value: form.value[props.field],
  };
};
defineExpose({
  genContent: genContent,
});
</script>

<template>
  <el-form-item :label="label" :prop="field" :label-width="labelWidth">
    <el-input-number
      v-model="form[field]"
      :placeholder="placeholder || '请输入'"
      :min="min"
      :max="max"
      :disabled="disabled"
    />
  </el-form-item>
</template>
