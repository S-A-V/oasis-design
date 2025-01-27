<template>
  <el-drawer v-model="showSettings" title="主题配置" direction="rtl" :size="308">
    <div class="drawer-container">
      <!--
    <div class="setting-drawer-title">
      <h3 class="drawer-title">主题风格设置</h3>
    </div>
    <div class="setting-drawer-block-checbox">
      <div class="setting-drawer-block-checbox-item" @click="handleTheme('theme-dark')">
        <img src="@/assets/images/dark.svg" alt="dark" />
        <div
          v-if="sideTheme === 'theme-dark'"
          class="setting-drawer-block-checbox-selectIcon"
          style="display: block"
        >
          <i aria-label="图标: check" class="anticon anticon-check">
            <svg
              viewBox="64 64 896 896"
              data-icon="check"
              width="1em"
              height="1em"
              :fill="theme"
              aria-hidden="true"
              focusable="false"
              class
            >
              <path
                d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"
              />
            </svg>
          </i>
        </div>
      </div>
      <div class="setting-drawer-block-checbox-item" @click="handleTheme('theme-light')">
        <img src="@/assets/images/light.svg" alt="light" />
        <div
          v-if="sideTheme === 'theme-light'"
          class="setting-drawer-block-checbox-selectIcon"
          style="display: block"
        >
          <i aria-label="图标: check" class="anticon anticon-check">
            <svg
              viewBox="64 64 896 896"
              data-icon="check"
              width="1em"
              height="1em"
              :fill="theme"
              aria-hidden="true"
              focusable="false"
              class
            >
              <path
                d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"
              />
            </svg>
          </i>
        </div>
      </div>
    </div>
    <div class="drawer-item">
      <span>主题颜色</span>
      <span class="comp-style">
        <el-color-picker v-model="theme" :predefine="predefineColors" @change="themeChange" />
      </span>
    </div>
    <el-divider />
    -->

      <div class="drawer-title">界面显示</div>

      <!--
    <div class="drawer-item">
      <span>开启 TopNav</span>
      <span class="comp-style">
        <el-switch
          v-model="settingsStore.topNav"
          @change="topNavChange"
          class="drawer-switch"
        />
      </span>
    </div>
    -->

      <div class="drawer-item">
        <span>开启常用菜单</span>
        <span class="comp-style">
          <el-switch v-model="settingsStore.commonMenus" class="drawer-switch" />
        </span>
      </div>

      <div class="drawer-item">
        <span>开启 Tags-Views</span>
        <span class="comp-style">
          <el-switch v-model="settingsStore.tagsView" class="drawer-switch" />
        </span>
      </div>

      <!--
    <div class="drawer-item">
      <span>固定 Header</span>
      <span class="comp-style">
        <el-switch v-model="settingsStore.fixedHeader" class="drawer-switch" />
      </span>
    </div>
    -->

      <div class="drawer-item">
        <span>显示 Logo</span>
        <span class="comp-style">
          <el-switch v-model="settingsStore.sidebarLogo" class="drawer-switch" />
        </span>
      </div>

      <div class="drawer-item">
        <span>动态标题</span>
        <span class="comp-style">
          <el-switch v-model="settingsStore.dynamicTitle" class="drawer-switch" />
        </span>
      </div>

      <el-divider />

      <el-button type="primary" :icon="DocumentAdd" @click="saveSetting">保存配置</el-button>
      <el-button plain :icon="Refresh" @click="resetSetting">重置配置</el-button>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from 'vue';
import { ElButton, ElSwitch, ElDivider, ElDrawer } from 'element-plus';
import { Refresh, DocumentAdd } from '@element-plus/icons-vue';
import useAppStore from '@/store/modules/app';
import useSettingsStore from '@/store/modules/settings';
import usePermissionStore from '@/store/modules/permission';
import { handleThemeStyle } from '@way-ui/utils/theme';

const { proxy } = getCurrentInstance();
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const showSettings = ref(false);
const theme = ref(settingsStore.theme);
const sideTheme = ref(settingsStore.sideTheme);
const storeSettings = computed(() => settingsStore);
const predefineColors = ref([
  '#409EFF',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
]);

/** 是否需要topnav */
function topNavChange(val) {
  if (!val) {
    appStore.toggleSideBarHide(false);
    permissionStore.setSidebarRouters(permissionStore.defaultRoutes);
  }
}

function themeChange(val) {
  settingsStore.theme = val;
  handleThemeStyle(val);
}

function handleTheme(val) {
  settingsStore.sideTheme = val;
  sideTheme.value = val;
}

function saveSetting() {
  proxy.$modal.loading('正在保存到本地，请稍候...');
  let layoutSetting = {
    topNav: storeSettings.value.topNav,
    commonMenus: storeSettings.value.commonMenus,
    tagsView: storeSettings.value.tagsView,
    fixedHeader: storeSettings.value.fixedHeader,
    sidebarLogo: storeSettings.value.sidebarLogo,
    dynamicTitle: storeSettings.value.dynamicTitle,
    sideTheme: storeSettings.value.sideTheme,
    theme: storeSettings.value.theme,
  };
  localStorage.setItem('layout-setting', JSON.stringify(layoutSetting));
  setTimeout(proxy.$modal.closeLoading(), 1000);
}

function resetSetting() {
  proxy.$modal.loading('正在清除设置缓存并刷新，请稍候...');
  localStorage.removeItem('layout-setting');
  setTimeout('window.location.reload()', 1000);
}

function openSetting() {
  showSettings.value = true;
}

defineExpose({
  openSetting,
});
</script>

<style lang="scss" scoped>
.setting-drawer-title {
  margin-bottom: 12px;
  font-weight: bold;
  line-height: 22px;
  color: rgb(0 0 0 / 85%);
}

.drawer-container {
  padding: 24px;
}

.drawer-title {
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: bold;
}

.setting-drawer-block-checbox {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
  margin-bottom: 20px;

  .setting-drawer-block-checbox-item {
    position: relative;
    margin-right: 16px;
    cursor: pointer;
    border-radius: 2px;

    img {
      width: 48px;
      height: 48px;
    }

    .custom-img {
      width: 48px;
      height: 38px;
      border-radius: 5px;
      box-shadow: 1px 1px 2px #898484;
    }

    /* stylelint-disable-next-line selector-class-pattern */
    .setting-drawer-block-checbox-selectIcon {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      padding-top: 15px;
      padding-left: 24px;
      font-size: 14px;
      font-weight: 700;
      color: #1890ff;
    }
  }
}

.drawer-item {
  margin-bottom: 24px;
  font-size: 14px;
  color: rgb(0 0 0 / 65%);

  .comp-style {
    float: right;
    margin-top: -6px;
  }
}
</style>
