<script setup>
import { ref, watch, watchEffect, inject, useTemplateRef } from 'vue';
import { ElSelect, ElOption, ElFormItem } from 'element-plus';

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
  clearable: {
    type: Boolean,
    default: false,
  },
  chooseFirst: {
    type: Boolean,
    default: false,
  },
  dependency: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  filterable: {
    type: Boolean,
    default: false,
  },

  source: String,
  labelKey: String,
  valueKey: String,
  _change: String,
  mapEnv: Function,
  getEnv: Function,
  options: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['_change', '_mounted']);
const select = useTemplateRef('select');
const _fetch = inject('_fetch');
const selectOptions = ref([]);

const initOption = async () => {
  if (props.source) {
    await props.getEnv();
    _fetch({
      url: props.mapEnv(props.source),
      method: 'post',
    }).then(({ data: res }) => {
      selectOptions.value = res.rowData;
      props.chooseFirst && chooseFirst();
      emit('_mounted');
    });
  } else {
    selectOptions.value = props.options;
    props.chooseFirst && chooseFirst();
  }
};
const reload = async () => {
  if (props.dependency.length === 0) {
    return;
  }
  const data = {};
  props.dependency.forEach((item) => {
    data[item] = form.value[item];
  });
  if (props.source) {
    await props.getEnv();
    _fetch({
      url: props.mapEnv(props.source),

      data,
      method: 'post',
    }).then(({ data: res }) => {
      selectOptions.value = res.rowData;
      form.value[props.field] = '';
    });
  }
};
watch(
  () => props.dependency.map((item) => form.value[item]),
  () => {
    reload();
  },
);
const chooseFirst = () => {
  if (!form.value[props.field]) {
    form.value[props.field] = selectOptions.value[0]?.value;
  }
};
watchEffect(() => {
  if (form.value[props.field]) {
    if (props?._change) {
      emit('_change', props._change, form.value[props.field]);
    }
  }
});

initOption();
const genContent = () => {
  return {
    label: props.label,
    value: select.value.selectedLabel,
  };
};
defineExpose({
  genContent: genContent,
});
</script>

<template>
  <el-form-item :label="label" :prop="field" :label-width="labelWidth">
    <el-select
      ref="select"
      v-model="form[field]"
      :placeholder="placeholder || '请选择'"
      :disabled="disabled"
      :multiple="multiple"
      :filterable="filterable"
      :clearable="clearable"
      collapse-tags
      collapse-tags-tooltip
    >
      <el-option
        v-for="dict in selectOptions"
        :key="dict[valueKey || 'value']"
        :label="dict[labelKey || 'label']"
        :value="dict[valueKey || 'value']"
      />
    </el-select>
  </el-form-item>
</template>
