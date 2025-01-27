import useUserStore from '@/store/modules/user';

const ADMIN_PERMISSION = '*:*:*';
const ADMIN_ROLE = 'admin';

function authPermission(permission) {
  const permissions = useUserStore().permissions || [];
  if (!permissions.length) return false;
  return permissions.some((v) => {
    return v === ADMIN_PERMISSION || v === permission;
  });
}

function authRole(role) {
  const roles = useUserStore().roles || [];
  if (!roles.length) return false;
  return roles.some((v) => {
    return v === ADMIN_ROLE || v === role;
  });
}

export const permission = {
  // 验证用户是否具备某权限
  // hasPermi
  has(permission) {
    return authPermission(permission);
  },
  // 验证用户是否含有指定权限，只需包含其中一个
  // hasPermiOr
  hasAny(permissions) {
    return permissions.some((item) => {
      return authPermission(item);
    });
  },
  // 验证用户是否含有指定权限，必须全部拥有
  // hasPermiAnd
  hasAll(permissions) {
    return permissions.every((item) => {
      return authPermission(item);
    });
  },
};

export const rolePermission = {
  // 验证用户是否具备某角色
  // hasRole
  has(role) {
    return authRole(role);
  },
  // 验证用户是否含有指定角色，只需包含其中一个
  // hasRoleOr
  hasAny(roles) {
    return roles.some((item) => {
      return authRole(item);
    });
  },
  // 验证用户是否含有指定角色，必须全部拥有
  // hasRoleAnd
  hasAll(roles) {
    return roles.every((item) => {
      return authRole(item);
    });
  },
};
