<template>
  <div>
    <el-dropdown trigger="click" @command="handleSetSize">
      <div class="size-icon--style">
        <w-svg-icon class="size-icon" name="size" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item of sizeOptions"
            :key="item.value"
            :disabled="size === item.value"
            :command="item.value"
          >
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import { useAppStore } from '@way-ui/stores';
import { $modal } from '@way-ui/plugins';
import { WSvgIcon } from '../../svg-icon';

defineOptions({
  name: 'WSizeSelect',
});

const appStore = useAppStore();
const size = computed(() => appStore.size);
const sizeOptions = ref([
  { label: '较大', value: 'large' },
  { label: '默认', value: 'default' },
  { label: '稍小', value: 'small' },
]);

function handleSetSize(size) {
  $modal.loading('正在设置布局大小，请稍候...');
  appStore.setSize(size);
  setTimeout('window.location.reload()', 1000);
}
</script>

<style lang="scss" scoped>
/* stylelint-disable-next-line selector-class-pattern */
.size-icon--style {
  padding-right: 7px;
  font-size: 18px;
  line-height: 50px;
}
</style>
