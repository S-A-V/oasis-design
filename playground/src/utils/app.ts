import type { RouteRecordRaw } from 'vue-router'
import { SESSION_KEYS } from '@way-ui/constants'
import { $cache, $validator } from 'way-ui'
import { POST_ROUTE_CONFIGS } from '@/constants/postMessage'
import { SUBSYSTEM_LOADED, OBTAIN_ROUTES_MODE } from '@/constants/subsystem'
import { usePermissionStore } from '@/stores'
import router from '@/router'

function getAppNameFromWindow() {
  const windowName = JSON.parse(window.name || '{}')
  return windowName.appName
}

// 获取子系统名称
export function getAppName() {
  return sessionStorage.getItem(SESSION_KEYS.APP_NAME) || getAppNameFromWindow()

  /**
   *
  const regex = /^\/([^/?]+)\//;
  const match = location.pathname.match(regex) || [];
  return sessionStorage.getItem(SESSION_KEYS.APP_NAME) || match[1];
   */
}

// 子系统加载完成后发送消息到父窗口
export function postSubsystemLoadedMessage() {
  const opener = window.opener
  if (!opener) return
  // 发送给打开该标签页的窗口
  opener.postMessage(
    {
      action: SUBSYSTEM_LOADED,
      data: JSON.stringify({
        appName: getAppName(),
      }),
    },
    '*',
  )
}

// 子系统接收父窗口发送的路由数据
export function receiveRoutesConfigMessage(event: MessageEvent) {
  if (import.meta.env.VITE_SUBSYSTEM_ROUTES_OBTAIN_METHOD === OBTAIN_ROUTES_MODE.REQUEST) {
    return
  }

  if (event.data?.action === POST_ROUTE_CONFIGS) {
    const { data } = event.data
    const dataObj = JSON.parse(data) || {}
    $cache.session.set(SESSION_KEYS.APP_NAME, dataObj.path)
    $cache.session.set(SESSION_KEYS.APP_TITLE, dataObj.meta?.title)
    $cache.session.set(SESSION_KEYS.ROUTE_CONFIGS, data)
    const accessRoutes: RouteRecordRaw[] = usePermissionStore().generateRoutes(JSON.parse(data))
    accessRoutes.forEach((route) => {
      if (!$validator.isHttp(route.path)) {
        router.addRoute(route)
      }
    })
  }
}
