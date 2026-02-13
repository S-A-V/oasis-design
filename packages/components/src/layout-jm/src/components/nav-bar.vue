<template>
  <div class="navbar">
    <app-logo v-if="showLogo" :collapse="isCollapse" />
    <!--
    <common-menus v-if="settingsStore.commonMenus" />
    <tag-bar v-if="needTagsView" />
    -->
    <common-menus />
    <tag-bar />

    <div class="right-menu">
      <div class="avatar-container">
        <div class="avatar-wrapper">
          <img v-if="userStore.avatar" :src="userStore.avatar" class="user-avatar" />
          <img v-else src="../images/default-avatar.png" class="user-avatar" />
          <span>{{ userStore.name }}</span>
        </div>
      </div>
      <w-full-screen v-if="false" class="full-screen-btn" />
      <el-icon class="icon-wrapper" @click="setLayout">
        <icon-setup />
      </el-icon>
      <el-icon
        v-for="(item, idx) in options"
        :key="idx"
        class="icon-wrapper"
        @click="item.action ? item.action() : null"
      >
        <w-svg-icon :name="item.icon" />
      </el-icon>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ElIcon, ElTooltip, ElMessageBox } from 'element-plus';
import { useAppStore, useSettingStore as useSettingsStore } from '@way-ui/stores';
import { useGlobalConfig } from '@way-ui/hooks';
import { WSvgIcon } from '../../../svg-icon';
import { WFullScreen } from '../../../full-screen';
import CommonMenus from './common-menus/index.vue';
import AppLogo from './app-logo.vue';
import TagBar from './tag-bar/index.vue';
import IconSetup from '../images/icon_setup.vue';

defineProps({
  options: { type: Array, default: () => [] },
});
const emit = defineEmits(['setLayout']);
const emits = emit;
const appStore = useAppStore();
const userStore = computed(() => useGlobalConfig('stores').value.user);
const settingsStore = useSettingsStore();
const showLogo = computed(() => settingsStore.sidebarLogo);
const isCollapse = computed(() => !appStore.sidebar.opened);
const needTagsView = computed(() => settingsStore.tagsView);

function handleCommand(command) {
  switch (command) {
    case 'setLayout':
      setLayout();
      break;
    case 'logout':
      logout();
      break;
    default:
      break;
  }
}

function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      userStore.value.logOut().then(() => {
        location.href = '/index';
      });
    })
    .catch(() => {});
}

function setLayout() {
  emits('setLayout');
}
</script>

<style lang="scss" scoped>
.navbar {
  position: relative;
  display: flex;
  align-items: center;
  height: 64px;
  margin: 0 -20px;
  overflow: hidden;
  color: #fff;
  background-image: url('../images/nav-bg.png');
  background-size: 100% 100%;

  .breadcrumb-container {
    float: left;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    height: 100%;
    padding-right: 16px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      padding: 0 8px;
      font-size: 18px;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgb(0 0 0 / 2.5%);
        }
      }
    }

    .full-screen-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      margin: 16px 0 0 24px;
      font-size: 16px;
      cursor: pointer;
      background-color: rgb(251 252 253 / 30%);
      border-radius: 50%;
    }

    .size-select-btn {
      /* stylelint-disable-next-line selector-class-pattern */
      :deep(.size-icon--style) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        padding: 0;
        margin: 16px 0 0 24px;
        cursor: pointer;
        border: 1px solid #d7dce3;
        border-radius: 50%;
      }
    }

    .icon-wrapper {
      width: 32px;
      height: 32px;
      font-size: 16px;
      cursor: pointer;
      background-color: rgb(255 255 255 / 25%);
      border-radius: 50%;
      transition: background-color 0.3s;

      &:hover {
        background-color: rgb(255 255 255 / 40%);
      }

      + .icon-wrapper {
        margin-left: 16px;
      }
    }

    .avatar-container {
      display: inline-flex;
      align-items: center;
      margin-right: 24px;

      .avatar-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        font-size: 16px;
        line-height: 20px;

        .user-avatar {
          width: 32px;
          height: 32px;
          margin-right: 8px;
          cursor: pointer;
          border-radius: 50%;
        }

        i {
          position: absolute;
          top: 25px;
          right: -20px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
