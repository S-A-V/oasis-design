<template>
  <el-card shadow="never">
    <el-button
      v-if="enableExpand"
      class="toggle-btn"
      :icon="expanded ? ArrowUp : ArrowDown"
      @click="handleExpand"
    >
      {{ expanded ? '收起筛选' : '更多筛选' }}
    </el-button>

    <div :style="{ minWidth: 'fit-content' }">
      <div
        class="form-container"
        :style="{ maxHeight: expanded ? 'unset' : `${formContainerMaxHeight}px` }"
      >
        <div ref="conditionContainer">
          <slot></slot>
        </div>
      </div>

      <!-- 高级筛选 -->
      <div v-if="$slots.advanced" class="advanced-container">
        <div class="advanced-header">
          <span v-show="!advancedExpanded">更多筛选设置 试试</span>
          <div v-show="!advancedExpanded" class="advanced-button" @click="handleAdvancedExpand">
            高级筛选
            <el-icon class="advanced-button-icon">
              <!-- eslint-disable-next-line vue/max-template-depth -->
              <arrow-down />
            </el-icon>
          </div>
          <div v-show="advancedExpanded" class="advanced-button" @click="handleAdvancedExpand">
            收起筛选项
            <el-icon class="advanced-button-icon">
              <!-- eslint-disable-next-line vue/max-template-depth -->
              <arrow-up />
            </el-icon>
          </div>
        </div>
        <div v-show="advancedExpanded" class="advanced-content">
          <slot name="advanced"></slot>
        </div>
      </div>
    </div>

    <template v-if="$slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </el-card>
</template>

<script setup>
import { ref, computed, watch, onMounted, useTemplateRef, getCurrentInstance } from 'vue';
import { ElIcon, ElButton, ElCard, ElScrollbar } from 'element-plus';
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';
import { useLocalStorage, useWindowSize, useElementVisibility } from '@vueuse/core';
import { LOCAL_STORAGE_KEYS } from '@way-ui/constants';
import { addUnit } from '@way-ui/internal-utils';

defineOptions({
  name: 'WSearchContainerJm',
});

const props = defineProps({
  defaultRows: {
    type: Number,
    default: 2,
  },
  /**
   * 每行显示的控件数量，默认 auto-fill 自适应
   *
   * 如果需要固定列数，可以传入数字，例如 3
   */
  columns: {
    type: [Number, String],
    default: 'auto-fill',
  },
  // 控件宽度
  controlWidth: {
    type: [String, Number],
    default: '230px',
  },
});

const { proxy } = getCurrentInstance();
const style = ref({
  el_card_body: {
    display: proxy.$slots.default ? 'block' : 'none',
  },
  el_card_footer: {
    border_top_width: proxy.$slots.default ? '1px' : '0',
  },
});
const controlStyle = computed(() => {
  return {
    width: addUnit(props.controlWidth),
  };
});
const expanded = ref(false);
const advancedExpanded = ref(false);
const conditionContainerRef = useTemplateRef('conditionContainer');
const isConditionContainerVisible = useElementVisibility(conditionContainerRef);
const conditionContainerHeight = ref(0);
const { width: windowWidth } = useWindowSize();
const formContainerMaxHeight = computed(() => {
  const size = useLocalStorage(LOCAL_STORAGE_KEYS.LAYOUT_SETTING, { size: 'default' }).value.size;
  return props.defaultRows * { large: 52, default: 44, small: 36 }[size];
});
const enableExpand = computed(() => {
  return conditionContainerHeight.value > formContainerMaxHeight.value;
});

function handleExpand() {
  expanded.value = !expanded.value;
}

function handleAdvancedExpand() {
  advancedExpanded.value = !advancedExpanded.value;
}

function calcConditionContainerHeight() {
  conditionContainerHeight.value = conditionContainerRef.value.clientHeight;
}

watch([windowWidth, isConditionContainerVisible], () => {
  calcConditionContainerHeight();
});

onMounted(() => {
  calcConditionContainerHeight();
});
</script>

<style lang="scss" scoped>
$default-input-width: var(--control-width);

:deep(.el-autocomplete) {
  --el-input-width: #{$default-input-width};
}

:deep(.el-cascader) {
  width: #{$default-input-width};
}

:deep(.el-date-editor) {
  --el-date-editor-width: #{$default-input-width};
  --el-date-editor-monthrange-width: #{$default-input-width};
  --el-date-editor-daterange-width: #{$default-input-width};
}

:deep(.el-input) {
  --el-input-width: #{$default-input-width};
}

:deep(.el-input-tag) {
  --el-input-tag-width: #{$default-input-width};
}

:deep(.el-select) {
  --el-select-width: #{$default-input-width};
}

:deep(.el-card__body) {
  display: v-bind('style.el_card_body.display');
  padding: 12px 0 0;
}

:deep(.el-card__footer) {
  padding: 12px 16px;
  border-top-width: v-bind('style.el_card_footer.border_top_width');
}

:deep(.el-form) {
  $column-width: calc(124px + #{$default-input-width});

  --column-count: v-bind('props.columns');
  --control-width: v-bind('controlStyle.width');

  display: grid;
  grid-template-columns: repeat(var(--column-count), $column-width);
  gap: 0;
  min-width: fit-content;
}

:deep(.el-form-item) {
  align-self: flex-start;
  margin-right: 0;
  margin-bottom: 12px;
}

.el-card {
  --el-card-border-radius: 0;

  flex-shrink: 0;
  border-inline-width: 0;
}

.toggle-btn {
  position: absolute;
  right: 48px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  transform: translateY(calc(-12px - 100%));
}

.form-container {
  $column-width: calc(124px + #{$default-input-width});

  --column-count: v-bind('props.columns');
  --control-width: v-bind('controlStyle.width');

  min-width: fit-content;
  overflow-y: hidden;
  transition: max-height 0.5s;

  > div {
    min-width: fit-content;
    padding-right: 12px;
  }
}

.advanced {
  &-header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    line-height: 20px;
    background-color: var(--way-color-primary-10);
  }

  &-button {
    display: inline-flex;
    align-items: center;
    margin-left: 4px;
    color: var(--way-color-primary);
    cursor: pointer;

    &-icon {
      margin-left: 4px;
    }
  }

  &-content {
    padding-top: 12px;
    padding-right: 12px;
  }
}
</style>
