<script setup>
import ChartContainer from '../components/chart-container/index.vue';
import { cloneDeep } from 'lodash-es';
import Renderer from './chart.vue';

const props = defineProps({
  json: Object,
  queryParams: Object,
});
const emit = defineEmits(['getData']);
import { ref, reactive, computed, watchEffect, nextTick } from 'vue';
const rendererRef = ref();

const charts = ref([]);
// 不可删除 rule有用到
let query = reactive({});
watchEffect(() => {
  query = cloneDeep(props.queryParams);
});
window.__lowcode_chartQuery = query;
// 调用所有renderer的init方法并暴露给父组件
const refresh = () => {
  nextTick(() => {
    charts.value = allCharts.value.filter((item) => {
      return item.renderRule && eval(item.renderRule);
    });
    nextTick(() => {
      rendererRef.value?.forEach((item) => item.init());
    });
  });
};
let allCharts = computed(() => {
  return cloneDeep(jsonObj.value?.charts);
});
const jsonObj = computed(() => {
  return props.json;
});

const chartClick = (data) => {
  if (data.chart.enable) {
    rendererRef.value?.forEach((item) => {
      if (data.chart.connectCharts.includes(item.id)) {
        item.init(data.chart.params);
      }
    });
  }
  if (data.table.enable) {
    emit('getData', { ...data.table.params, origin: 'chart' });
  }
};
defineExpose({
  refresh,
});
</script>

<template>
  <chart-container>
    <renderer
      v-for="item in charts"
      ref="rendererRef"
      :key="item.id"
      :query="queryParams"
      :config="item"
      class="card"
      @chart-click="chartClick"
    ></renderer>
  </chart-container>
</template>

<style lang="scss" scoped>
.card {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 12px rgb(0 0 0 / 18%);
}
</style>
