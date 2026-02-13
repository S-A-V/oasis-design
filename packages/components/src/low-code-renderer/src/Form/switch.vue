<script setup>
import { watchEffect } from 'vue';
import { ElSwitch, ElFormItem } from 'element-plus';

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
  activeValue: {
    type: [Boolean, String],
    default: true,
  },
  inactiveValue: {
    type: [Boolean, String],
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
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
    <el-switch
      v-model="form[field]"
      :active-value="activeValue"
      :disabled="disabled"
      :inactive-value="inactiveValue"
    />
  </el-form-item>
</template>
