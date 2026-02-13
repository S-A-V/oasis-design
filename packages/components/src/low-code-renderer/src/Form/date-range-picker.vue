<script setup>
import { watchEffect } from 'vue';
import { ElDatePicker, ElFormItem } from 'element-plus';

const form = defineModel('form', { required: true, type: Object });

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  labelWidth: String,

  pickerType: {
    type: String,
    required: true,
  },
  field: {
    type: String,
    required: true,
  },
  valueFormat: {
    type: String,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD',
  },
  startPlaceholder: {
    type: String,
    default: '开始日期',
  },
  endPlaceholder: {
    type: String,
    default: '结束日期',
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
    <el-date-picker
      v-model="form[field]"
      :clearable="clearable"
      :type="pickerType"
      :start-placeholder="startPlaceholder || '开始日期'"
      :end-placeholder="endPlaceholder || '结束日期'"
      :format="format"
      :value-format="valueFormat"
    />
  </el-form-item>
</template>
