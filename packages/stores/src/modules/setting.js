import { defineStore } from 'pinia';
import { SESSION_KEYS, LOCAL_STORAGE_KEYS } from '@way-ui/constants';
import { useGlobalConfig } from '@way-ui/hooks';

export const defaultSettings = {
  /**
   * 网页标题
   */
  // title: import.meta.env.VITE_APP_TITLE,
  /**
   * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
   */
  sideTheme: 'theme-dark',
  /**
   * 是否系统布局配置
   */
  showSettings: true,

  /**
   * 是否显示顶部导航
   */
  topNav: false,

  /**
   * 是否显示常用菜单
   */
  commonMenus: false,

  /**
   * 是否显示 tagsView
   */
  tagsView: true,

  /**
   * 字号大小
   */
  size: 'default',

  /**
   * 是否固定头部
   */
  fixedHeader: true,

  /**
   * 是否显示logo
   */
  sidebarLogo: true,

  /**
   * 是否显示动态标题
   */
  dynamicTitle: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',
};

const {
  sideTheme,
  showSettings,
  topNav,
  commonMenus,
  tagsView,
  size,
  fixedHeader,
  sidebarLogo,
  dynamicTitle,
} = defaultSettings;

const storageSetting = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.LAYOUT_SETTING)) || {};

export const useSettingStore = defineStore('core-setting', {
  state: () => ({
    title: '',
    // theme: storageSetting.theme || '#3660FF',
    sideTheme: storageSetting.sideTheme || sideTheme,
    showSettings: showSettings,
    topNav: storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
    commonMenus:
      storageSetting.commonMenus === undefined ? commonMenus : storageSetting.commonMenus,
    tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
    size: storageSetting.size || size,
    fixedHeader:
      fixedHeader || storageSetting.fixedHeader === undefined
        ? fixedHeader
        : storageSetting.fixedHeader,
    sidebarLogo:
      storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
    dynamicTitle:
      storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle,
  }),
  actions: {
    // 修改布局设置
    changeSetting(data) {
      const { key, value } = data;
      // eslint-disable-next-line no-prototype-builtins
      if (this.hasOwnProperty(key)) {
        this[key] = value;
      }
    },
    setDynamicTitle() {
      const { VITE_APP_TITLE } = useGlobalConfig('env').value;
      const titleTemplate = sessionStorage.getItem(SESSION_KEYS.APP_TITLE) || VITE_APP_TITLE;
      document.title = this.dynamicTitle ? this.title + ' - ' + titleTemplate : titleTemplate;
    },
    // 设置网页标题
    setTitle(title) {
      this.title = title;
      this.setDynamicTitle();
    },
  },
});
