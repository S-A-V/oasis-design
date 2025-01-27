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

    <div
      class="form-container"
      :style="{ maxHeight: expanded ? 'unset' : `${formContainerMaxHeight}px` }"
    >
      <div ref="conditionContainer">
        <slot></slot>
      </div>
    </div>

    <template v-if="$slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </el-card>
</template>

<script setup>
import Cookies from 'js-cookie';
import { ref, computed, watch, onMounted, useTemplateRef, getCurrentInstance } from 'vue';
import { ElButton, ElCard } from 'element-plus';
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';
import { useWindowSize, useElementVisibility } from '@vueuse/core';

defineOptions({
  name: 'WSearchContainer',
});

const props = defineProps({
  defaultRows: {
    type: Number,
    default: 1,
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
const expanded = ref(false);
const conditionContainerRef = useTemplateRef('conditionContainer');
const isConditionContainerVisible = useElementVisibility(conditionContainerRef);
const conditionContainerHeight = ref(0);
const { width: windowWidth } = useWindowSize();
const formContainerMaxHeight = computed(() => {
  const size = Cookies.get('size') || 'default';
  return props.defaultRows * { large: 52, default: 44, small: 36 }[size];
});
const enableExpand = computed(() => {
  return conditionContainerHeight.value > formContainerMaxHeight.value;
});

function handleExpand() {
  expanded.value = !expanded.value;
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
$default-input-width: min(230px, 100%);

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

:deep(.el-button) {
  + .el-button {
    margin-left: 16px;
  }
}

:deep(.el-card__body) {
  display: v-bind('style.el_card_body.display');
  padding: 12px 12px 0 0;
}

:deep(.el-card__footer) {
  padding: 12px 16px;
  border-top-width: v-bind('style.el_card_footer.border_top_width');
}

:deep(.el-form) {
  $column-width: calc(124px + #{$default-input-width});

  --column-count: 3;

  display: grid;
  grid-template-columns: repeat(var(--column-count), $column-width);
  gap: 0;
}

@media only screen and (width >= 1920px) {
  :deep(.el-form) {
    --column-count: 4;
  }
}

:deep(.el-form-item) {
  align-self: flex-start;
  margin-right: 0;
  margin-bottom: 12px;
}

.el-card {
  --el-card-border-radius: 0;

  flex-shrink: 0;
}

.toggle-btn {
  position: absolute;
  right: 48px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  transform: translateY(calc(-12px - 100%));
}

.form-container {
  overflow: hidden;
  transition: max-height 0.5s;
}
</style>
