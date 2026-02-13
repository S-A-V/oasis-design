<script setup>
import { use } from 'echarts/core';
import { LineChart, BarChart, PieChart, RadarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  MarkLineComponent,
} from 'echarts/components';
import { base64ToUtf8 } from '../utils';

import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';
import { ElForm, ElSelect, ElOption, ElFormItem } from 'element-plus';
import { Encryption } from '@way-ui/utils/encryption';
import { useGlobalConfig } from '@way-ui/hooks';
import { formatMoney } from '../utils/way.js';
import { getConfig } from '../utils/config.js';

import { ref, reactive, inject, onMounted, computed, watchEffect, unref } from 'vue';

const props = defineProps({
  query: Object,
  config: Object,
});
const emit = defineEmits(['chart-click']);

use([
  LineChart,
  PieChart,
  BarChart,
  RadarChart,
  GridComponent,
  CanvasRenderer,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  MarkLineComponent,
]);
const _fetch = inject('_fetch');

// 从props接收配置
const chartConfig = computed(() => {
  return props.config;
});

const chartFilter = computed(() => {
  return chartConfig.value.filter;
});
const chartQueryParams = reactive({
  [unref(chartFilter).field]: unref(chartFilter).default,
});

const groupChartConfig = computed(() => {
  if (!chartConfig.value.enableFilter) {
    return chartConfig.value.group[0];
  }
  return chartConfig.value.group.find((item) => {
    const currentGroup = chartFilter.value.options.find((option) => {
      return chartQueryParams[chartFilter.value.field] === option.value;
    });
    return currentGroup.groupId === item.groupId;
  });
});
const option = reactive({});
const height = computed(() => {
  return groupChartConfig.value.height || '312px';
});
let handleClick = () => {};

const onFilterChange = () => {
  init();
};
const loading = ref(false);
let ringLabelList = ref([]);
watchEffect(() => {
  // 当然series有且只有一个饼图时，tooltip的trigger为item
  const onlySpecialChart =
    groupChartConfig.value.series.length === 1 &&
    (groupChartConfig.value.series[0].type === 'pie' ||
      groupChartConfig.value.series[0].type === 'radar');
  const hasLineChart = groupChartConfig.value.series.some((item) => item.type === 'line');
  // 检查是否有雷达图系列
  const hasRadarSeries = groupChartConfig.value.series.some((item) => item.type === 'radar');
  Object.assign(option, {
    grid: {
      top: groupChartConfig.value.grid?.top || 72,
      left: groupChartConfig.value.grid?.left || '10%',
      right: groupChartConfig.value.grid?.right || '10%',
      bottom: groupChartConfig.value.grid?.bottom || 40,
    },

    legend: {
      orient: groupChartConfig.value.legend?.orient || 'vertical',
      top: groupChartConfig.value.legend?.top || '12',
      left: groupChartConfig.value.legend?.left || '24',
      right: groupChartConfig.value.legend?.right || 'auto',
      bottom: groupChartConfig.value.legend?.bottom || 'auto',
      width: groupChartConfig.value.legend?.width || 'auto',
      height: groupChartConfig.value.legend?.height || 'auto',
      itemGap: groupChartConfig.value.legend?.itemGap || 24,
      show: groupChartConfig.value.showLegend,
      type: groupChartConfig.value.legendScroll ? 'scroll' : 'plain',
      itemWidth: 8,
      itemHeight: 8,
    },
    tooltip: {
      show: groupChartConfig.value.showTooltip,
      trigger: groupChartConfig.value.showTooltip ? (onlySpecialChart ? 'item' : 'axis') : 'none',
    },
    series: groupChartConfig.value.series.map((item) => {
      const seriesItem = {
        name: item.name,
        type: item.type,
        symbolSize: 6,
        [groupChartConfig.value.cateAxleType === 'x' ? 'yAxisIndex' : 'xAxisIndex']:
          item.crossAxleIndex,
        data: [],
        tooltip: {},
        label: {
          show: item.visibleLabel,
          color: '#fff',
        },
      };
      // 折线图添加平均线
      if ((item.type === 'line' || item.type === 'bar') && item.averageLine) {
        seriesItem.markLine = {
          data: [
            {
              type: 'average',
              name: '平均值',
              label: {
                show: true,
                position: 'middle',
              },
            },
          ],
        };
      }
      // 柱状图堆叠设置
      if (item.type === 'bar') {
        item.stack && (seriesItem.stack = item.stack);
      }

      // 饼图特殊处理
      if (item.type === 'pie') {
        if (item.radius.length === 2 && item.radius[0] && item.radius[1]) {
          seriesItem.radius = item.radius;
        } else {
          seriesItem.radius = item.radius[0] || '50%';
        }
        seriesItem.center = [item.center?.[0] || '50%', item.center?.[1] || '50%'];
        seriesItem.label.position = 'inside';
        seriesItem.tooltip.formatter = (params) => {
          return `<div>
              <div class="tooltip-name">${params.name}</div>
              <div class="percent"><span style="background:${params.color}" class="legend"></span>占比：${params.percent}%</div>
              <div class="number">数量：${params.value}</div>
            </div>
            `;
        };
        seriesItem.label.formatter = (params) => {
          return `${params.percent ? params.percent + '%' : ''}`;
        };
      } else if (item.type === 'radar') {
        // seriesItem.radius = item.radius || '75%';
        if (groupChartConfig.value.radar?.normalizeNumber) {
          seriesItem.tooltip.formatter = (params) => {
            const { dataIndex } = params;
            let parsedRadarDataOriginal = groupChartConfig.value.radar.originalData;
            let originalNames = groupChartConfig.value.radar.originalNames;
            let tooltipContent = `<div style="font-weight:bold;font-size:14px;padding-bottom:3px;">${params.name}</div>`;
            // 循环显示每个指标的原始值，前面加上小图标
            parsedRadarDataOriginal.forEach((item, index) => {
              if (index === dataIndex) {
                item.value.forEach((item2, index2) => {
                  tooltipContent += `
                    <div style="display:flex;align-items:center;margin:2px 0;">
                      <span style="color:${params.color};margin-right:8px;font-size:8px">●</span>
                      <span style="flex:1;">${originalNames[index2].name}</span>
                      <span style="font-weight:bold;margin-left:15px">${formatMoney(item2)}</span>
                    </div>
                  `;
                });
              }
            });
            return tooltipContent;
          };
        }
      } else {
        seriesItem.barMaxWidth = 40;
        // seriesItem.barMinWidth = 12;
        seriesItem.label.position = 'top';
      }

      return seriesItem;
    }),
  });

  // 只有当存在雷达图系列时，才添加 radar 配置
  if (hasRadarSeries && groupChartConfig.value.radar) {
    option.radar = {
      splitNumber: groupChartConfig.value.radar?.splitNumber || 4,
      axisNameGap: groupChartConfig.value.radar?.showValue ? 8 : 15,
      axisName: {
        formatter: function (value, params) {
          const maxLength = groupChartConfig.value.radar?.breakNum || 10; // 每行最大字符数
          let result = '';
          if (value.length > maxLength) {
            for (let i = 0; i < value.length; i += maxLength) {
              result += value.substring(i, i + maxLength) + '\n';
            }
          } else {
            result = value;
          }
          return groupChartConfig.value.radar?.showValue
            ? `${result.trim()}\n {value|${params.value}}`
            : result.trim();
        },
        rich: {
          value: {
            padding: [6, 0, 0, 0],
            color: '#101010',
            fontSize: 16,
            fontFamily: 'HarmonyOS Sans, HarmonyOS Sans Regular',
          },
        },
      },
      indicator:
        groupChartConfig.value.radar?.indicator.map((item) => {
          if (!item.max) {
            delete item.max;
          }
          return item;
        }) || [],
      radius: groupChartConfig.value.radar?.radius || '75%',
      center: [
        groupChartConfig.value.radar?.center?.[0] || '50%',
        groupChartConfig.value.radar?.center?.[1] || '50%',
      ],
    };
  }
  // 设置坐标轴
  let crossAxle;
  if (groupChartConfig.value?.crossAxle?.length > 0) {
    crossAxle = groupChartConfig.value.crossAxle.map((item, index) => {
      return {
        type: 'value',
        name: item.name || '',
        position: item.position || 'left',
        // alignTicks: true,
        minInterval: 1,
        // nameLocation: 'middle',
        // nameTextStyle: {
        //   padding: item.position == 'left' ? [0, 0, 50, 0] : [50, 0, 0, 0],
        // },
        splitLine: { show: index == 0 },
        axisLine: {
          show: true,
          lineStyle: {
            color: item.color || '#333',
          },
        },
      };
    });
  } else {
    crossAxle = {
      type: 'value',
      minInterval: 1,
    };
  }
  let cateAxle = {
    type: groupChartConfig.value.cateAxle.type || 'category',
    data: groupChartConfig.value.cateAxle.data || [],
    axisLabel: {
      alignWithLabel: true,
      interval: 0, // 强制显示所有标签
      // 或者使用换行显示
      formatter: function (value) {
        // 如果文本长度超过指定字符数，则使用省略号
        const maxLength = 5; // 最大显示字符数
        return value.length > maxLength ? value.substring(0, maxLength - 1) + '...' : value;
      },
    },
  };

  if (groupChartConfig.value.cateAxleType === 'x') {
    option.xAxis = cateAxle;
    option.yAxis = crossAxle;
    if (groupChartConfig.value.enableZoom) {
      option.dataZoom = [
        {
          type: 'inside', // 保留内置缩放
          zoomOnMouseWheel: true, // 允许滚轮缩放
          moveOnMouseMove: true, // 允许拖动平移
          xAxisIndex: [0],
          startValue: 0, // 起始显示第一个数据点
          endValue: 10,
          minValueSpan: 2,
          // maxValueSpan: groupChartConfig.value.maxValueSpan,
        },
      ];
    }
  } else {
    if (groupChartConfig.value.enableZoom) {
      option.dataZoom = [
        {
          type: 'inside', // 保留内置缩放
          zoomOnMouseWheel: true, // 允许滚轮缩放
          moveOnMouseMove: true, // 允许拖动平移
          startValue: 0,
          endValue: 10,
          maxValueSpan: 10,
          minValueSpan: 2,
          yAxisIndex: [0],
        },
      ];
    }
    option.yAxis = cateAxle;
    option.xAxis = crossAxle;
    option.yAxis.inverse = true;
  }
  // 当serise中有且只有一个饼图时，则不添加xAxis和yAxis属性
  if (onlySpecialChart) {
    delete option.yAxis;
    delete option.xAxis;
  }
  if (hasLineChart) {
    option.legend.data = groupChartConfig.value.series.map((item) => {
      return Object.assign(
        {
          name: item.name,
        },
        item.type == 'line'
          ? {
              icon: 'line',
              itemStyle: {
                borderWidth: 3,
                borderColor: 'auto',
              },
            }
          : {},
      );
    });
  }
  // 如果有颜色配置，添加到option中
  if (groupChartConfig.value.color && groupChartConfig.value.color.length > 0) {
    option.color = groupChartConfig.value.color;
  }

  // 如果有标题配置，添加到option中
  option.title = {
    text: groupChartConfig.value.title?.text || '',
    left: groupChartConfig.value.title?.left || 'auto',
    right: groupChartConfig.value.title?.right || 'auto',
    top: groupChartConfig.value.title?.top || 'auto',
    bottom: groupChartConfig.value.title?.bottom || 'auto',
    textStyle: {
      fontSize: groupChartConfig.value.title?.fontSize || 15,
    },
    show: groupChartConfig.value.title?.show,
  };
  const clickParams = {
    table: {
      enable: false,
      paramsFn: () => {},
      params: null,
    },
    chart: {
      enable: false,
      paramsFn: () => {},
      params: null,
      connectCharts: [],
    },
  };

  if (groupChartConfig.value.events?.tableParamsFn && groupChartConfig.value?.enableTableUpdate) {
    try {
      // 解码Base64编码的表达式
      const decodedClickFn = base64ToUtf8(groupChartConfig.value.events?.tableParamsFn);
      const dynamicFunction = new Function(decodedClickFn);
      // 使用表达式解析数据;
      clickParams.table.enable = true;
      clickParams.table.paramsFn = dynamicFunction();
    } catch (error) {
      console.error(`解析点击事件表达式失败:`, error);
    }
  }
  if (groupChartConfig.value.events?.chartParamsFn && groupChartConfig.value?.enableChartUpdate) {
    try {
      // 解码Base64编码的表达式
      const decodedClickFn = base64ToUtf8(groupChartConfig.value.events?.tableParamsFn);
      const dynamicFunction = new Function(decodedClickFn);
      // 使用表达式解析数据;
      clickParams.chart.enable = true;
      clickParams.chart.paramsFn = dynamicFunction();
      clickParams.chart.connectCharts = groupChartConfig.value.connectCharts || [];
    } catch (error) {
      console.error(`解析点击事件表达式失败:`, error);
    }
  }
  handleClick = (params) => {
    clickParams.table.enable && (clickParams.table.params = clickParams.table.paramsFn(params));
    clickParams.chart.enable &&
      (clickParams.chart.params = {
        ...clickParams.chart.paramsFn(params),
        ...chartQueryParams,
      });
    emit('chart-click', clickParams);
  };
});
const dataCache = new Map(); // 用于缓存数据源的响应

// 生成ECharts选项
const envVariables = ref([]);
const envloaded = ref(false);
const { VITE_BASE_ENCRYPTION_KEY } = useGlobalConfig('env').value;
const encryption = new Encryption(VITE_BASE_ENCRYPTION_KEY);

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
const init = async (extraParams = {}) => {
  await getEnvVariables();
  chartRef.value?.clear();
  dataCache.clear();
  loading.value = true;

  // 收集所有唯一的数据源URL
  const sources = new Set();
  if (groupChartConfig.value.cateAxle.source) sources.add(groupChartConfig.value.cateAxle.source);
  if (groupChartConfig.value.cateAxle.source) sources.add(groupChartConfig.value.cateAxle.source);
  groupChartConfig.value.series.forEach((item) => {
    if (item.source) sources.add(item.source);
  });

  // 获取所有数据源的数据
  for (const source of sources) {
    if (!dataCache.has(source)) {
      try {
        const response = await _fetch({
          url: mapEnvVariable(source),
          method: 'post',
          data: { ...props.query, ...extraParams, ...chartQueryParams },
        });
        dataCache.set(source, response.data);
      } catch (error) {
        console.error(`获取数据源 ${source} 失败:`, error);
      }
    }
  }

  // 更新坐标轴数据（如果有数据源）
  if (
    groupChartConfig.value.cateAxle.source &&
    dataCache.has(groupChartConfig.value.cateAxle.source)
  ) {
    const axisData = dataCache.get(groupChartConfig.value.cateAxle.source);
    if (
      groupChartConfig.value.cateAxle.parseExp &&
      typeof groupChartConfig.value.cateAxle.parseExp === 'string'
    ) {
      try {
        // 使用表达式解析数据
        const decodedExp = base64ToUtf8(groupChartConfig.value.cateAxle.parseExp);

        const dynamicFunction = new Function(decodedExp);
        const parsedAxisData = dynamicFunction()(axisData);

        const axisType = groupChartConfig.value.cateAxleType === 'x' ? 'xAxis' : 'yAxis';

        option[axisType].data = parsedAxisData;
      } catch (error) {
        console.error('解析坐标轴数据表达式失败:', error);
      }
    } else {
      // 默认使用rowData作为数据源
      const axisType = groupChartConfig.value.cateAxleType === 'x' ? 'xAxis' : 'yAxis';
      option[axisType].data = axisData.rowData || axisData;
    }
  }
  // 更新雷达指示器数据
  if (groupChartConfig.value.radar?.source && dataCache.has(groupChartConfig.value.radar.source)) {
    const radarData = dataCache.get(groupChartConfig.value.radar.source);
    if (groupChartConfig.value.radar.parseExp) {
      try {
        // 解码Base64编码的表达式
        const decodedExp = base64ToUtf8(groupChartConfig.value.radar.parseExp);
        const dynamicFunction = new Function(decodedExp);
        const parsedRadarData = dynamicFunction()(radarData);
        option.radar.indicator = parsedRadarData;
        if (groupChartConfig.value.radar?.normalizeNumber) {
          option.radar.indicator = parsedRadarData.map((item) => ({
            ...item,
            max: 100,
          }));
          groupChartConfig.value.radar.originalNames = parsedRadarData;
        }
      } catch (error) {
        console.error('解析雷达指示器数据表达式失败:', error);
      }
    } else {
      // 默认使用rowData作为数据源
      option.radar.indicator = radarData.rowData || radarData;
    }
  }
  // 更新系列数据
  ringLabelList.value = [];

  groupChartConfig.value.series.forEach((series, index) => {
    if (series.source && dataCache.has(series.source)) {
      const seriesData = dataCache.get(series.source);
      if (series.parseExp) {
        try {
          // 解码Base64编码的表达式
          const decodedExp = base64ToUtf8(series.parseExp);
          const dynamicFunction = new Function(decodedExp);
          const parsedSeriesData = dynamicFunction()(seriesData);
          // 使用表达式解析数据;
          option.series[index].data = parsedSeriesData;
          const parsedRadarDataOriginal = JSON.parse(JSON.stringify(parsedSeriesData));
          //雷达图数据处理
          if (series.type === 'radar' && groupChartConfig.value.radar?.normalizeNumber) {
            option.series[index].data = normalizeRadarData(parsedSeriesData);
            groupChartConfig.value.radar.originalData = parsedRadarDataOriginal;
          }
          // 饼图中心label
          if (series.type === 'pie' && series.showCenterLabel) {
            ringLabelList.value.push({
              total: option.series[index].data.reduce((total, item) => {
                return Number(total) + Number(item.value);
              }, 0),
              unit: series.unit || '个',
              left: series.center?.[0] || '50%',
              top: series.center?.[1] || '50%',
            });
          }
        } catch (error) {
          console.error(`解析系列${index}数据表达式失败:`, error);
        }
      } else {
        // 默认使用rowData作为数据源
        option.series[index].data = seriesData.rowData || seriesData;
      }
    }
  });

  loading.value = false;

  console.log('option', option);
};

const chartId = computed(() => chartConfig.value.id);
// 创建一个 ref 引用 v-chart 组件
const chartRef = ref(null);
function normalizeRadarData(seriesData, offset = 5) {
  return seriesData.map((item) => {
    const maxVal = Math.max(...item.value);
    const minVal = Math.min(...item.value);
    const range = maxVal - minVal;
    let dataArr = [];
    item.value.map((item) => {
      dataArr.push(((Number(item) - minVal) / range) * (100 - offset) + offset);
    });
    return Object.assign(item, { value: dataArr });
  });
}
defineExpose({
  init,
  id: unref(chartId),
});
// 获取数据并更新图表
</script>

<template>
  <div class="flex flex-col" :class="[`col-span-${groupChartConfig.span || 6}`]">
    <div class="chart-filter-container">
      <div class="title">{{ chartConfig.name }}</div>
      <el-form
        v-if="chartConfig.enableFilter"
        ref="chartQueryRef"
        :model="chartQueryParams"
        label-position="right"
        label-suffix="："
      >
        <el-form-item
          style="margin-bottom: 0"
          :label="chartFilter['label']"
          :prop="chartFilter['field']"
        >
          <el-select
            ref="select"
            v-model="chartQueryParams[chartFilter.field]"
            placeholder="请选择"
            style="min-width: 100px; max-width: 180px"
            @change="onFilterChange"
          >
            <el-option
              v-for="dict in chartFilter['options']"
              :key="dict['value']"
              :label="dict['label']"
              :value="dict['value']"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div style="position: relative">
      <v-chart
        ref="chartRef"
        :style="{ height }"
        class="chart"
        :option="option"
        autoresize
        :loading="loading"
        @click="handleClick"
      />
      <template v-if="!loading">
        <div
          v-for="(item, index) in ringLabelList"
          :key="index"
          class="ring-label"
          :style="{ top: item.top, left: item.left }"
        >
          <div class="total">{{ item.total || 0 }}</div>
          <div class="unit">{{ item.unit || '个' }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* stylelint-disable font-family-no-missing-generic-family-keyword */
.chart {
  /* height: 100%; */
  height: 312px;
}

.chart-filter-container {
  .title {
    font-family: 'HarmonyOS Sans SC', 'HarmonyOS Sans SC-Regular';
    font-size: 16px;
    font-weight: 600;
    color: #101010;
    text-align: left;
  }

  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 58px;
  padding: 8px 24px;
  border-bottom: 1px solid #ebeef5;
}

.ring-label {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -50%);

  .total {
    font-size: 32px;
    font-weight: 600;
    color: rgb(0 0 0 / 85%);
    opacity: 0.85;
  }

  .unit {
    margin-top: -10px;
    font-size: 18px;
    color: #000;
    opacity: 0.45;
  }
}

:deep(.tooltip-name) {
  font-family: 'HarmonyOS Sans SC', 'HarmonyOS Sans SC-Regular';
  font-size: 12px;
  color: #4b4b4b;
}

:deep(.percent) {
  position: relative;
  margin-left: 20px;
  font-family: 'HarmonyOS Sans SC', 'HarmonyOS Sans SC-Regular';
  font-size: 12px;
  color: #101010;

  .legend {
    position: absolute;
    top: 6px;
    left: -14px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
}

:deep(.number) {
  margin-left: 20px;
  font-family: 'HarmonyOS Sans SC', 'HarmonyOS Sans SC-Regular';
  font-size: 12px;
  color: #101010;
}
</style>
