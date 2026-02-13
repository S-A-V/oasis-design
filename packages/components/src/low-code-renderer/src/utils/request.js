import axios from 'axios';
import { ElNotification, ElMessage } from 'element-plus';
import { Encryption } from '@way-ui/utils/encryption';
import { DEFAULT_ERROR_MESSAGE, ERROR_CODE_MAP } from '@way-ui/constants';
import { tansParams, showError, getEncrypted } from '@way-ui/utils/way';

const VITE_BASE_ENCRYPTION_KEY = import.meta.env.VITE_BASE_ENCRYPTION_KEY;
const encryption = new Encryption(VITE_BASE_ENCRYPTION_KEY);

// const lruCache = new LRUCache(3);

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// 创建axios实例

const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL: VITE_APP_BASE_URL + VITE_APP_BASE_API,
  // 超时
  timeout: 30000,
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    config.data &&
      (config.data = Object.fromEntries(
        Object.entries(config.data).filter(([key, value]) => {
          if (Array.isArray(value)) {
            return !!value.length;
          }
          return !(value === null && value == undefined && value == '');
        }),
      ));

    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
    if (config.token) {
      config.headers['apiToken'] = config.token; // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      config.data = config.data
        ? Object.fromEntries(Object.entries(config.data).filter(([key, value]) => value !== ''))
        : { timestamp: +new Date() };
      const requestObj = {
        // url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime(),
      };
      const requestSize = Object.keys(JSON.stringify(requestObj)).length; // 请求数据大小
      const limitSize = 5 * 1024 * 1024; // 限制存放数据5M

      if (requestSize >= limitSize) {
        console.warn(
          `[${config.url}]: ` + '请求数据大小超出允许的5M限制，无法进行防重复提交验证。',
        );
        return config;
      }
    }

    // 缓存 Content-Type，在响应拦截器使用
    if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      config.headers['Way-Content-Type'] = 'application/x-www-form-urlencoded';
    }

    // 如果开启加密，加密 post 请求的参数
    // Content-Type 为 application/x-www-form-urlencoded 时，不加密
    if (
      config.method === 'post' &&
      config.headers['Content-Type'] !== 'application/x-www-form-urlencoded' &&
      getEncrypted() &&
      config.data
    ) {
      config.data = {
        data: encryption.smEncrypt(JSON.stringify(config.data)),
      };
    }

    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = ERROR_CODE_MAP[code] || res.data.msg || DEFAULT_ERROR_MESSAGE;

    // 如果开启加密，解密 post 请求返回值的 data 字段
    // Content-Type 为 application/x-www-form-urlencoded 时不加密，返回值无需解密
    if (
      res.config.method === 'post' &&
      res.config.headers['Way-Content-Type'] !== 'application/x-www-form-urlencoded' &&
      getEncrypted() &&
      res.data.data
    ) {
      res.data.data = JSON.parse(encryption.smDecrypt(res.data.data));
    }

    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data;
    }
    if (code === 401) {
      ElNotification.error({ title: '无效的会话，或者会话已过期，请重新登录。' });
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。');
    } else if (code === 500) {
      showError(msg);
      return Promise.reject(new Error(msg));
    } else if (code === 601) {
      ElMessage({ message: msg, type: 'warning' });
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      ElNotification.error({ title: msg });
      return Promise.reject('error');
    } else {
      return Promise.resolve(res.data);
    }
  },
  (error) => {
    let { message } = error;
    if (message == 'Network Error') {
      message = '后端接口连接异常';
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时';
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常';
    }
    ElMessage({ message: message, type: 'error', duration: 5 * 1000 });
    return Promise.reject(error);
  },
);

export default service;
