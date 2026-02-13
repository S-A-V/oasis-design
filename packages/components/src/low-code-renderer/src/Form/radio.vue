<script setup>
import { ref, watchEffect, inject } from 'vue';
import { ElRadio, ElRadioGroup, ElFormItem } from 'element-plus';

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
  options: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  _change: String,
  params: String,

  source: String,
  labelKey: String,
  valueKey: String,
  mapEnv: Function,
  getEnv: Function,
});
const emit = defineEmits(['_change', '_mounted']);
const _fetch = inject('_fetch');
const radioOptions = ref([]);
const initOption = async () => {
  if (props.source) {
    await props.getEnv();
    _fetch({
      url: props.mapEnv(props.source),
      method: 'post',
      data: (props.params && JSON.parse(props.params)) || {},
    }).then(({ data: res }) => {
      radioOptions.value = res.rowData.map((item) => ({
        label: item[props.labelKey || 'dictLabel'],
        value: item[props.valueKey || 'dictBusinessCode'],
      }));
      emit('_mounted');
    });
  } else {
    radioOptions.value = props.options;
  }
};
initOption();
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
    value: radioOptions.value.find((option) => option.value === form.value[props.field])?.label,
  };
};
defineExpose({
  genContent: genContent,
});
</script>

<template>
  <el-form-item :label="label" :prop="field" :label-width="labelWidth">
    <el-radio-group v-model="form[field]" :disabled="disabled">
      <el-radio v-for="option in radioOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </el-radio>
    </el-radio-group>
  </el-form-item>
</template>

<style scoped lang="scss">
.el-radio-group {
  flex-wrap: nowrap;
}
</style>
