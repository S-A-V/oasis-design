<script setup>
import { watchEffect } from 'vue';
import { ElDatePicker, ElFormItem, ElTooltip } from 'element-plus';
import { computed, ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import SvgIcon from '../components/svg-icon/index.vue';

const form = defineModel('form', { required: true, type: Object });
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  labelWidth: String,

  pickerType: {
    type: String,
    required: true,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  field: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD',
  },
  valueFormat: {
    type: String,
  },
  placeholder: {
    type: String,
    default: '请选择日期',
  },
  desc: {
    type: String,
  },
  _change: String,
});

const emit = defineEmits(['_change']);
const startTime = ref();
const endTime = ref();

watchEffect(() => {
  if (form.value[props.field]) {
    startTime.value = cloneDeep(form.value[props.field]?.[0]);
    endTime.value = cloneDeep(form.value[props.field]?.[1]);

    if (props?._change) {
      emit('_change', props._change, form.value[props.field]);
    }
  }
});
const genContent = () => {
  return {
    label: props.label,
    value: form.value[props.field],
  };
};
const disableBeginDate = (time) => {
  if (!form.value[props.field]?.[1]) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return time > new Date(form.value[props.field][1]) || time.getTime() > today.getTime();
};
const disableEndDate = (time) => {
  if (!form.value[props.field]?.[0]) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return time < new Date(form.value[props.field][0]) || time.getTime() > today.getTime();
};
const handleStartChange = (time) => {
  form.value[props.field] = [time, form.value[props.field]?.[1] || null];
};
const handleEndChange = (time) => {
  form.value[props.field] = [form.value[props.field]?.[0] || null, time];
};

defineExpose({
  genContent: genContent,
});
</script>

<template>
  <el-form-item :prop="field" :label-width="labelWidth">
    <template #label>
      <div class="label-container">
        <el-tooltip v-if="desc" effect="light" :content="desc" placement="top">
          <svg-icon size="16px" icon-name="icon-informationLine" color="#2F7DFF"></svg-icon>
        </el-tooltip>
        {{ label }}：
      </div></template
    >
    <div class="custom-range-picker">
      <el-date-picker
        v-model="startTime"
        :disabled-date="disableBeginDate"
        :value-format="valueFormat"
        :type="pickerType"
        placeholder="结束日期"
        :format="format"
        :clearable="clearable"
        @change="handleStartChange"
      ></el-date-picker>
      <span>-</span>
      <el-date-picker
        v-model="endTime"
        :disabled-date="disableEndDate"
        :value-format="valueFormat"
        :type="pickerType"
        placeholder="结束日期"
        :format="format"
        :clearable="clearable"
        @change="handleEndChange"
      ></el-date-picker>
    </div>
  </el-form-item>
</template>

<style scoped lang="scss">
.custom-range-picker {
  display: flex;
  gap: 4px;
}

.label-container {
  display: flex;
  gap: 2px;
  align-items: center;
}
</style>
