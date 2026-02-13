<template>
  <el-card class="mb-2">
    <template #header>基础用法</template>

    <div class="mb-4">
      <el-button>Default</el-button>
      <el-button type="primary">Primary</el-button>
      <el-button type="success">Success</el-button>
      <el-button type="info">Info</el-button>
      <el-button type="warning">Warning</el-button>
      <el-button type="danger">Danger</el-button>
    </div>

    <div class="mb-4">
      <el-button plain>Plain</el-button>
      <el-button type="primary" plain>Primary</el-button>
      <el-button type="success" plain>Success</el-button>
      <el-button type="info" plain>Info</el-button>
      <el-button type="warning" plain>Warning</el-button>
      <el-button type="danger" plain>Danger</el-button>
    </div>

    <div class="mb-4">
      <el-button round>Round</el-button>
      <el-button type="primary" round>Primary</el-button>
      <el-button type="success" round>Success</el-button>
      <el-button type="info" round>Info</el-button>
      <el-button type="warning" round>Warning</el-button>
      <el-button type="danger" round>Danger</el-button>
    </div>

    <div>
      <el-button circle>
        <template #icon><i-ep-search /></template>
      </el-button>
      <el-button type="primary" circle>
        <template #icon><i-ep-edit /></template>
      </el-button>
      <el-button type="success" circle>
        <template #icon><i-ep-check /></template>
      </el-button>
      <el-button type="info" circle>
        <template #icon><i-ep-message /></template>
      </el-button>
      <el-button type="warning" circle>
        <template #icon><i-ep-star /></template>
      </el-button>
      <el-button type="danger" circle>
        <template #icon><i-ep-delete /></template>
      </el-button>
    </div>
  </el-card>
</template>
