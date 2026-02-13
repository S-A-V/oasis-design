import { saveAs } from 'file-saver-es';
import { ElMessage, ElLoading } from 'element-plus';
import { useGlobalConfig } from '@way-ui/hooks';
import $token from './token';

function fetchWithToken(path = '') {
  const { VITE_APP_BASE_URL } = useGlobalConfig('env').value;
  const url = path.startsWith('http') ? path : `${VITE_APP_BASE_URL}${path}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${$token.get()}`,
    },
  })
    .then((response) => response.blob())
    .then((blob) => {
      // const img = document.createElement('img');
      // img.src = URL.createObjectURL(blob);
      // document.body.appendChild(img);
      return URL.createObjectURL(blob);
    })
    .catch((error) => {
      ElMessage.error(error);
      throw new Error(`Error fetching file: ${error}`);
    });
}

function download(path, filename) {
  const downloadLoadingInstance = ElLoading.service({
    text: '正在下载数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const { VITE_APP_BASE_URL } = useGlobalConfig('env').value;
  const url = path.startsWith('http') ? path : `${VITE_APP_BASE_URL}${path}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${$token.get()}`,
    },
  })
    .then((response) => response.blob())
    .then((data) => {
      // const blob = new Blob([data]);
      saveAs(data, filename);
      downloadLoadingInstance.close();
    })
    .catch((error) => {
      downloadLoadingInstance.close();
      ElMessage.error('下载文件出现错误，请联系管理员！');
      throw new Error(`Error fetching file: ${error}`);
    });
}

export default {
  fetchWithToken,
  download,
};
