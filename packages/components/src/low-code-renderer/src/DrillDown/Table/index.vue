<script setup lang="jsx">
import { computed, ref, watchEffect, h, useId } from 'vue';
import { ElTable, ElButton } from 'element-plus';
import { WPagination } from '../../../../pagination';
import { WTableContainer } from '../../../../table-container';
import { ElLoading } from 'element-plus';

const pagination = defineModel('pagination', { type: Object });
const props = defineProps({
  json: Object,
  tableData: Array,
  loading: Boolean,
  total: Number,
  columns: Array,
  queryContent: String,
});
const emit = defineEmits(['get-data', 'cell-click', 'export-excel']);
import WLowCodeDrillDownColumnRender from './table-column';
import { base64ToUtf8 } from '../../utils';
const vLoading = ElLoading.directive;
const filterColumns = ref([]);
const id = useId();
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const { enableSummary = false, enablePagination = false } = props.json;

const minHeight = computed(() => {
  return props.json.enableAdaptiveHeight ? 0 : 'unset';
});
const containerHeight = computed(() => {
  return props.json.enableAdaptiveHeight ? '100%' : 'unset';
});
watchEffect(() => {
  // 找到w-container元素 设置height
  const container = document.getElementById('low-code-renderer-container');
  // 设置高度为100%
  if (container) {
    container.style.height = containerHeight.value;
  }
});
const showSummary = ref(enableSummary);
const showPagination = ref(enablePagination);

watchEffect(() => {
  filterColumns.value = props.columns || [];
});
const getSummaries = (param) => {
  const { columns, data } = param;
  const sums = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = h('div', {}, ['合计']);
      return;
    }
    const values = data.map((item) => {
      const currentCol = props.columns.find((item) => item.column == column.property);

      if (currentCol?.formatType == 'jsExpression') {
        const dynamicFunction = new Function(base64ToUtf8(currentCol.format));
        return dynamicFunction()({ row: item }, currentCol);
      }
      return Number(item[column.property]);
    });
    if (!values.every((value) => Number.isNaN(value))) {
      if (column.className == undefined || column.className == 'sum') {
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!Number.isNaN(value)) {
            return prev + curr;
          } else {
            return prev;
          }
        }, 0);
      } else if (column.className === 'avg') {
        const sum = values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!Number.isNaN(value)) {
            return prev + curr;
          } else {
            return prev;
          }
        }, 0);
        sums[index] = Math.abs(sum / values.length).toFixed(2);
      } else if (column.className === 'custom') {
        try {
          const currentCol = props.columns.find((item) => item.column == column.property);
          const dynamicFunction = new Function(base64ToUtf8(currentCol.summaryExpression));
          sums[index] = dynamicFunction()(param, currentCol);
        } catch (error) {
          console.log(error);
        }
      } else {
        sums[index] = '';
      }
    }
  });

  return sums;
};
const exportExcel = () => {
  emit('export-excel');
};
const getData = () => {
  emit('get-data', props.json.id);
};

const cellClick = (data) => {
  emit('cell-click', data);
};
defineExpose({
  id,
  filterColumns,
});
</script>

<template>
  <w-table-container>
    <!-- 表格数据 -->
    <el-table
      :id="id"
      v-loading="loading"
      :data="tableData"
      border
      stripe
      default-expand-all
      :show-summary="showSummary"
      height="100%"
      :tooltip-options="{ effect: 'light', placement: 'top' }"
      :summary-method="getSummaries"
    >
      <w-low-code-drill-down-column-render
        :columns="filterColumns"
        @cell-click="cellClick"
      ></w-low-code-drill-down-column-render>
    </el-table>
  </w-table-container>
  <div class="table-footer-group">
    <w-pagination
      v-if="total > 0 && showPagination"
      v-model:page="pagination.page"
      v-model:limit="pagination.pageSize"
      :total="total"
      @pagination="getData"
    />
    <el-button class="export-btn" type="primary" @click="exportExcel">导出</el-button>
  </div>
</template>

<style lang="scss" scoped>
.w-table-container {
  min-height: v-bind(minHeight);
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 16px;
  font-weight: 700;
  color: #101010;
  text-align: left;

  .query-content {
    font-size: 13px;
    font-weight: 400;
    color: #2b2b2b;
    white-space: pre-wrap;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

:deep(.el-table__body-wrapper) {
  flex: unset;
}

.w-pagination-container {
  margin: 10px 0;
}

.table-footer-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  padding: 0 16px 0 22px;
  background: #f5f6fa;

  .export-btn {
    margin-left: auto;
  }
}
</style>
