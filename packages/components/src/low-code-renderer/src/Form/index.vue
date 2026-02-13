<script setup>
import { ref, reactive, nextTick, computed, useTemplateRef, getCurrentInstance } from 'vue';
import { ElButton, ElForm } from 'element-plus';
import { WSearchContainer } from '../../../search-container';

import { Search } from '@element-plus/icons-vue';
import { getRenderers } from './renderers';
import IconUpload from '../components/icons/icon-upload.vue';
import { base64ToUtf8 } from '../utils';
const props = defineProps({
  json: Object,
  beforeFetch: Function,
  customFetch: Function,
  mapEnv: Function,
  getEnv: Function,
});
const emit = defineEmits(['getData', 'setTableData', 'setTableColumn', 'export']);
const { proxy } = getCurrentInstance();
const fieldItem = useTemplateRef('fieldItem');
const items = ref([]);
const defaultRows = ref(3);
const queryParams = reactive({});
const typeOfCustomInherit = ['date-range-picker', 'date-picker'];
const sourceLength = ref(0);
const queryRef = ref('queryRef');
const renderers = getRenderers();

const init = () => {
  if (props.json) {
    const { filter } = props.json;
    const { body = [], default_rows } = filter;
    defaultRows.value = default_rows || 3;
    items.value = body;
    sourceLength.value = items.value.filter((item) => item.source)?.length;
    if (sourceLength.value == 0) {
      nextTick(fetchApi);
    }
    body.forEach((item) => {
      queryParams[item.field] = item?.default;
      if (typeOfCustomInherit.includes(item.type) && item._inheritValueGenFunc) {
        const inheritValueGenFunc = new Function(base64ToUtf8(item._inheritValueGenFunc));
        queryParams[item.field] = inheritValueGenFunc()();
      }
    });
  }
};

function resetForm() {
  queryRef.value?.resetFields();
}

/** 重置按钮操作 */
function resetQuery() {
  resetForm();
  fetchApi();
}
function exportExcel() {
  emit('export');
}

function wrapAsPromise(obj) {
  if (obj instanceof Promise) {
    return obj; // 如果是 Promise，直接返回
  } else {
    // 否则，将普通对象包装成 Promise
    return Promise.resolve(obj);
  }
}
const fetchApi = () => {
  const data = JSON.parse(JSON.stringify(queryParams, { page: 1 }));
  if (props['customFetch']) {
    wrapAsPromise(props['customFetch'](data))
      .then((res) => {
        // 判断如果等于true可以继续走默认getData逻辑
        if (res) {
          emit('getData', data);
          return;
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return;
  }
  // beforeFetch用于扩展一些逻辑,需将params回传用于getData
  if (props['beforeFetch']) {
    wrapAsPromise(props['beforeFetch'](data))
      .then((res) => {
        emit('getData', res);
      })
      .catch((err) => {
        console.error(err);
      });
    return;
  }
  emit('getData');
};

const allFetchLength = ref(0);

const onComponetMounted = () => {
  allFetchLength.value++;
  if (allFetchLength.value == sourceLength.value) {
    !props.json.common?.manuallyRender && nextTick(fetchApi);
  }
};

const onChangeHook = (changeEvt, value) => {
  const dynamicHook = new Function(base64ToUtf8(changeEvt));
  dynamicHook()(value, items, queryParams);
};

init();
defineExpose({
  queryParams,
  fieldItem,
});
</script>

<template>
  <w-search-container :default-rows="defaultRows">
    <el-form
      v-show="json.type !== 'drillDown'"
      ref="queryRef"
      :model="queryParams"
      label-position="right"
      label-width="124px"
      label-suffix="："
    >
      <component
        :is="renderers[item.type]"
        v-for="item in items"
        ref="fieldItem"
        :key="item.id"
        v-bind="item"
        v-model:form="queryParams"
        :class="`col-span-${item.span || 1}`"
        :get-env="getEnv"
        :map-env="mapEnv"
        @_change="onChangeHook"
        @_mounted="onComponetMounted"
      ></component>
    </el-form>

    <template #footer>
      <el-button type="primary" :icon="Search" @click="fetchApi">查询</el-button>
      <el-button @click="exportExcel">
        <template #icon>
          <icon-upload color="#9F9F9F" />
        </template>
        导出</el-button
      >
      <slot name="action"></slot>
    </template>
  </w-search-container>
</template>
