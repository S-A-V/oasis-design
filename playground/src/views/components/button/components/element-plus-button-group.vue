<template>
  <el-card class="mb-2">
    <template #header>按钮组</template>

    <div class="mb-4">
      <el-button-group type="primary">
        <el-button>
          <template #icon><i-ep-edit /></template>
        </el-button>
        <el-button>
          <template #icon><i-ep-share /></template>
        </el-button>
        <el-button>
          <template #icon><i-ep-delete /></template>
        </el-button>
      </el-button-group>
    </div>

    <div>
      <el-button-group type="danger" size="small">
        <el-button>
          <template #icon><i-ep-edit /></template>
        </el-button>
        <el-button>
          <template #icon><i-ep-share /></template>
        </el-button>
        <el-button>
          <template #icon><i-ep-delete /></template>
        </el-button>
      </el-button-group>
    </div>
  </el-card>
</template>
