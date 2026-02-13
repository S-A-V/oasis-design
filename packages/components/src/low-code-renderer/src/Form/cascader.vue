<script setup>
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
  placeholder: {
    type: String,
    default: '请选择',
  },
  source: {
    type: String,
  },
  chooseFirst: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  filterable: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  dependency: {
    type: Array,
    default: () => [],
  },
  _change: String,
  showAllLevels: Boolean,
  checkStrictly: Boolean,
  emitPath: Boolean,
  labelKey: String,
  valueKey: String,
  idKey: String,
  pidKey: String,
  params: String,
  responseField: String,
  mapEnv: Function,
  getEnv: Function,
});
const emit = defineEmits(['_change', '_mounted']);
import { buildTree } from '../utils';
import { ref, computed, inject, watch, watchEffect, useTemplateRef } from 'vue';
import { ElFormItem, ElCascader } from 'element-plus';

const _fetch = inject('_fetch');
const cascader = useTemplateRef('cascader');
const options = ref([]);
const propsOption = computed(() => {
  return {
    multiple: !!props.multiple,
    emitPath: props.emitPath,
    checkStrictly: props.checkStrictly,
    label: props.labelKey || 'label',
    value: props.valueKey || 'value',
  };
});

const reload = async () => {
  if (props.dependency.length === 0) {
    return;
  }
  const data = (props.params && JSON.parse(props.params)) || {};
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
      options.value = buildTree(res.rowData, props.pidKey || 'pid', props.idKey || 'id');
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
const initOption = async () => {
  try {
    if (props.source) {
      await props.getEnv();

      _fetch({
        url: props.mapEnv(props.source),
        data: (props.params && JSON.parse(props.params)) || {},
        method: 'post',
      }).then(({ data: res }) => {
        options.value = buildTree(res.rowData, props.pidKey || 'pid', props.idKey || 'id');
        props.chooseFirst && chooseFirst();

        emit('_mounted');
      });
    }
  } catch (error) {
    console.error(error);
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
const chooseFirst = () => {
  if (!form.value[props.field]) {
    form.value[props.field] = options.value[0]?.[props.valueKey];
  }
};
function findNodesInTree(data, arr = []) {
  const result = [];
  const idsSet = new Set(arr); // 转换为 Set
  function dfs(node) {
    if (idsSet.has(node[props.valueKey])) {
      // 使用 Set 查找
      result.push(node);
    }

    if (node.children) {
      node.children?.forEach((child) => dfs(child));
    }
  }
  dfs({ children: data });

  return result;
}
const genContent = () => {
  const presentText = props.multiple
    ? findNodesInTree(options.value, form.value[props.field])
        .reduce((acc, cur) => {
          acc.push(cur[props.labelKey]);
          return acc;
        }, [])
        .join(',')
    : cascader.value.presentText;

  return {
    label: props.label,
    value: presentText,
  };
};
defineExpose({
  genContent: genContent,
});
</script>

<template>
  <el-form-item :label="label" :prop="field" :label-width="labelWidth">
    <el-cascader
      ref="cascader"
      v-model="form[field]"
      :options="options"
      :clearable="clearable"
      :disabled="disabled"
      :props="propsOption"
      :show-all-levels="showAllLevels"
      :filterable="filterable"
      :placeholder="placeholder || '请选择'"
      collapse-tags
      collapse-tags-tooltip
    />
  </el-form-item>
</template>
