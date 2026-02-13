/**
 * 路由权限指令（操作权限处理）
 * v-permission
 *
 */

import { useGlobalConfig } from '@way-ui/hooks';

export default {
  mounted(el, binding, vnode) {
    const { value } = binding;
    const all_permission = '*:*:*';
    const permissions = useGlobalConfig('stores').value.user.permissions;

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value;

      const hasPermissions = permissions.some((permission) => {
        return all_permission === permission || permissionFlag.includes(permission);
      });

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`请设置操作权限标签值`);
    }
  },
};
