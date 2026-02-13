<script setup>
/**
 * @description: 日期区间选择器组件
 *
 * - UI 上拆分为两个单独的日期选择器（开始 / 结束）以便更灵活的交互控制；
 * - 对外保持单一 v-model（`modelValue`），数据为数组：`[start, end]`；
 * - 当内部任一选择变化时，组件会触发 `update:modelValue`，并发出 `change` 事件；
 * - 提供禁止选择逻辑（开始不能大于结束，结束不能小于开始）。
 */

import dayjs from 'dayjs';
import { ref, watch, useTemplateRef, onMounted, onBeforeUnmount } from 'vue';
import { ElDatePicker } from 'element-plus';
import { useAutoCompleteDateInputManually } from '@way-ui/hooks';

defineOptions({ name: 'WDateRangePicker' });

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [null, null],
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: '',
  },
  editable: {
    type: Boolean,
    default: true,
  },
  // 是否可清空
  clearable: {
    type: Boolean,
    default: true,
  },
  // 占位文本 [startPlaceholder, endPlaceholder]
  placeholder: {
    type: Array,
    default: () => ['开始日期', '结束日期'],
  },
  startPlaceholder: {
    type: String,
    default: '',
  },
  endPlaceholder: {
    type: String,
    default: '',
  },
  // 选择器类型，如 'date'|'datetime'|'month' 等，透传给 ElDatePicker
  type: {
    type: String,
    default: 'date',
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD',
  },
  // 分隔符文本（替代模板中的默认『-』）
  rangeSeparator: {
    type: String,
    default: '-',
  },
  valueFormat: {
    type: String,
    default: '',
  },
  // unlinkPanels: {
  //   type: Boolean,
  //   default: false,
  // },
  disabledDate: {
    type: Function,
    default: null,
  },
  disabledStartDate: {
    type: Function,
    default: null,
  },
  disabledEndDate: {
    type: Function,
    default: null,
  },
  // 允许传入额外的属性对象，会被 v-bind 到每个 el-date-picker
  pickerProps: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

const startPickerRef = useTemplateRef('startPicker');
const endPickerRef = useTemplateRef('endPicker');

// 内部状态（分别为开始和结束），不要在根作用域直接读取 props 的值以免丢失响应性
const start = ref(null);
const end = ref(null);

// 外部 modelValue 变化时同步到内部（包含首次同步）
watch(
  () => props.modelValue,
  (val) => {
    start.value = val && val.length > 0 ? val[0] : null;
    end.value = val && val.length > 1 ? val[1] : null;
  },
  { deep: true, immediate: true },
);

// 内部变化时通知外部（合并为数组）
watch([start, end], ([s, e]) => {
  emit('update:modelValue', [s ?? null, e ?? null]);
  emit('change', [s ?? null, e ?? null]);
});

// 禁止选择逻辑：开始不能大于结束；结束不能小于开始
function disabledStartDateFn(date) {
  if (!date) return false;
  if (props.disabledDate && props.disabledDate(date)) return true;
  if (props.disabledStartDate && props.disabledStartDate(date)) return true;
  if (!end.value) return false;
  try {
    const d = date instanceof Date ? date : new Date(date);
    const e = end.value instanceof Date ? end.value : new Date(end.value);
    // return d.getTime() > e.getTime();
    return dayjs(d).isAfter(dayjs(e), 'day');
  } catch {
    return false;
  }
}

function disabledEndDateFn(date) {
  if (!date) return false;
  if (props.disabledDate && props.disabledDate(date)) return true;
  if (props.disabledEndDate && props.disabledEndDate(date)) return true;
  if (!start.value) return false;
  try {
    const d = date instanceof Date ? date : new Date(date);
    const s = start.value instanceof Date ? start.value : new Date(start.value);
    // return d.getTime() < s.getTime();
    return dayjs(d).isBefore(dayjs(s), 'day');
  } catch {
    return false;
  }
}

// 清理自动补全输入的事件绑定
let cleanupAutoComplete = () => {};

// 初始化自动补全输入功能
const initAutoCompleteDateInput = async () => {
  cleanupAutoComplete();
  cleanupAutoComplete = await useAutoCompleteDateInputManually([
    { ref: startPickerRef, format: 'YYYY-MM-DD', model: start, disabledDate: disabledStartDateFn },
    { ref: endPickerRef, model: end, disabledDate: disabledEndDateFn },
  ]);
};

watch(
  () => [props.disabledDate, props.disabledStartDate, props.disabledEndDate],
  () => {
    initAutoCompleteDateInput();
  },
);

onMounted(() => {
  initAutoCompleteDateInput();
});

onBeforeUnmount(() => {
  cleanupAutoComplete();
});
</script>

<template>
  <div class="w-date-range">
    <!-- 开始日期 -->
    <el-date-picker
      ref="startPicker"
      v-model="start"
      :type="type"
      :placeholder="startPlaceholder || placeholder[0]"
      :clearable="clearable"
      :disabled="disabled"
      :disabled-date="disabledStartDateFn"
      :format="format"
      :value-format="valueFormat"
      :size="size"
      :readonly="readonly"
      :editable="editable"
      v-bind="pickerProps"
      class="w-date-range-picker"
    />

    <!-- 分隔符 -->
    <span class="w-date-range-sep">{{ rangeSeparator }}</span>

    <!-- 结束日期 -->
    <el-date-picker
      ref="endPicker"
      v-model="end"
      :type="type"
      :placeholder="endPlaceholder || placeholder[1]"
      :clearable="clearable"
      :disabled="disabled"
      :disabled-date="disabledEndDateFn"
      :format="format"
      :value-format="valueFormat"
      :size="size"
      :readonly="readonly"
      :editable="editable"
      v-bind="pickerProps"
      class="w-date-range-picker"
    />
  </div>
</template>

<style lang="scss" scoped>
.w-date-range {
  display: flex;

  // gap: 8px;
  align-items: center;
  width: 100%;
}

.w-date-range-picker {
  flex: 1;
}

.w-date-range-sep {
  padding: 0 6px;
  color: var(--el-text-color-primary);
}
</style>
