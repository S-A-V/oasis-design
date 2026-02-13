<script setup>
import { ElDialog, ElProgress } from 'element-plus';
import { WContainer } from '../../container';
import { exportExcelBlob, downloadExcelBlob } from './utils/xlsx';
import FormRenderer from './Form/index.vue';
import TableRenderer from './Table/index.vue';
import ChartRenderer from './Chart/index.vue';
import drillDownRenderer from './DrillDown/index.vue';
import {
  ref,
  reactive,
  provide,
  computed,
  useTemplateRef,
  onBeforeUnmount,
  watchEffect,
} from 'vue';
import { $token, $file, $modal } from '@way-ui/plugins';
import request from './utils/request';
import { cloneDeep } from 'lodash-es';
import { Encryption } from '@way-ui/utils/encryption';
import { useGlobalConfig } from '@way-ui/hooks';
import { getConfig } from './utils/config.js';

import {
  filterDynamicColumns,
  mergeDataByKey,
  isPlainObjectWithKeys,
  transformData,
  base64ToUtf8,
  mergeAndFill,
  buildTree,
} from './utils';
import { useRoute, useRouter } from 'vue-router';
import { nanoid } from '@way-ui/shared-libs/nanoid';

defineOptions({
  name: 'WLowCodeRenderer',
});
const props = defineProps({
  json: String,
  options: Object,
  beforeFetch: Function,
  customFetch: Function,
});
const route = useRoute();
const router = useRouter();
const queryContent = ref('');
const formRendererRef = useTemplateRef('formRendererRef');
const tableRendererRef = useTemplateRef('tableRendererRef');

const chartRendererRef = useTemplateRef('chartRendererRef');

const canFetch = computed(() => {
  return isPlainObjectWithKeys(jsonObj.value);
});
const baseUrl = ref('');
const jsonObj = computed(() => {
  return JSON.parse(props.json || '{}');
});
const allTables = ref([]);
const tables = ref([]);
const _fetch = (config) =>
  request({
    baseURL: baseUrl.value || '',
    headers: props.options?.headers || {},
    ...config,
  });
provide('_fetch', _fetch);

watchEffect(() => {
  allTables.value = cloneDeep(jsonObj.value?.tables)?.map((table) => {
    return {
      id: table.id,
      json: table,
      pagination: {
        page: 1,
        pageSize: 20,
      },
      loading: false,
      tableData: [],
      tableTotal: 0,
      columns: [],
    };
  });
  console.log(allTables.value);
});

const visible = ref(false);
const drillDownTitle = ref('');
const drillDownJson = ref('');
const drillDownQueryParams = ref();
const cellClick = ({ rowData, column }) => {
  if (column.eventType === 'link' && column.behavior.link.url) {
    // 如果是route 则用vue-router，如果是全链接则用window.open
    const linkSettings = JSON.parse(JSON.stringify(column.behavior.link));
    const { url = '' } = linkSettings;
    const genUrlHook = new Function(base64ToUtf8(url));

    const link = genUrlHook()(rowData.row, encryption);
    // 如果是route 则用vue-router，如果是全链接则用window.open
    if (/^(https?):\/\/([a-z0-9-]+\.)+[a-z]{2,}(:[0-9]+)?(\/.*)?(\?.*)?(#.*)?$/i.test(link)) {
      window.open(link);
    } else {
      router.push(link);
    }
  } else if (column.eventType === 'dialog') {
    const dialogSettings = JSON.parse(JSON.stringify(column.behavior.dialog));
    const { body, initExp } = dialogSettings;
    const bodyClone = cloneDeep(body);

    drillDownQueryParams.value = JSON.parse(JSON.stringify(formRendererRef.value.queryParams));
    jsonObj.value.filter.body
      ?.filter((item) => {
        return item.type == 'date-range-picker';
      })
      .forEach((item) => {
        drillDownQueryParams.value[`${item.field}Start`] =
          drillDownQueryParams.value[item.field]?.[0];
        drillDownQueryParams.value[`${item.field}End`] =
          drillDownQueryParams.value[item.field]?.[1];
      });
    const dynamicHook = new Function(base64ToUtf8(initExp));
    if (initExp) {
      dynamicHook()(drillDownQueryParams.value, rowData);
    }
    // return (body, rowData) => {
    //   console.log(body.filter.body, rowData);
    //   body.filter.body.forEach((item) => {
    //   });
    // };
    drillDownTitle.value = bodyClone.title;
    drillDownJson.value = JSON.stringify(bodyClone);

    visible.value = true;
  }
};

const visibleExportModal = ref(false);
const pollInterval = ref(null);
let uuid;
const totalSize = ref(0);
const completedSize = ref(0);
const exportCompleted = ref(true);
const progress = computed(() => {
  return totalSize.value ? parseInt((completedSize.value / totalSize.value) * 100) : 0;
});
const code = route.query.code;
const pollApi = () => {
  const { exportName, title } = tables.value[0].json;
  const interval = 2000;
  // 创建一个轮询的间隔
  pollInterval.value = setInterval(() => {
    try {
      request({
        url: `${envVariables.value['BASE_URL']}/data-service/export/getExportInfo`,
        headers: {
          Authorization: 'Bearer ' + $token.get(),
        },
        method: 'post',
        data: {
          code,
          uuid,
        },
      }).then(({ data }) => {
        completedSize.value = data.exportSize;
        totalSize.value = data.totalSize;
        if (data.status == '3') {
          exportCompleted.value = true;
          clearInterval(pollInterval.value); // 停止轮询
          $file.download(data.path, `${exportName || title || '空标题'}.xlsx`);
          visibleExportModal.value = false;
        }
      });
    } catch (error) {
      console.error('请求失败:', error);
      clearInterval(pollInterval); // 可选择停止轮询
    }
  }, interval);
};

const exportExcel = () => {
  const config = tables.value[0].json;

  if (config.enablePagination) {
    exportCompleted.value = false;
    uuid = nanoid();

    const api = config.api;
    const data = JSON.parse(JSON.stringify(formRendererRef.value.queryParams));
    const mergeParams = Object.assign({}, data);
    totalSize.value = 0;
    completedSize.value = 0;
    const exportParams = {
      params: mergeParams,
      api: mapEnvVariable(api),
      columns: buildTree(tableRendererRef.value[0].filterColumns),
      code,
      uuid,
    };
    request({
      url: `${envVariables.value['BASE_URL']}/data-service/export/exportData`,
      headers: {
        Authorization: 'Bearer ' + $token.get(),
      },
      method: 'post',
      data: exportParams,
    }).then((res) => {
      visibleExportModal.value = true;
      pollApi();
    });
  } else {
    const { exportName, title } = config;
    const sheet1 = exportExcelBlob(tableRendererRef.value[0].id);
    downloadExcelBlob(sheet1, exportName || title || '空标题');
  }
};
const closeExportTask = () => {
  if (exportCompleted.value) {
    return;
  }
  request({
    url: `${envVariables.value['BASE_URL']}/data-service/export/cancelExportStatus`,
    headers: {
      Authorization: 'Bearer ' + $token.get(),
    },
    method: 'post',
    data: {
      code,
      uuid,
    },
  });
  pollInterval.value && clearInterval(pollInterval.value); // 停止轮询
};
const { VITE_BASE_ENCRYPTION_KEY } = useGlobalConfig('env').value;
const encryption = new Encryption(VITE_BASE_ENCRYPTION_KEY);

const envVariables = ref([]);
const envloaded = ref(false);
const getEnvVariables = async () => {
  if (envloaded.value) {
    return;
  }
  const decryptedConfig = await getConfig();
  // envVariables.value = config;
  envVariables.value = decryptedConfig;
  envloaded.value = true;
};
const mapEnvVariable = (api) => {
  // 使用正则表达式匹配所有{{}}中的内容
  return api.replace(/{{(.*?)}}/g, (match, p1) => {
    // 查找数组中与p1（即{{}}中提取的内容）匹配的对象
    // 如果找到匹配的对象，返回它的url，否则保持原样
    return envVariables.value?.[p1] || match;
  });
};

// 不可删除 rules用到此变量
let query = reactive({});
const tableExtraQuery = ref({});
const getData = async (extraQuery = {}) => {
  await getEnvVariables();
  query = cloneDeep(formRendererRef.value.queryParams);

  jsonObj.value.filter.body
    ?.filter((item) => {
      return item.type == 'date-range-picker';
    })
    .forEach((item) => {
      query[`${item.field}Start`] = query[item.field]?.[0];
      query[`${item.field}End`] = query[item.field]?.[1];
    });
  tableExtraQuery.value = extraQuery;
  getTableData();
  if (extraQuery.origin !== 'chart') {
    getChartData();
  }
};

const getChartData = () => {
  chartRendererRef.value?.refresh();
};
const getTableData = async (id) => {
  queryContent.value = formRendererRef.value?.fieldItem
    ?.map((item) => {
      return item?.genContent?.();
    })
    .filter((item) => {
      if (Array.isArray(item.value)) {
        return item.value.length > 0;
      }
      return !!item.value;
    })
    .map((item) => {
      return `${item.label}: ${item.value}`;
    })
    .join(`   |   `);
  const ruleTables = allTables.value.filter((item) => {
    const rule = jsonObj.value.rules.find((rule) => {
      return rule.id == item.id;
    });
    return rule.content && eval(rule.content);
  });

  tables.value = ruleTables;
  // 修改分页 只更新当前表格
  let index =
    id &&
    tables.value.findIndex((item) => {
      return item.id == id;
    });

  for (let i = 0; i < tables.value.length; i++) {
    if (index !== undefined && i !== index) {
      continue;
    }
    const table = tables.value[i];
    const { api, primaryKey } = table.json;

    if (!api) {
      $modal.msgError(`未配置数据源API`);
      return;
    }
    table.loading = true;
    let mergeParams = Object.assign({}, query);
    if (table.json?.enablePagination) {
      mergeParams = Object.assign(mergeParams, table.pagination);
    }
    if (tableExtraQuery.value.origin === 'chart') {
      mergeParams = Object.assign(mergeParams, tableExtraQuery.value);
    }
    const originColumns = cloneDeep(table.json.columns);
    // 找到动态列
    const dynamicColumns = filterDynamicColumns(table.json.columns);
    if (!dynamicColumns.length) {
      _fetch({
        url: mapEnvVariable(api),
        method: 'post',
        data: mergeParams,
      })
        .then((res) => {
          table.loading = false;
          table.columns = originColumns;
          table.tableData = res.data.rowData;
          table.tableTotal = table.json.enablePagination ? res.data.total : res.data.length;
        })
        .catch((err) => {
          table.loading = false;
          console.error(err);
        });
      continue;
    }

    const constApiPromise = _fetch({
      url: mapEnvVariable(api),
      method: 'post',
      data: mergeParams,
    }).then((res) => {
      return res.data.rowData;
    });

    // 根据动态列生成请求 包装成promise
    const dynamicApiPromise = dynamicColumns.map((item) => {
      return _fetch({
        url: mapEnvVariable(item.api),
        method: 'post',
        data: mergeParams,
      }).then((res) => {
        return mergeAndFill(res.data.rowData, primaryKey);
      });
    });

    Promise.all([constApiPromise, ...dynamicApiPromise]).then((res) => {
      for (let index = 1; index < res.length; index++) {
        const indexInOriginColumns = originColumns.findIndex((item) => {
          return item.id == dynamicColumns[index - 1].id;
        });
        const originColumn = originColumns[indexInOriginColumns];

        const drillDownCols = dynamicColumns[index - 1].behavior['dialog']?.['drillDownCols'] || [];
        const data = res[index][0];
        const cols = [];
        for (const key in data) {
          // 判断以_开头的字段不显示
          if (
            Object.prototype.hasOwnProperty.call(data, key) &&
            key != primaryKey &&
            !key.startsWith('_')
          ) {
            const value = data[key];
            const isValuePlainObjectWithKeys = isPlainObjectWithKeys(value);
            const parentCol = {
              column: key,
              formatType: isValuePlainObjectWithKeys
                ? ''
                : dynamicColumns[index - 1].formatType || 'text',
              format: isValuePlainObjectWithKeys ? '' : dynamicColumns[index - 1].format,
              align: originColumn.align || 'right',
              headerAlign: originColumn.headerAlign || 'center',
              label: key,
              pid: originColumns[indexInOriginColumns].pid,
              width: '',
              id: `_id_${key}_${index}`,
              eventType: isValuePlainObjectWithKeys ? '' : dynamicColumns[index - 1].eventType,
              behavior: isValuePlainObjectWithKeys ? '' : dynamicColumns[index - 1].behavior,
              summaryType: isValuePlainObjectWithKeys ? '' : dynamicColumns[index - 1].summaryType,
              summaryExpression: isValuePlainObjectWithKeys
                ? ''
                : dynamicColumns[index - 1].summaryExpression,
            };

            let chidCols = [];
            if (isValuePlainObjectWithKeys) {
              chidCols = Object.keys(value)
                .filter((col) => {
                  return !col.startsWith('_');
                })
                .map((col, idx) => {
                  const isDrillDownCol = !drillDownCols.length || drillDownCols.includes(col);
                  return {
                    column: `${key}_${col}`,
                    format: dynamicColumns[index - 1].format,
                    formatType: dynamicColumns[index - 1].formatType || 'text',
                    label: col,
                    align: dynamicColumns[index - 1].align || 'right',
                    headerAlign: dynamicColumns[index - 1].headerAlign || 'center',
                    minWidth: '',
                    pid: parentCol.id,
                    width: '',
                    id: `_id_${key}_${index}_${idx}`,
                    eventType: isDrillDownCol ? dynamicColumns[index - 1].eventType : '',
                    behavior: isDrillDownCol ? dynamicColumns[index - 1].behavior : '',
                    summaryType: dynamicColumns[index - 1].summaryType,
                    summaryExpression: dynamicColumns[index - 1].summaryExpression,
                  };
                });
            }
            cols.push(parentCol, ...chidCols);
          }
        }
        originColumns.splice(indexInOriginColumns, 1, ...cols);
      }
      const mergeData = mergeDataByKey(
        res.map((dataItem) => {
          return transformData(dataItem, primaryKey);
        }),
        primaryKey,
      );

      table.loading = false;
      table.columns = originColumns;
      table.tableData = mergeData;
      table.tableTotal = mergeData.length;
    });
  }
};
onBeforeUnmount(() => {
  uuid && closeExportTask();
});

defineExpose({
  formRendererRef,
  tableRendererRef,
  chartRendererRef,
});
</script>

<template>
  <div class="low-code-renderer-scroll-container">
    <w-container v-if="json" id="low-code-renderer-container">
      <form-renderer
        v-if="canFetch"
        ref="formRendererRef"
        :json="jsonObj"
        :before-fetch="beforeFetch"
        :custom-fetch="customFetch"
        :map-env="mapEnvVariable"
        :get-env="getEnvVariables"
        @get-data="getData"
        @export="exportExcel"
      >
        <template #action>
          <slot name="action"></slot>
        </template>
      </form-renderer>
      <chart-renderer
        v-if="canFetch"
        ref="chartRendererRef"
        :query-params="query"
        :json="jsonObj"
        @get-data="getData"
      ></chart-renderer>
      <table-renderer
        v-for="table in tables"
        :key="table.id"
        ref="tableRendererRef"
        v-model:pagination="table.pagination"
        :loading="table.loading"
        :json="table.json"
        :table-data="table.tableData"
        :total="table.tableTotal"
        :columns="table.columns"
        :query-content="queryContent"
        @get-data="getTableData"
        @cell-click="cellClick"
      ></table-renderer>
    </w-container>
  </div>

  <el-dialog
    v-model="visible"
    width="70%"
    :title="drillDownTitle"
    destroy-on-close
    body-class="w-low-code-drilldown-dialog-body"
    header-class="w-low-code-drilldown-dialog-header"
  >
    <drill-down-renderer
      :json="drillDownJson"
      :query-params="drillDownQueryParams"
    ></drill-down-renderer>
  </el-dialog>
  <el-dialog
    v-model="visibleExportModal"
    title="提示"
    :close-on-click-modal="false"
    width="400"
    @close="closeExportTask"
  >
    <div class="download-wrapper">
      <el-progress type="dashboard" :percentage="progress" striped striped-flow :color="colors" />
      <div class="desc">正在导出中，关闭弹窗或离开当前页会终止导出</div>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.w-low-code-drilldown-dialog-body {
  height: 580px;

  .w-table-container {
    min-height: 474px !important;
  }
}
</style>

<style lang="scss" scoped>
.low-code-renderer-scroll-container {
  height: 100%;
  overflow: auto;
}

.download-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  .desc {
    font-size: 15px;
    font-weight: 500;
  }

  .loader {
    position: relative;
    width: 100px;
    height: 100px;
    border: 3px solid transparent;
    border-top-color: #666;
    border-radius: 50%;
    animation: spin 2s linear infinite;
  }

  .loader::before {
    position: absolute;
    inset: 5px;
    content: '';
    border: 3px solid transparent;
    border-top-color: #666;
    border-radius: 50%;
    animation: spin 3s linear infinite;
  }

  .loader::after {
    position: absolute;
    inset: 15px;
    content: '';
    border: 3px solid transparent;
    border-top-color: #666;
    border-radius: 50%;
    animation: spin 1.5s linear infinite;
  }
}

:deep(.w-container-main) {
  overflow-y: auto;
}
</style>
