<template>
  <div class="w-jm-sidebar-wrapper">
    <el-scrollbar class="w-jm-sidebar-container">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        unique-opened
        :popper-class="`w-jm-sidebar-menu-popup-container ${sideTheme}`"
      >
        <side-bar-item
          v-for="(item, index) in sidebarRouters"
          :key="item.path + index"
          :item="item"
          :base-path="item.path"
        />
      </el-menu>
    </el-scrollbar>
    <div class="sidebar-footer">
      <w-hamburger
        :is-active="appStore.sidebar.opened"
        class="hamburger-container"
        @toggle-click="toggleSideBar"
      />
    </div>
  </div>
</template>

<script setup name="Sidebar">
import { computed, getCurrentInstance, toRef } from 'vue';
import { ElMenu, ElScrollbar } from 'element-plus';
import { useAppStore, useSettingStore as useSettingsStore } from '@way-ui/stores';
import { useGlobalConfig } from '@way-ui/hooks';
import { WHamburger } from '../../../../hamburger';
import SideBarItem from './side-bar-item.vue';

defineOptions({ name: 'SideBar' });

const instance = getCurrentInstance();
const { $router } = instance.appContext.config.globalProperties;
const router = toRef($router);
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = computed(() => useGlobalConfig('stores').value.permission);

const sidebarRouters = computed(() => permissionStore.value.sidebarRouters);
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

function toggleSideBar() {
  appStore.toggleSideBar();
}
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

  .hideSidebar .w-jm-sidebar-wrapper {
    --el-menu-item-height: 48px;

    width: 60px !important;

    .w-svg-icon {
      margin-right: 0;
      margin-left: 0;
      font-size: 24px;
    }

    .el-menu {
      padding-top: 6px;
      background-color: #e6e6ee;
    }

    .el-menu-item {
      &.is-active {
        color: $base-menu-color-active;

        &::before {
          background: linear-gradient(180deg, #3271fe 50%, #5db4ff);
        }

        .el-sub-menu__title {
          color: $base-menu-color-active;
        }

        .w-svg-icon {
          color: $base-menu-color-active;
        }
      }

      &:hover {
        background-color: transparent;

        &::before {
          background-color: #eef5ff;
        }
      }

      &::before {
        right: 12px;
        left: 12px;
        height: 36px;
      }

      .el-menu-tooltip__trigger {
        padding: 0 18px;
      }
    }

    .submenu-title-noDropdown {
      position: relative;
      padding: 0 !important;

      // .el-tooltip {
      //   padding: 0 !important;

      //   .w-svg-icon {
      //     margin-left: 20px;
      //   }
      // }
    }

    .el-sub-menu {
      position: relative;
      z-index: 1;
      overflow: hidden;

      &:hover {
        &::before {
          background-color: #eef5ff;
        }
      }

      &::before {
        position: absolute;
        top: calc(var(--el-menu-item-height) / 2 - 18px);
        right: 12px;
        left: 12px;
        z-index: -1;
        display: inline-block;
        height: 36px;
        content: '';
        background-color: transparent;
        border-radius: 8px;
      }

      &.is-active {
        color: $base-menu-color-active;

        &::before {
          background: linear-gradient(180deg, #3271fe 50%, #5db4ff);
        }

        .el-sub-menu__title {
          color: $base-menu-color-active;
        }

        .w-svg-icon {
          color: $base-menu-color-active;
        }
      }

      & > .el-sub-menu__title {
        padding: 0 !important;

        &:hover {
          background-color: transparent;
        }

        .w-svg-icon {
          margin-left: 18px;
        }
      }
    }

    .el-menu--collapse {
      width: 60px;

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
}

.w-jm-sidebar-wrapper {
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width) !important;
  height: 100%;
  padding-right: 1px;
  overflow: hidden;
  background: #e6e6ee;
  box-shadow: -1px 0 0 0 #dcdfe5 inset;
  transition: width 0.28s;

  .sidebar-footer {
    padding: 14px 14px 14px 0;
    text-align: right;

    .hamburger-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      line-height: 32px;
      cursor: pointer;
      background: #eef5ff;
      border-radius: 6px;
      transition: background 0.3s;

      &:hover {
        background: rgb(0 0 0 / 5%);
      }
    }
  }
}

.w-jm-sidebar-container {
  z-index: 2001;
  font-size: 0;

  .horizontal-collapse-transition {
    transition:
      0s width ease-in-out,
      0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }

  .el-scrollbar {
    height: 100%;
  }

  > .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }

  .el-scrollbar__bar.is-vertical {
    right: 0;
  }

  .is-horizontal {
    display: none;
  }

  .el-menu {
    --el-menu-base-level-padding: 16px;

    border: 0;
  }

  .el-menu-item,
  .menu-title {
    overflow: hidden !important;
    color: var(--el-text-color-regular);
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  .el-menu-item {
    z-index: 1;

    &::before {
      position: absolute;
      right: 16px;
      left: 16px;
      z-index: -1;
      display: inline-block;
      height: 36px;
      content: '';
      background-color: transparent;
      border-radius: 8px;
    }

    // &.is-active {
    //   color: var(--base-menu-color-active);

    //   &::before {
    //     background-color: var(--el-menu-active-color);
    //   }
    // }
  }

  .el-menu--vertical {
    &:not(.el-menu--collapse) {
      .el-menu-item {
        &.is-active {
          background-color: var(--way-color-primary-8);
        }
      }

      .el-sub-menu {
        &.is-active {
          > .el-sub-menu__title {
            background: linear-gradient(270deg, #eef8ff, #d1e6ff);

            &::before {
              position: absolute;
              top: 0;
              left: 0;
              width: 4px;
              height: 100%;
              content: '';
              background-color: var(--el-color-primary);
            }

            .w-svg-icon,
            .menu-title {
              color: var(--el-color-primary);
            }
          }
        }

        > .el-menu {
          --el-menu-sub-item-height: 38px;

          padding: 4px 0;
          box-shadow: 0 -1px 0 0 var(--el-border-color-light) inset;

          .nest-menu {
            + .nest-menu {
              margin-top: 4px;
            }
          }
        }
      }

      .nest-menu .el-sub-menu > .el-sub-menu__title,
      .el-menu-item {
        &:hover {
          // background-color: rgb(0 0 0 / 6%) !important;
          background-color: var(--way-color-primary-8) !important;
        }
      }

      .submenu-title-noDropdown,
      .el-sub-menu__title {
        background-color: #f7f8fa;
        box-shadow: 0 -1px 0 0 var(--el-border-color-light) inset;

        &:hover {
          // background-color: rgb(0 0 0 / 6%) !important;
          background-color: var(--way-color-primary-8) !important;
        }
      }
    }

    & > .el-menu {
      .w-svg-icon {
        margin-right: 16px;
      }
    }

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

  .submenu-title-noDropdown,
  .el-sub-menu__title {
    .w-svg-icon,
    .menu-title {
      font-weight: bold;
    }
  }

  .w-svg-icon {
    margin-right: 8px;

    // margin-left: 6px;
    font-size: 18px;
    color: #8e959f;
  }

  & .nest-menu .el-sub-menu > .el-sub-menu__title,
  & .el-sub-menu .el-menu-item {
    // min-width: $base-sidebar-width !important;

    &:hover {
      // background-color: rgb(0 0 0 / 6%) !important;
      background-color: var(--way-color-primary-8) !important;
    }

    .w-svg-icon {
      margin-right: 6px;
      font-size: 0;
      opacity: 0;
    }
  }
}

.w-jm-sidebar-menu-popup-container {
  --el-menu-item-height: 28px;
  --el-menu-base-level-padding: 12px;

  .el-menu {
    --el-menu-text-color: var(--base-menu-color);
    --el-menu-hover-text-color: var(--base-menu-color);
    --el-menu-bg-color: var(--base-menu-background);
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

  .el-menu-item {
    &:not(.is-active) {
      &:hover {
        background-color: rgb(255 255 255 / 25%) !important;
      }
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
