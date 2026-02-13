<script lang="ts" setup>
import { ref } from 'vue'
import type { TransferKey, TransferDirection, renderContent } from 'element-plus'

interface Option {
  key: number
  label: string
  disabled: boolean
}

const generateData = (): Option[] => {
  const data: Option[] = []
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `Option ${i}`,
      disabled: i % 4 === 0,
    })
  }
  return data
}

const data = ref<Option[]>(generateData())
const value = ref([1])

const renderFunc: renderContent = (h, option) => h('span', null, option.label)

const handleChange = (
  value: TransferKey[],
  direction: TransferDirection,
  movedKeys: TransferKey[],
) => {
  console.log(value, direction, movedKeys)
}
</script>

<template>
  <el-card class="mb-2">
    <template #header>自定义</template>

    <div>
      <el-transfer
        v-model="value"
        filterable
        :left-default-checked="[2, 3]"
        :right-default-checked="[1]"
        :render-content="renderFunc"
        :titles="['Source', 'Target']"
        :button-texts="['To left', 'To right']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
        :data="data"
        @change="handleChange"
      >
        <template #left-footer>
          <el-button class="ml-2" size="small">Operation</el-button>
        </template>
        <template #right-footer>
          <el-button class="ml-2" size="small">Operation</el-button>
        </template>
      </el-transfer>
    </div>
  </el-card>
</template>
