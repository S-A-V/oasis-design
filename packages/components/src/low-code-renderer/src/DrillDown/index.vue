<script setup>
import { ElButton, ElDialog, ElProgress } from 'element-plus';
import { WContainer } from '../../../container';
import { WSearchContainer } from '../../../search-container';
import { exportExcelBlob, downloadExcelBlob } from '@way-ui/utils/xlsx';
import { Encryption } from '@way-ui/utils/encryption';
import { useGlobalConfig } from '@way-ui/hooks';

import TableRenderer from './Table/index.vue';
import {
  ref,
  reactive,
  inject,
  computed,
  watchEffect,
  onBeforeUnmount,
  useTemplateRef,
  getCurrentInstance,
} from 'vue';
import { $token, $file, $modal } from '@way-ui/plugins';
import request from '../utils/request';
import { cloneDeep } from 'lodash-es';
import { nanoid } from '@way-ui/shared-libs/nanoid';

import {
  filterDynamicColumns,
  mergeDataByKey,
  isPlainObjectWithKeys,
  transformData,
  base64ToUtf8,
  mergeAndFill,
  buildTree,
} from '../utils';
import { useRoute, useRouter } from 'vue-router';
import { getConfig } from '../utils/config.js';

defineOptions({
  name: 'DrillDownRenderer',
});
const props = defineProps({
  json: String,
  queryParams: {
    type: Object,
    default: () => {},
  },
});
const { VITE_BASE_ENCRYPTION_KEY } = useGlobalConfig('env').value;
const encryption = new Encryption(VITE_BASE_ENCRYPTION_KEY);

const drillTableRef = useTemplateRef('drillTableRef');

const _fetch = inject('_fetch');
const route = useRoute();
const router = useRouter();

let { proxy } = getCurrentInstance();
const drillDownQueryParams = ref();

const jsonObj = computed(() => {
  return JSON.parse(props.json || '{}');
});
const pagination = reactive({
  page: 1,
  pageSize: 20,
});

const tableData = ref([]);
const tableColumns = ref([]);
watchEffect(() => {
  tableColumns.value = jsonObj.value?.columns;
});

const loading = ref(false);
const tableTotal = ref(0);

const visible = ref(false);
const drillDownJson = ref('');
const cellClick = ({ rowData, column }) => {
  if (column.eventType === 'link' && column.behavior.link.url) {
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
    const drillDownSettings = JSON.parse(JSON.stringify(column.behavior.dialog));
    const { body, initExp } = drillDownSettings;
    const bodyClone = cloneDeep(body);

    const dynamicHook = new Function(base64ToUtf8(initExp));
    drillDownQueryParams.value = JSON.parse(JSON.stringify(props.queryParams));
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
    drillDownJson.value = JSON.stringify(bodyClone);
    if (initExp) {
      dynamicHook()(drillDownQueryParams.value, rowData);
    }
    visible.value = true;
  }
};
const setTableData = ({ rows = [], total = 0 }) => {
  tableData.value = rows;
  tableTotal.value = total;
};
const setTableColumn = ({ columns }) => {
  tableColumns.value = columns;
};
const visibleExportModal = ref(false);
const pollInterval = ref(null);
let uuid;
const code = route.query.code;
const totalSize = ref(0);
const completedSize = ref(0);
const exportCompleted = ref(true);
const progress = computed(() => {
  return totalSize.value ? parseInt((completedSize.value / totalSize.value) * 100) : 0;
});
const pollApi = () => {
  const { exportName } = jsonObj.value;
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
          $file.download(data.path, `${exportName}.xlsx`);
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
  if (jsonObj.value?.enablePagination) {
    exportCompleted.value = false;
    uuid = nanoid();
    const api = jsonObj.value?.api;
    const queryParamsClone = JSON.parse(JSON.stringify(props.queryParams));
    const mergeParams = Object.assign({}, pagination, queryParamsClone);
    const exportParams = {
      params: mergeParams,
      api: mapEnvVariable(api),
      columns: buildTree(tableColumns.value),
      code,
      uuid,
    };
    console.log(envVariables.value);

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
    const { exportName } = jsonObj.value;
    const sheet1 = exportExcelBlob(drillTableRef.value.id);
    downloadExcelBlob(sheet1, exportName);
  }
};
const closeExportTask = () => {
  totalSize.value = 0;
  completedSize.value = 0;
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

const getData = async () => {
  await getEnvVariables();

  const { api, primaryKey } = jsonObj.value;
  const queryParamsClone = JSON.parse(JSON.stringify(props.queryParams));
  if (!api) {
    $modal.msgError(`未配置数据源API`);
    return;
  }
  loading.value = true;
  let mergeParams = Object.assign({}, queryParamsClone);
  if (jsonObj.value?.enablePagination) {
    mergeParams = Object.assign(mergeParams, pagination);
  }
  const originColumns = JSON.parse(JSON.stringify(jsonObj.value.columns));

  // 找到动态列
  const dynamicColumns = filterDynamicColumns(jsonObj.value.columns);
  if (!dynamicColumns.length) {
    _fetch({
      url: mapEnvVariable(api),
      method: 'post',
      data: mergeParams,
    }).then((res) => {
      loading.value = false;
      setTableColumn({ columns: originColumns });
      setTableData({
        rows: res.data.rowData,
        total: jsonObj.value?.enablePagination ? res.data.total : res.data.length,
      });
    });
    return;
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

      const data = res[index][0];
      const cols = [];
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key) && key != primaryKey) {
          const value = data[key];
          const parentCol = {
            column: key,
            format: '',
            formatType: 'text',
            label: key,
            pid: originColumns[indexInOriginColumns].pid,
            width: '',
            id: `_id_${key}${index}${+new Date()}`,
          };
          let chidCols = [];
          if (isPlainObjectWithKeys(value)) {
            chidCols = Object.keys(value).map((col) => {
              return {
                column: `${key}_${col}`,
                format: '',
                formatType: 'text',
                label: col,
                minWidth: '',
                pid: parentCol.id,
                width: '',
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
    loading.value = false;
    setTableColumn({ columns: originColumns });
    setTableData({ rows: mergeData, total: mergeData.length });
  });
};
getData();
onBeforeUnmount(() => {
  uuid && closeExportTask();
});
</script>

<template>
  <div v-if="json" class="drillDown-table-wrapper">
    <table-renderer
      ref="drillTableRef"
      v-model:pagination="pagination"
      :loading="loading"
      :json="jsonObj"
      :table-data="tableData"
      :total="tableTotal"
      :columns="tableColumns"
      @get-data="getData"
      @cell-click="cellClick"
      @export-excel="exportExcel"
    ></table-renderer>
  </div>
  <el-dialog v-model="visible" width="80%" destroy-on-close>
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

<style lang="scss" scoped>
/* stylelint-disable-next-line selector-class-pattern */
.drillDown-table-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  min-height: 0;
}

.btn-wrapper {
  display: flex;
  justify-content: flex-end;
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
</style>
