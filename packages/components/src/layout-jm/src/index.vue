<template>
  <el-container :class="classObj" :style="{ height: '100vh' }">
    <el-header height="64px">
      <nav-bar :options="navBarOptions" @set-layout="setLayout" />
    </el-header>
    <el-container :style="{ minHeight: 0 }">
      <el-aside :width="sidebar.opened ? '204px' : '60px'" :style="{ overflow: 'hidden' }">
        <side-bar v-if="!sidebar.hide" />
      </el-aside>
      <el-main :style="{ padding: 0 }">
        <app-main />
      </el-main>
    </el-container>
  </el-container>
  <setting-drawer ref="settingRef" />
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElContainer, ElHeader, ElAside, ElMain } from 'element-plus';
import { useAppStore } from '@way-ui/stores';
import SideBar from './components/side-bar/index.vue';
import { AppMain, NavBar, SettingDrawer } from './components';

defineOptions({ name: 'WLayoutJm' });

defineProps({
  // 导航栏图标功能配置
  navBarOptions: { type: Array, default: () => [] },
});

const sidebar = computed(() => useAppStore().sidebar);

const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
}));

const settingRef = ref(null);
function setLayout() {
  settingRef.value.openSetting();
}
</script>

<style lang="scss">
body {
  // --min-content-width: 1200px;
  --sidebar-width: 204px;
  --min-content-width: 0px;
  --base-menu-color: #fff;
  --base-menu-color-active: #fff;
  --base-menu-background: #020b17;
  --base-logo-title-color: #fff;
  --base-menu-light-color: rgb(0 0 0 / 70%);
  --base-menu-light-background: #fff;
  --base-logo-light-title-color: #001529;
  --base-sub-menu-background: #020b17;
  --base-sub-menu-hover: #001528;

  background-color: #f5f6fa;
}
</style>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */

@mixin clearfix {
  &::after {
    display: table;
    clear: both;
    content: '';
  }
}

$base-sidebar-width: var(--sidebar-width);

.main-container {
  position: relative;
  height: 100%;
  margin-left: $base-sidebar-width;
  overflow-y: auto;
  background-color: #f5f6fa;
  transition: margin-left 0.28s;
}

.sidebarHide {
  margin-left: 0 !important;
}

.hideSidebar {
  .main-container {
    margin-left: 60px;
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
</style>
