import type { RouteRecordRaw } from 'vue-router'
import router from './router'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { $cache, $token, $validator } from 'way-ui'
import { SESSION_KEYS } from '@way-ui/constants'
import { useSettingStore } from '@way-ui/stores'
import { useUserStore, usePermissionStore } from '@/stores'

NProgress.configure({ showSpinner: false })

const whiteList = ['/401']

function hasDept() {
  const deptId = $cache.session.get(SESSION_KEYS.DEPT_ID)
  const unitCode = $cache.session.get(SESSION_KEYS.UNIT_CODE)
  return deptId && unitCode
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  useUserStore()
    .fetchEncryptConfig()
    .then(() => {
      if ($token.get() && hasDept()) {
        if (to.meta.title) {
          useSettingStore().setTitle(to.meta.title)
        }

        /* has token*/
        if (whiteList.indexOf(to.path) !== -1) {
          next()
          NProgress.done()
        } else {
          if (useUserStore().roles.length === 0) {
            // 判断当前用户是否已拉取完user_info信息
            useUserStore()
              .getInfo()
              .then(() => {
                usePermissionStore()
                  .getRoutes()
                  .then((accessRoutes: RouteRecordRaw[]) => {
                    // 根据roles权限生成可访问的路由表
                    accessRoutes.forEach((route) => {
                      if (!$validator.isHttp(route.path)) {
                        router.addRoute(route) // 动态添加可访问路由表
                      }
                    })
                    next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
                  })
                  .catch(() => {
                    next({ path: '/401' })
                  })
              })
              .catch((err) => {
                console.log(err)

                useUserStore()
                  .logOut()
                  .then(() => {
                    ElMessage.error(err)
                    next({ path: '/401' })
                  })
                  .catch(() => {
                    next({ path: '/401' })
                  })
              })
          } else {
            next()
          }
        }
      } else {
        // 没有token
        if (whiteList.indexOf(to.path) !== -1) {
          // 在免登录白名单，直接进入
          next()
        } else {
          next('/401')
          NProgress.done()
        }
      }
    })
    .catch((err) => {
      console.log(err)
    })
})

router.afterEach(() => {
  NProgress.done()
})
