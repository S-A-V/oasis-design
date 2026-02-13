<script setup>
import { ref, inject, watchEffect } from 'vue';
import { ElCheckbox, ElCheckboxGroup, ElFormItem } from 'element-plus';

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
  params: String,
  disabled: {
    type: Boolean,
    default: false,
  },
  _change: String,

  source: String,
  labelKey: String,
  valueKey: String,
  mapEnv: Function,
  getEnv: Function,
});
const emit = defineEmits(['_change', '_mounted']);
const _fetch = inject('_fetch');
const checkboxOptions = ref([]);
const initOption = async () => {
  if (props.source) {
    await props.getEnv();
    _fetch({
      url: props.mapEnv(props.source),
      method: 'post',
      data: (props.params && JSON.parse(props.params)) || {},
    }).then(({ data: res }) => {
      checkboxOptions.value = res.rowData.map((item) => ({
        label: item[props.labelKey || 'dictLabel'],
        value: item[props.valueKey || 'dictBusinessCode'],
      }));

      emit('_mounted');
    });
  } else {
    checkboxOptions.value = props.options;
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
    value: checkboxOptions.value
      ?.filter((option) => form.value[props.field]?.includes(option.value))
      ?.map((option) => option.label)
      ?.join(','), // 选中的值用逗号分隔
  };
};
defineExpose({
  genContent: genContent,
});
</script>

<template>
  <el-form-item :label="label" :prop="field" :label-width="labelWidth">
    <el-checkbox-group v-model="form[field]" :disabled="disabled">
      <el-checkbox
        v-for="option in checkboxOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-checkbox-group>
  </el-form-item>
</template>

<style scoped lang="scss">
.el-checkbox-group {
  display: flex;
  flex-wrap: nowrap;
}
</style>
