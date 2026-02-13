<script lang="ts" setup>
import dayjs from 'dayjs'
import { ref, useTemplateRef, onMounted } from 'vue'
import type { DatePickerInstance } from 'element-plus'

const datePickerRef = useTemplateRef<DatePickerInstance>('datePicker')
const value = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

onMounted(() => {
  setTimeout(() => {
    datePickerRef.value?.focus()
  }, 3000);
})
</script>

<template>
  <el-card class="mb-2">
    <template #header>基础用法</template>

    <div>
      <w-date-picker ref="datePicker" v-model="value" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
        :disabled-date="disabledDate" />
    </div>
  </el-card>
</template>
