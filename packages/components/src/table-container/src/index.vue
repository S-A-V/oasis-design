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

<style lang="scss">
.w-table-container {
  flex-grow: 1;
  min-height: 0;

  .el-card {
    --el-card-border-radius: 0;

    display: flex;
    flex-direction: column;
    height: 100%;
    border: 0;
  }

  .el-card__header {
    padding: 0;
    border: 1px solid var(--el-card-border-color);
    border-bottom-width: 0;
  }

  .el-card__body {
    flex-grow: 1;
    min-height: 0;
    padding: 0;
  }

  .el-card__footer {
    padding: 0;
    border: 1px solid var(--el-card-border-color);
    border-top-width: 0;
  }

  .el-loading-mask {
    margin: 1px;
  }
}

@mixin set-table-border($top: 1px, $bottom: 1px) {
  .el-table__inner-wrapper::before {
    height: $bottom;
  }

  .el-table--border .el-table__inner-wrapper::after {
    height: $top;
  }
}

.el-dialog__body {
  --w-border: 1px solid var(--el-border-color-light);

  // 根节点
  > .w-table-container {
    .el-card__header {
      border-bottom-width: 1px;

      + .el-card__body {
        @include set-table-border($top: 0);
      }
    }

    &:first-child {
      @include set-table-border($top: 0);

      .el-card__header {
        border-top-width: 0;
      }
    }

    &:last-child {
      @include set-table-border($bottom: 0);

      &:first-child {
        @include set-table-border($top: 0, $bottom: 0);
      }

      .el-card__header {
        + .el-card__body {
          @include set-table-border($top: 0, $bottom: 0);
        }
      }
    }
  }

  // 非根节点
  div .w-table-container {
    @include set-table-border(0, 0);

    /* stylelint-disable-next-line no-descending-specificity */
    .el-card__header {
      border-top-width: 0;
      border-bottom-width: 1px;
    }

    .el-card__footer {
      border-bottom-width: 0;
    }
  }
}
</style>
