<template>
  <div class="w-table-container">
    <el-card shadow="never">
      <template v-if="$slots.header" #header>
        <slot name="header"></slot>
      </template>
      <slot></slot>
      <template v-if="$slots.footer" #footer>
        <slot name="footer"></slot>
      </template>
    </el-card>
  </div>
</template>

<script setup>
import { ElCard } from 'element-plus';

defineOptions({
  name: 'WTableContainer',
});
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  --el-card-border-radius: 0;

  display: flex;
  flex-direction: column;
  height: 100%;
  border: 0;
}

:deep(.el-card__header) {
  border: 1px solid var(--el-card-border-color);
  border-bottom: 0;
}

:deep(.el-card__body) {
  flex-grow: 1;
  min-height: 0;
  padding: 0;
}

:deep(.el-card__footer) {
  border: 1px solid var(--el-card-border-color);
  border-top: 0;
}
</style>

<style lang="scss">
.w-table-container {
  flex-grow: 1;
  min-height: 0;
  padding: 8px;

  .el-loading-mask {
    margin: 1px;
  }
}
</style>
