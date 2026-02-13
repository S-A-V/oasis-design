<script setup>
import { Close as CloseIcon } from '@element-plus/icons-vue';
import { WSvgIcon } from '../../../svg-icon';

defineOptions({ name: 'MenuButton' });
defineProps({
  icon: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  active: {
    type: Boolean,
    default: false,
  },
  closable: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<template>
  <div class="menu-button" :class="{ active: active }">
    <w-svg-icon v-if="icon && icon !== '#'" :name="icon" class="icon" />
    <span class="text">{{ text }}</span>
    <span v-if="closable" class="icon" @click.prevent.stop="close">
      <close-icon class="el-icon-close" />
    </span>
  </div>
</template>

<style scoped lang="scss">
.menu-button {
  display: inline-flex;
  align-items: center;
  max-width: 102px;
  height: 32px;
  padding: 0 12px;
  cursor: pointer;

  // background-color: rgb(from #fff r g b / 20%);
  background-color: rgb(255 255 255 / 20%);
  border-radius: 6px;

  &.active {
    color: var(--way-color-primary);
    background-color: var(--way-color-white);
  }

  .text {
    min-width: 0;
    overflow: hidden;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon {
    + .text {
      margin-left: 6px;
    }
  }
}

.icon {
  flex-shrink: 0;
}

.el-icon-close {
  width: 1em;
  height: 1em;
  margin: 0 0 0 4px;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transform-origin: 100% 50%;

  &::before {
    display: inline-block;
    vertical-align: -3px;
    transform: scale(0.6);
  }

  &:hover {
    // width: 12px !important;
    // height: 12px !important;
    color: var(--way-color-white);
    background-color: #b4bccc;
  }
}
</style>
