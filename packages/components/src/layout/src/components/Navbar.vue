<template>
  <div class="navbar">
    <w-hamburger
      id="hamburger-container"
      :is-active="appStore.sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <top-nav v-if="settingsStore.commonMenus" class="top-nav-container" />
    <w-breadcrumb
      v-show="false"
      id="breadcrumb-container"
      class="breadcrumb-container"
      v-if="!settingsStore.topNav"
    />
    <w-top-nav
      id="topmenu-container"
      class="topmenu-container"
      v-if="settingsStore.topNav"
    />

    <div class="right-menu">
      <template v-if="appStore.device !== 'mobile'">
        <!--
        <w-header-search id="header-search" class="right-menu-item" />

        <w-screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <w-size-select
            id="size-select"
            class="right-menu-item hover-effect"
          />
        </el-tooltip>
        -->

        <w-screenfull class="full-screen-btn" />

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
import { ElMessageBox } from "element-plus";
import useAppStore from "@/store/modules/app";
import useUserStore from "@/store/modules/user";
import useSettingsStore from "@/store/modules/settings";
import TopNav from "./TopNav";

const appStore = useAppStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();

function toggleSideBar() {
  appStore.toggleSideBar();
}

function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}

function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      userStore.logOut().then(() => {
        location.href = "/index";
      });
    })
    .catch(() => {});
}

const emits = defineEmits(["setLayout"]);
function setLayout() {
  emits("setLayout");
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 64px;
  overflow: hidden;
  position: relative;
  background: #fff;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  box-shadow: 0px 1px 3px 0px rgba(220, 221, 225, 0.7),
    0px -1px 0px 0px #dcdfe6 inset;

  .hamburger-container {
    float: left;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 16px 0 0 16px;
    width: 32px;
    height: 32px;
    line-height: 32px;
    border-radius: 6px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.05);
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
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

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .full-screen-btn {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      margin: 16px 0 0 16px;
      width: 32px;
      height: 32px;
      border: 1px solid #d7dce3;
      border-radius: 50%;
      color: #231815;
      cursor: pointer;
    }

    .size-select-btn {
      :deep(.size-icon--style) {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin: 16px 0 0 16px;
        padding: 0;
        width: 32px;
        height: 32px;
        border: 1px solid #d7dce3;
        border-radius: 50%;
        color: #231815;
        cursor: pointer;
      }
    }

    .icon-wrapper {
      margin: 16px 0 0 16px;
      width: 32px;
      height: 32px;
      border: 1px solid #d7dce3;
      border-radius: 50%;
      cursor: pointer;
    }

    .avatar-container {
      display: inline-flex;
      align-items: center;
      margin: 0 24px;

      .avatar-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        font-size: 14px;
        color: #202020;
        line-height: 20px;

        .user-avatar {
          margin-right: 8px;
          cursor: pointer;
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
