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
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
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
  checkStrictly: Boolean,
  emitPath: Boolean,
  labelKey: String,
  valueKey: String,
  idKey: String,
  pidKey: String,
  params: String,
  mapEnv: Function,
  getEnv: Function,
});
const emit = defineEmits(['_change', '_mounted']);
import { buildTree } from '../utils';
import { ref, computed, reactive, inject, watch, watchEffect, useTemplateRef } from 'vue';
import { ElFormItem, ElTreeSelect } from 'element-plus';

const _fetch = inject('_fetch');
const treeSelect = useTemplateRef('treeSelect');
const options = ref([]);

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
const treeProps = reactive({
  label: computed(() => props.labelKey || 'label'),
  children: 'children',
});
const initOption = async () => {
  try {
    if (props.source) {
      await props.getEnv();
      _fetch({
        url: props.mapEnv(props.source),
        data: (props.params && JSON.parse(props.params)) || {},
        method: 'post',
      }).then(({ data: res }) => {
        options.value = buildTree(res, props.pidKey || 'pid', props.idKey || 'id');
        console.log(111, options.value);
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
    : treeSelect.value.presentText;

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
    <el-tree-select
      ref="treeSelect"
      v-model="form[field]"
      :node-key="valueKey"
      :data="options"
      filterable
      :multiple="multiple"
      :clearable="clearable"
      show-checkbox
      :props="treeProps"
      :check-strictly="checkStrictly"
      :disabled="disabled"
      :placeholder="placeholder || '请选择'"
      collapse-tags
      collapse-tags-tooltip
    />
  </el-form-item>
</template>
