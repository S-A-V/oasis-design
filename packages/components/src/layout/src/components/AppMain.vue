<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <!-- <transition name="fade-transform" mode="out-in"> -->
      <keep-alive :include="tagsViewStore.cachedViews">
        <component :is="Component" v-if="!route.meta.link" :key="route.path" />
      </keep-alive>
      <!-- </transition> -->
    </router-view>
    <iframe-toggle />
  </section>
</template>

<script setup>
import { useTabbarStore as useTagsViewStore } from '@way-ui/stores';
import iframeToggle from './IframeToggle/index.vue';

const tagsViewStore = useTagsViewStore();
</script>

<style lang="scss" scoped>
.app-main {
  position: relative;
  width: 100%;
  min-width: var(--min-content-width);

  /* 64 = navbar  64  */
  min-height: calc(100vh - 64px);
  overflow: hidden;

  // overflow: auto;
}

// .fixed-header + .app-main {
//   padding-top: 64px;
// }

/* stylelint-disable-next-line selector-class-pattern */
.hasTagsView {
  .app-main {
    /* 108 = navbar + tags-view = 64 + 44 */
    min-height: calc(100vh - 108px);
  }

  // .fixed-header + .app-main {
  //   padding-top: 108px;
  // }
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
