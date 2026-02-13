<script lang="ts" setup>
import dayjs from 'dayjs'
import { ref } from 'vue'

const value = ref([null, dayjs().format('YYYY-MM-DD')])

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}
</script>

<template>
  <el-card class="mb-2">
    <template #header>基础用法</template>

    <div>
      <w-date-range-picker v-model="value" value-format="YYYY-MM-DD" :disabled-date="disabledDate" />
    </div>
  </el-card>
</template>
