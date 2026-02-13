<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount, useAttrs } from 'vue';
import { ElDatePicker } from 'element-plus';
import { autoCompleteDateTime } from '@way-ui/utils/auto-complete-date-time';
import { useAutoCompleteDateInputManually } from '@way-ui/hooks';

defineOptions({ name: 'WDatePicker' });

const props = defineProps({
  modelValue: { type: String, required: true },
  type: { type: String, default: 'date' },
  disabledDate: { type: Function, default: undefined },
});

const emit = defineEmits(['update:modelValue', 'blur']);

const datePickerModel = computed({
  get: () => props.modelValue ?? '',
  set: (val) => emit('update:modelValue', val),
});

const attrs = useAttrs();
const baseDatePickerRef = ref(null);
const format = computed(() => (props.type === 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'));

let cleanupFn = null;

const initAutoCompleteDate = async () => {
  if (cleanupFn) cleanupFn();
  cleanupFn = await useAutoCompleteDateInputManually([
    {
      ref: baseDatePickerRef,
      model: datePickerModel,
      format: format.value,
      disabledDate: props.disabledDate,
    },
  ]);
};

watch(
  () => [props.type, props.disabledDate],
  () => initAutoCompleteDate(),
);

onMounted(async () => await initAutoCompleteDate());
onBeforeUnmount(() => {
  if (cleanupFn) cleanupFn();
});

const datePickerBlur = (e) => {
  if (props.type === 'datetime') {
    const current = datePickerModel.value;
    if (current) datePickerModel.value = autoCompleteDateTime(current);
  }
  emit('blur', e);
};

defineExpose({
  focus: () => baseDatePickerRef.value?.focus(),
});
</script>

<template>
  <el-date-picker
    v-bind="attrs"
    ref="baseDatePickerRef"
    v-model="datePickerModel"
    :type="props.type"
    :disabled-date="props.disabledDate"
    @blur="datePickerBlur"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </el-date-picker>
</template>
