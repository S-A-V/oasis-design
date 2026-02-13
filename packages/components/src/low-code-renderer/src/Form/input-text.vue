<script setup>
import { watchEffect } from 'vue';
import { ElInput, ElFormItem } from 'element-plus';

const form = defineModel('form', { required: true, type: Object });

const props = defineProps({
  // form: Object,
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
  maxlength: {
    type: String,
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
    <el-input
      v-model="form[field]"
      :placeholder="placeholder || '请输入'"
      :disabled="disabled"
      :maxlength="maxlength"
    >
    </el-input>
  </el-form-item>
</template>
