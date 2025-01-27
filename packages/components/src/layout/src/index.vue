<template>
  <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <side-bar v-if="!sidebar.hide" class="sidebar-container" />
    <div
      :class="{
        'header-fixed': fixedHeader,
        hasTagsView: needTagsView,
        sidebarHide: sidebar.hide,
      }"
      class="main-container"
    >
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar @set-layout="setLayout" />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <settings ref="settingRef" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect } from 'vue';
import { useWindowSize } from '@vueuse/core';
import SideBar from './components/Sidebar/index.vue';
import { AppMain, Navbar, Settings, TagsView } from './components';
// import defaultSettings from '@/settings';

import useAppStore from '@/store/modules/app';
import useSettingsStore from '@/store/modules/settings';

defineOptions({
  name: 'WLayout',
});

const settingsStore = useSettingsStore();
const theme = computed(() => settingsStore.theme);
// const sideTheme = computed(() => settingsStore.sideTheme);
const sidebar = computed(() => useAppStore().sidebar);
const device = computed(() => useAppStore().device);
const needTagsView = computed(() => settingsStore.tagsView);
const fixedHeader = computed(() => settingsStore.fixedHeader);

const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === 'mobile',
}));

const { width } = useWindowSize();
const WIDTH = 992; // refer to Bootstrap's responsive design

watch(
  () => device.value,
  () => {
    if (device.value === 'mobile' && sidebar.value.opened) {
      useAppStore().closeSideBar({ withoutAnimation: false });
    }
  },
);

watchEffect(() => {
  if (width.value - 1 < WIDTH) {
    useAppStore().toggleDevice('mobile');
    useAppStore().closeSideBar({ withoutAnimation: true });
  } else {
    useAppStore().toggleDevice('desktop');
  }
});

function handleClickOutside() {
  useAppStore().closeSideBar({ withoutAnimation: false });
}

const settingRef = ref(null);
function setLayout() {
  settingRef.value.openSetting();
}
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */

@use '@/assets/styles/mixin' as *;

$base-sidebar-width: var(--sidebar-width);

.main-container {
  position: relative;
  height: 100%;
  margin-left: $base-sidebar-width;
  overflow-y: auto;
  background-color: #f5f6fa;
  transition: margin-left 0.28s;

  &.header-fixed {
    padding-top: 64px;
    overflow-y: hidden;

    .app-main {
      height: calc(100vh - 64px);
      min-height: unset;
    }

    &.hasTagsView {
      padding-top: 108px;

      .app-main {
        height: calc(100vh - 108px);
        min-height: unset;
      }
    }
  }
}

.sidebarHide {
  margin-left: 0 !important;
}

.hideSidebar {
  .main-container {
    margin-left: 57px;
  }
}

.mobile {
  .main-container {
    margin-left: 0;
  }
}

.withoutAnimation {
  .main-container {
    transition: none;
  }
}

.app-wrapper {
  @include clearfix;

  position: relative;
  width: 100%;
  height: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  position: absolute;
  top: 0;
  z-index: 2001;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.3;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}
</style>
