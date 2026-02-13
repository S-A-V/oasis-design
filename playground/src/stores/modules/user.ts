/* eslint-disable */
// @ts-nocheck

import { defineStore } from 'pinia'
import { setEncrypted, removeEncrypted } from '@way-ui/utils/way'
import { SESSION_KEYS } from '@way-ui/constants'
import { $file, $token, $cache } from 'way-ui'
import { getEncryptMap, getInfo } from '@/api'
import defAva from '@/assets/images/default-avatar.png'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: $token.get(),
    id: '',
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
  }),
  actions: {
    async fetchEncryptConfig() {
      try {
        const { data } = await getEncryptMap()
        setEncrypted(data)
      } catch (e) {
        console.log(e)
      }
    },
    setToken(token: string) {
      this.token = token
      $token.set(token)
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(async ({ data }) => {
            const res = data
            const user = res.user
            const avatar =
              user.avatar == '' || user.avatar == null
                ? defAva
                : await $file.fetchWithToken(import.meta.env.VITE_APP_BASE_URL + user.avatar)
            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              this.roles = res.roles
              this.permissions = res.permissions
            } else {
              this.roles = ['ROLE_DEFAULT']
            }
            this.id = user.userId
            this.name = user.userName
            this.avatar = avatar
            resolve(res)
          })
          .catch((error) => {
            console.log(error)
            reject(error)
          })
      })
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        this.token = ''
        this.roles = []
        this.permissions = []
        $token.remove()
        $cache.session.remove(SESSION_KEYS.DEPT_ID)
        $cache.session.remove(SESSION_KEYS.UNIT_CODE)
        resolve()
      })
    },
  },
})
