/* eslint-disable */
// @ts-nocheck

import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout'
import { getAppName } from '@/utils/app'

const appName = getAppName()

export const constantRoutes = [
  {
    path: '/401',
    component: () => import('@/views/error/401/index.vue'),
    hidden: true,
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404/index.vue'),
    hidden: true,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index.vue'),
        name: 'Index',
        meta: { title: '首页', icon: 'homepagel', affix: false },
      },
    ],
  },
  {
    path: '/components',
    component: Layout,
    meta: { title: '组件', icon: 'setting' },
    redirect: '/components/button',
    alwaysShow: true,
    children: [
      {
        path: 'button',
        component: () => import('@/views/components/button/index.vue'),
        name: 'Button',
        meta: { title: 'Button 按钮' },
      },
      {
        path: 'date-picker',
        component: () => import('@/views/components/date-picker/index.vue'),
        name: 'DatePicker',
        meta: { title: 'DatePicker 日期选择器' },
      },
      {
        path: 'transfer',
        component: () => import('@/views/components/transfer/index.vue'),
        name: 'Transfer',
        meta: { title: 'Transfer 穿梭框' },
      },
      {
        path: 'table',
        component: () => import('@/views/components/table/index.vue'),
        name: 'Table',
        meta: { title: 'Table 表格' },
      },
      {
        path: 'dialog',
        component: () => import('@/views/components/dialog/index.vue'),
        name: 'Dialog',
        meta: { title: 'Dialog 对话框' },
      },
      {
        path: 'message-box',
        component: () => import('@/views/components/message-box/index.vue'),
        name: 'MessageBox',
        meta: { title: 'MessageBox 消息弹出框' },
      }
    ],
  },
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = []

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
