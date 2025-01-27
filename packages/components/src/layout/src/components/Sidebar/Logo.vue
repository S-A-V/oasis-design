<template>
  <div
    class="sidebar-logo-container"
    :class="{ collapse: collapse }"
    :style="{
      backgroundColor:
        sideTheme === 'theme-dark'
          ? 'var(--base-menu-background)'
          : 'var(--base-menu-light-background)',
    }"
  >
    <transition name="sidebarLogoFade">
      <!-- <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/"> -->
      <div v-if="collapse" key="collapse" class="sidebar-logo-link">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1
          v-else
          class="sidebar-title"
          :style="{
            color:
              sideTheme === 'theme-dark'
                ? 'var(--base-logo-title-color)'
                : 'var(--base-logo-light-title-color)',
          }"
        >
          {{ title }}
        </h1>
      </div>
      <!-- <router-link v-else key="expand" class="sidebar-logo-link" to="/"> -->
      <div v-else key="expand" class="sidebar-logo-link">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1
          class="sidebar-title"
          :style="{
            color:
              sideTheme === 'theme-dark'
                ? 'var(--base-logo-title-color)'
                : 'var(--base-logo-light-title-color)',
          }"
        >
          {{ title }}
        </h1>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { SESSION_KEYS } from '@way-ui/constants';
import { useGlobalConfig } from '@way-ui/components/src/config-provider';
import logo from '@/assets/logo/logo.png';
import useSettingsStore from '@/store/modules/settings';

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});

const { VITE_APP_TITLE } = useGlobalConfig('env').value;
const title = sessionStorage.getItem(SESSION_KEYS.APP_TITLE) || VITE_APP_TITLE;
const settingsStore = useSettingsStore();
const sideTheme = computed(() => settingsStore.sideTheme);
</script>

<style lang="scss" scoped>
/* stylelint-disable-next-line selector-class-pattern */
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

/* stylelint-disable-next-line selector-class-pattern */
.sidebarLogoFade-enter {
  opacity: 0;
}

/* stylelint-disable-next-line selector-class-pattern */
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 64px;
  overflow: hidden;
  line-height: 64px;
  text-align: center;
  background: #2b2f3a;

  & .sidebar-logo-link {
    width: 100%;
    height: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      vertical-align: middle;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      line-height: 64px;
      color: #fff;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0;
    }
  }
}
</style>
