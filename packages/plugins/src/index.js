import { withInstallFunction } from '@way-ui/internal-utils';

import {
  addDateRange,
  handleTree,
  parseTime,
  resetForm,
  selectDictLabel,
  selectDictLabels,
} from '@way-ui/utils/way';

// import auth from './auth';
import cache from './cache';
import download from './download';
import file from './file';
import modal from './modal';
import { permission, rolePermission } from './permission';
import tab from './tab';
import token from './token';
import validator from './validator';

// 认证对象
// export const $auth = withInstallFunction(auth, '$auth');
// 缓存对象
export const $cache = withInstallFunction(cache, '$cache');
// 下载文件
export const $download = withInstallFunction(download, '$download');
// 文件
export const $file = withInstallFunction(file, '$file');
// 模态框对象
export const $modal = withInstallFunction(modal, '$modal');
// 权限校验
export const $permission = withInstallFunction(permission, '$permission');
export const $rolePermission = withInstallFunction(rolePermission, '$rolePermission');
// 页签操作
export const $tab = withInstallFunction(tab, '$tab');
// token 操作
export const $token = withInstallFunction(token, '$token');
// 格式校验
export const $validator = withInstallFunction(validator, '$validator');

export const utils = {
  install(app) {
    app.config.globalProperties.addDateRange = addDateRange;
    app.config.globalProperties.handleTree = handleTree;
    app.config.globalProperties.parseTime = parseTime;
    app.config.globalProperties.resetForm = resetForm;
    app.config.globalProperties.selectDictLabel = selectDictLabel;
    app.config.globalProperties.selectDictLabels = selectDictLabels;
  },
};
