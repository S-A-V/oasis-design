<script setup>
import { watchEffect } from 'vue';
import { ElDatePicker, ElFormItem } from 'element-plus';
import { computed } from 'vue';
import { base64ToUtf8 } from '../utils';

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
  clearable: {
    type: Boolean,
    default: false,
  },
  field: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD',
  },
  disabledDateFunc: {
    type: Function,
  },
  valueFormat: {
    type: String,
  },
  placeholder: {
    type: String,
    default: '请选择日期',
  },
  _change: String,
});

const emit = defineEmits(['_change']);
let disabledDate = computed(() => {
  if (props.disabledDateFunc) {
    const disabledDateExp = new Function(base64ToUtf8(props.disabledDateFunc));
    return disabledDateExp()(form);
  }
  return null;
});

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
      :placeholder="placeholder || '请选择'"
      :value-format="valueFormat"
      :format="format"
      :disabled-date="disabledDate"
    />
  </el-form-item>
</template>
