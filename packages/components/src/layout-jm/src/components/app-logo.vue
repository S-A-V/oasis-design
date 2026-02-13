<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <!-- <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/"> -->
      <div v-if="collapse" key="collapse" class="sidebar-logo-link">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 v-else class="sidebar-title">
          {{ title }}
        </h1>
      </div>
      <!-- <router-link v-else key="expand" class="sidebar-logo-link" to="/"> -->
      <div v-else key="expand" class="sidebar-logo-link">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 class="sidebar-title">
          {{ title }}
        </h1>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { SESSION_KEYS } from '@way-ui/constants';
import { useGlobalConfig } from '@way-ui/hooks';

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});

const { VITE_APP_TITLE } = useGlobalConfig('env').value;
const { logo } = useGlobalConfig('assets').value;
const title = sessionStorage.getItem(SESSION_KEYS.APP_TITLE) || VITE_APP_TITLE;
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
  display: flex;
  flex-shrink: 0;
  width: 204px;

  // height: 64px;
  overflow: hidden;

  // line-height: 64px;
  text-align: center;

  & .sidebar-logo-link {
    display: flex;
    align-items: center;
    padding-left: 14px;

    & .sidebar-logo {
      display: inline;
      flex-shrink: 0;
      width: 32px;
      height: 32px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      margin-left: 12px;
      font-size: 20px;
      font-weight: 600;
    }
  }

  &.collapse {
    width: 60px;
  }
}
</style>
