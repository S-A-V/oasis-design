<template>
  <div
    :class="{ 'has-logo': showLogo }"
    :style="{
      backgroundColor:
        sideTheme === 'theme-dark'
          ? 'var(--base-menu-background)'
          : 'var(--base-menu-light-background)',
    }"
  >
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar :class="sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="
          sideTheme === 'theme-dark'
            ? 'var(--base-menu-background)'
            : 'var(--base-menu-light-background)'
        "
        :text-color="
          sideTheme === 'theme-dark' ? 'var(--base-menu-color)' : 'var(--base-menu-light-color)'
        "
        :unique-opened="true"
        :collapse-transition="false"
        mode="vertical"
        :popper-class="`sidebar-menu-popup-container ${sideTheme}`"
      >
        <sidebar-item
          v-for="(item, index) in sidebarRouters"
          :key="item.path + index"
          :item="item"
          :base-path="item.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup name="Sidebar">
import { computed, getCurrentInstance, toRef } from 'vue';
import { ElMenu, ElScrollbar } from 'element-plus';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import useAppStore from '@/store/modules/app';
import useSettingsStore from '@/store/modules/settings';
import usePermissionStore from '@/store/modules/permission';

const instance = getCurrentInstance();
const { $router } = instance.appContext.config.globalProperties;
const router = toRef($router);
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();

const sidebarRouters = computed(() => permissionStore.sidebarRouters);
const showLogo = computed(() => settingsStore.sidebarLogo);
const sideTheme = computed(() => settingsStore.sideTheme);
const isCollapse = computed(() => !appStore.sidebar.opened);

const activeMenu = computed(() => {
  const { meta, path } = router.value.currentRoute;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});
</script>

<style lang="scss">
/* stylelint-disable no-descending-specificity */
/* stylelint-disable selector-class-pattern */

body {
  $base-menu-color: var(--base-menu-color);
  $base-menu-color-active: var(--base-menu-color-active);
  $base-menu-background: var(--base-menu-background);
  $base-logo-title-color: var(--base-logo-title-color);
  $base-menu-light-color: var(--base-menu-light-color);
  $base-menu-light-background: var(--base-menu-light-background);
  $base-logo-light-title-color: var(--base-logo-light-title-color);
  $base-sub-menu-background: var(--base-sub-menu-background);
  $base-sub-menu-hover: var(--base-sub-menu-hover);
  $base-sidebar-width: var(--sidebar-width);

  .sidebar-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 2001;
    width: $base-sidebar-width !important;
    height: 100%;
    overflow: hidden;
    font-size: 0;
    background-color: $base-menu-background;
    box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
    transition: width 0.28s;

    // reset element-ui css
    .horizontal-collapse-transition {
      transition:
        0s width ease-in-out,
        0s padding-left ease-in-out,
        0s padding-right ease-in-out;
    }

    .scrollbar-wrapper {
      overflow-x: hidden !important;
    }

    .el-scrollbar__bar.is-vertical {
      right: 0;
    }

    .el-scrollbar {
      height: 100%;
    }

    &.has-logo {
      .el-scrollbar {
        height: calc(100% - 64px);
      }
    }

    .is-horizontal {
      display: none;
    }

    a {
      display: inline-block;
      width: 100%;
      overflow: hidden;
    }

    .w-svg-icon {
      margin-right: 10px;
      margin-left: 6px;
      font-size: 16px;
    }

    .el-menu {
      width: 100% !important;
      height: 100%;
      border: none;
    }

    .el-menu-item,
    .menu-title {
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }

    .el-menu-item {
      z-index: 1;

      &:hover {
        &::before {
          background-color: rgb(255 255 255 / 25%);
        }
      }

      &::before {
        position: absolute;
        right: 16px;
        left: 16px;
        z-index: -1;
        display: inline-block;

        // height: var(--el-menu-sub-item-height);
        height: 38px;
        content: '';
        background-color: transparent;
        border-radius: 8px;
        transition: background-color var(--el-transition-duration);
      }

      &.is-active {
        color: $base-menu-color-active;

        &::before {
          background-color: var(--el-menu-active-color);
        }
      }
    }

    // menu hover
    .sub-menu-title-noDropdown,
    .el-sub-menu__title {
      &:hover {
        background-color: rgb(0 0 0 / 6%) !important;
      }
    }

    & .theme-dark .is-active > .el-sub-menu__title {
      color: $base-menu-color-active !important;
    }

    & .nest-menu .el-sub-menu > .el-sub-menu__title,
    & .el-sub-menu .el-menu-item {
      min-width: $base-sidebar-width !important;

      &:hover {
        background-color: rgb(0 0 0 / 6%) !important;
      }

      .w-svg-icon {
        margin-right: 6px;
        font-size: 0;
        opacity: 0;
      }
    }

    & .theme-dark .nest-menu .el-sub-menu > .el-sub-menu__title,
    & .theme-dark .el-sub-menu .el-menu-item {
      background-color: $base-sub-menu-background !important;

      &:hover {
        background-color: $base-sub-menu-hover !important;
      }
    }
  }

  .hideSidebar .sidebar-container {
    width: 57px !important;

    .w-svg-icon {
      margin-right: 0;
      margin-left: 0;

      // font-size: 20px;
    }

    .el-menu-item {
      &::before {
        right: 12px;
        left: 12px;
        height: 32px;
      }
    }

    .sub-menu-title-noDropdown {
      position: relative;
      padding: 0 !important;

      .el-tooltip {
        padding: 0 !important;

        .w-svg-icon {
          margin-left: 20px;
        }
      }
    }

    .el-sub-menu {
      position: relative;
      z-index: 1;
      overflow: hidden;

      &:hover {
        &::before {
          background-color: rgb(255 255 255 / 25%);
        }
      }

      &::before {
        position: absolute;
        top: calc(var(--el-menu-item-height) / 2 - 16px);
        right: 13px;
        left: 12px;
        z-index: -1;
        display: inline-block;
        height: 32px;
        content: '';
        background-color: transparent;
        border-radius: 8px;
        transition: background-color var(--el-transition-duration);
      }

      &.is-active {
        color: $base-menu-color-active;

        &::before {
          background-color: var(--el-menu-active-color);
        }

        .el-sub-menu__title {
          color: $base-menu-color-active;
        }
      }

      & > .el-sub-menu__title {
        padding: 0 !important;

        .w-svg-icon {
          margin-left: 20px;
        }
      }
    }

    .el-menu--collapse {
      .el-sub-menu {
        & > .el-sub-menu__title {
          & > span {
            display: inline-block;
            width: 0;
            height: 0;
            overflow: hidden;
            visibility: hidden;
          }

          & > i {
            display: inline-block;
            width: 0;
            height: 0;
            overflow: hidden;
            visibility: hidden;
          }
        }
      }
    }
  }

  // .sidebar-container {
  //   .el-menu--collapse .el-menu .el-sub-menu {
  //     min-width: $base-sidebar-width !important;
  //   }
  // }

  // mobile responsive
  .mobile {
    .sidebar-container {
      width: $base-sidebar-width !important;
      transition: transform 0.28s;
    }

    &.hideSidebar {
      .sidebar-container {
        pointer-events: none;
        transition-duration: 0.3s;
        transform: translate3d(calc(0px - var(--sidebar-width)), 0, 0);
      }
    }
  }

  .withoutAnimation {
    .sidebar-container {
      transition: none;
    }
  }
}

// when menu collapsed
.sidebar-container {
  .el-menu--vertical {
    & > .el-menu {
      .w-svg-icon {
        margin-right: 16px;
      }
    }

    .nest-menu .el-sub-menu > .el-sub-menu__title,
    .el-menu-item {
      &:hover {
        // you can use $sub-menuHover
        background-color: rgb(0 0 0 / 6%) !important;
      }
    }

    // the scroll bar appears when the sub-menu is too long
    > .el-menu--popup {
      max-height: 100vh;
      overflow-y: auto;

      &::-webkit-scrollbar-track-piece {
        background: #d3dce6;
      }

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: #99a9bf;
        border-radius: 20px;
      }
    }
  }
}

.sidebar-menu-popup-container {
  --el-menu-item-height: 28px;
  --el-menu-base-level-padding: 12px;

  &.theme-dark {
    .el-menu-item {
      &:not(.is-active) {
        &:hover {
          background-color: rgb(255 255 255 / 25%) !important;
        }
      }
    }
  }

  .el-menu--popup {
    min-width: unset;
    padding: 8px 0;
  }

  .nest-menu {
    + .nest-menu {
      margin-top: 2px;
    }
  }

  & > .el-menu {
    .w-svg-icon {
      margin-right: 0;
      font-size: 0;
      opacity: 0;
    }
  }

  .el-menu-item,
  .el-sub-menu {
    &.is-active {
      color: var(--base-menu-color-active);
      background-color: var(--el-menu-active-color) !important;

      .el-sub-menu__title {
        color: var(--base-menu-color-active);

        &:hover {
          background-color: var(--el-menu-active-color);
        }
      }
    }
  }
}
</style>
