import { useGlobalConfig } from '@way-ui/hooks';
import { $token } from '@way-ui/plugins';
import request from '../utils/request';

// 查询字典类型列表
export function listType(query) {
  const { VITE_APP_BASE_URL, VITE_APP_BASE_API } = useGlobalConfig('env').value;
  return request({
    url: VITE_APP_BASE_URL + VITE_APP_BASE_API + '/system/ipConfig/list',
    headers: {
      Authorization: 'Bearer ' + $token.get(),
    },
    method: 'post',
    data: query,
  });
}
