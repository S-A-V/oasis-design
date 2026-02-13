<script setup>
import { useFullscreen } from '@vueuse/core';
import { ElIcon } from 'element-plus';
import FullScreen from './images/full_screen.vue';
import ExitScreen from './images/exit_screen.vue';

defineOptions({
  name: 'WFullScreen',
});

const { isFullscreen, enter, exit, toggle } = useFullscreen();
</script>

<template>
  <div @click="toggle">
    <!-- <img class="fullscreen-icon" :src="isFullscreen ? ExitIcon : EnterIcon" /> -->

    <el-icon>
      <exit-screen v-if="isFullscreen"></exit-screen>
      <full-screen v-else></full-screen>
    </el-icon>
  </div>
</template>

<style lang="scss" scoped>
.screenfull-svg {
  display: inline-block;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
  cursor: pointer;
  fill: #5a5e66;
}
</style>
