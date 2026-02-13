import Cookies from 'js-cookie';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { LOCAL_STORAGE_KEYS } from '@way-ui/constants';

export const useAppStore = defineStore('core-app', {
  state: () => ({
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      withoutAnimation: false,
      hide: false,
    },
    device: 'desktop',
    size: useLocalStorage(LOCAL_STORAGE_KEYS.LAYOUT_SETTING, { size: 'default' }).value.size,
  }),
  actions: {
    toggleSideBar(withoutAnimation) {
      if (this.sidebar.hide) {
        return false;
      }
      this.sidebar.opened = !this.sidebar.opened;
      this.sidebar.withoutAnimation = withoutAnimation;
      if (this.sidebar.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
    },
    closeSideBar({ withoutAnimation }) {
      Cookies.set('sidebarStatus', 0);
      this.sidebar.opened = false;
      this.sidebar.withoutAnimation = withoutAnimation;
    },
    toggleDevice(device) {
      this.device = device;
    },
    setSize(size) {
      this.size = size;
    },
    toggleSideBarHide(status) {
      this.sidebar.hide = status;
    },
  },
});
