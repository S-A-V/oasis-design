<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <!-- <transition name="fade-transform" mode="out-in"> -->
      <keep-alive :include="tagsViewStore.cachedViews">
        <component :is="Component" v-if="!route.meta.link" :key="route.path" />
      </keep-alive>
      <!-- </transition> -->
    </router-view>
  </section>
</template>

<script setup>
import { useTabbarStore as useTagsViewStore } from '@way-ui/stores';

const tagsViewStore = useTagsViewStore();
</script>

<style lang="scss" scoped>
.app-main {
  position: relative;
  width: 100%;
  min-width: var(--min-content-width);
  height: 100%;
  overflow: hidden;
  background-color: #f5f6fa;

  // overflow: auto;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
// .el-popup-parent--hidden {
//   .fixed-header {
//     padding-right: 6px;
//   }
// }

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}
</style>
