<template>
  <div class="navbar">
    <w-hamburger
      id="hamburger-container"
      :is-active="appStore.sidebar.opened"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    />
    <top-nav v-if="settingsStore.commonMenus" class="top-nav-container" />
    <w-breadcrumb
      v-show="false"
      v-if="!settingsStore.topNav"
      id="breadcrumb-container"
      class="breadcrumb-container"
    />
    <w-top-nav v-if="settingsStore.topNav" id="topmenu-container" class="topmenu-container" />

    <div class="right-menu">
      <template v-if="appStore.device !== 'mobile'">
        <!--
        <w-header-search id="header-search" class="right-menu-item" />

        <w-full-screen id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <w-size-select
            id="size-select"
            class="right-menu-item hover-effect"
          />
        </el-tooltip>
        -->

        <w-full-screen class="full-screen-btn" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <w-size-select class="size-select-btn" />
        </el-tooltip>

        <el-icon class="icon-wrapper" @click="setLayout">
          <Setting />
        </el-icon>
      </template>
      <div class="avatar-container">
        <!--
        <el-dropdown
          @command="handleCommand"
          class="right-menu-item hover-effect"
          trigger="click"
        >
          <div class="avatar-wrapper">
            <img :src="userStore.avatar" class="user-avatar" />
            <el-icon><caret-bottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item
                command="setLayout"
                v-if="settingsStore.showSettings"
              >
                <span>布局设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        -->
        <div class="avatar-wrapper">
          <img :src="userStore.avatar" class="user-avatar" />
          <span>{{ userStore.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Setting } from '@element-plus/icons-vue';
import { ElIcon, ElTooltip, ElMessageBox } from 'element-plus';
import useAppStore from '@/store/modules/app';
import useUserStore from '@/store/modules/user';
import useSettingsStore from '@/store/modules/settings';
import { WBreadcrumb } from '../../../breadcrumb';
import { WFullScreen } from '../../../full-screen';
import { WHamburger } from '../../../hamburger';
import { WSizeSelect } from '../../../size-select';
import { WTopNav } from '../../../top-nav';
import TopNav from './TopNav';

const appStore = useAppStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();

function toggleSideBar() {
  appStore.toggleSideBar();
}

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
      userStore.logOut().then(() => {
        location.href = '/index';
      });
    })
    .catch(() => {});
}

const emits = defineEmits(['setLayout']);
function setLayout() {
  emits('setLayout');
}
</script>

<style lang="scss" scoped>
.navbar {
  position: relative;
  height: 64px;
  overflow: hidden;
  background: #fff;

  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  box-shadow:
    0 1px 3px 0 rgb(220 221 225 / 70%),
    0 -1px 0 0 #dcdfe6 inset;

  .hamburger-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    float: left;
    width: 32px;
    height: 32px;
    margin: 16px 0 0 16px;
    line-height: 32px;
    cursor: pointer;
    background: rgb(0 0 0 / 5%);
    border-radius: 6px;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgb(0 0 0 / 2.5%);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .top-nav-container,
  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      padding: 0 8px;
      font-size: 18px;
      color: #5a5e66;
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
      margin: 16px 0 0 16px;
      color: #231815;
      cursor: pointer;
      border: 1px solid #d7dce3;
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
        margin: 16px 0 0 16px;
        color: #231815;
        cursor: pointer;
        border: 1px solid #d7dce3;
        border-radius: 50%;
      }
    }

    .icon-wrapper {
      width: 32px;
      height: 32px;
      margin: 16px 0 0 16px;
      cursor: pointer;
      border: 1px solid #d7dce3;
      border-radius: 50%;
    }

    .avatar-container {
      display: inline-flex;
      align-items: center;
      margin: 0 16px;

      .avatar-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        font-size: 16px;
        line-height: 20px;
        color: var(--el-text-color-primary);

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
