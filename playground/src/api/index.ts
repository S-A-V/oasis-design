import { $cache } from 'way-ui'
import { SESSION_KEYS } from '@way-ui/constants'
import request from '@/utils/request'

// 根据参数键名查询参数值
export function getEncryptMap() {
  return request({
    url: '/system/config/configKey/sys.request.encrypt',
    method: 'get',
  })
}

// 刷新 token
export function refreshToken() {
  return request({
    url: '/auth/refresh',
    method: 'post',
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/system/user/getInfo',
    method: 'post',
    data: {
      deptId: $cache.session.get(SESSION_KEYS.DEPT_ID),
      unitCode: $cache.session.get(SESSION_KEYS.UNIT_CODE),
    },
  })
}

// 获取路由
export function getRouters(data: object) {
  return request({
    url: '/system/menu/getRouters',
    method: 'post',
    data,
  })
}

// 根据字典类型，查询字典数据信息
export function getDicts(dictType: string) {
  return request({
    url: '/system/dict/data/getByDictType',
    method: 'post',
    data: { dictType },
  })
}
