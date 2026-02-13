<script setup lang="ts">
import type { ComponentSize } from 'element-plus'
import locale from 'element-plus/es/locale/lang/zh-cn'
import { useLocalStorage } from '@vueuse/core'
import { $cache, $modal } from 'way-ui'
import { SESSION_KEYS, LOCAL_STORAGE_KEYS } from '@way-ui/constants'
import { postSubsystemLoadedMessage, receiveRoutesConfigMessage } from '@/utils/app'
import { useUserStore, usePermissionStore } from '@/stores'
import logo from '@/assets/images/logo.svg'

const userStore = useUserStore()
const permissionStore = usePermissionStore()

const globalConfig = computed(() => ({
  el: {
    locale,
    size: useLocalStorage<{ size?: ComponentSize }>(LOCAL_STORAGE_KEYS.LAYOUT_SETTING, {
      size: 'default',
    }).value.size,
  },
  w: {
    env: {
      VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
      VITE_APP_BASE_URL: import.meta.env.VITE_APP_BASE_URL,
      VITE_APP_BASE_API: import.meta.env.VITE_APP_BASE_API,
    },
    stores: {
      /**
       *
      user: userStore,
      permission: permissionStore,
       */
      user: {
        // token: userStore.token,
        // id: userStore.id,
        name: userStore.name,
        avatar: userStore.avatar, // 非必须
        roles: userStore.roles, // $rolePermission
        permissions: userStore.permissions, // $permission
      },
      permission: {
        // rawRoutes: permissionStore.rawRoutes,
        routes: permissionStore.routes,
        // defaultRoutes: permissionStore.defaultRoutes,
        // topbarRouters: permissionStore.topbarRouters,
        sidebarRouters: permissionStore.sidebarRouters,
      },
    },
    commonMenus: [
      {
        path: '/index',
        meta: { title: '首页', icon: 'homepagel' },
      },
      {
        path: '/components/button',
        meta: { title: '按钮' }
      }
    ],
    assets: {
      logo,
    },
  },
}))

const windowName = JSON.parse(window.name || '{}')
const appName = windowName.appName
console.log(windowName)

if (appName) {
  const { DEPT_ID, UNIT_CODE } = SESSION_KEYS
  $cache.session.set(DEPT_ID, windowName.extra[DEPT_ID])
  $cache.session.set(UNIT_CODE, windowName.extra[UNIT_CODE])
}

onBeforeMount(() => {
  if (['/portal', '/auth'].every((p) => p !== location.pathname)) {
    if (!window.opener) {
      // return
      const errorMessage = '请从门户页进入'
      $modal.msgError(errorMessage)
      throw new Error(errorMessage)
    }

    if (appName) {
      const { token } = windowName
      if (token) {
        userStore.setToken(token)
      }
    }
  }
})

onMounted(() => {
  if (appName) {
    window.addEventListener('message', receiveRoutesConfigMessage)
    postSubsystemLoadedMessage()
  }
})

onUnmounted(() => {
  if (appName) {
    window.removeEventListener('message', receiveRoutesConfigMessage)
  }
})
</script>

<template>
  <el-config-provider :locale="globalConfig.el.locale" :size="globalConfig.el.size">
    <w-config-provider :env="globalConfig.w.env" :stores="globalConfig.w.stores"
      :common-menus="globalConfig.w.commonMenus" :assets="globalConfig.w.assets">
      <router-view />
    </w-config-provider>
  </el-config-provider>
</template>
