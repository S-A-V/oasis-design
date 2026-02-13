<script setup>
import { ref, watch, useTemplateRef, nextTick, computed } from 'vue';
import { ElButton, ElTree, ElPopover } from 'element-plus';
import { Setting } from '@element-plus/icons-vue';

const filterColumns = defineModel({ default: [], type: Array });
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
});
const tree = useTemplateRef('tree');

const treeData = computed(() => {
  return JSON.parse(JSON.stringify(props.data));
});
let cache = [];
const defaultKeys = ref(cache.map((item) => item.id));
watch(
  () => props.columns,
  (cur, pre) => {
    if (
      cur &&
      JSON.stringify(pre?.map((item) => item.column)) !=
        JSON.stringify(cur?.map((item) => item.column))
    ) {
      cache = JSON.parse(JSON.stringify(cur));
      defaultKeys.value = cache.map((item) => item.id);
    }
    filterColumns.value = cache;
    defaultKeys.value = cache.map((item) => item.id);
    // }
  },
  {
    immediate: true,
  },
);
const handleCheckChange = () => {
  filterColumns.value = JSON.parse(JSON.stringify(props.columns)).filter((item) => {
    return [...tree.value.getCheckedKeys(), ...tree.value.getHalfCheckedKeys()].includes(item.id);
  });
  nextTick(() => {
    cache = JSON.parse(JSON.stringify(filterColumns.value));
  });
};
</script>

<template>
  <el-popover trigger="click" :popper-style="{ maxHeight: '360px', overflow: 'auto' }">
    <template #reference>
      <el-button size="small">
        <template #icon>
          <setting></setting>
        </template>
      </el-button>
    </template>
    <el-tree
      ref="tree"
      style="max-width: 600px"
      :data="treeData"
      node-key="id"
      show-checkbox
      :default-checked-keys="defaultKeys"
      check-on-click-node
      @check-change="handleCheckChange"
    >
    </el-tree>
  </el-popover>
</template>
