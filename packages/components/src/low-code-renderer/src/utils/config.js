import { Encryption } from '@way-ui/utils/encryption';

const encryption = new Encryption(import.meta.env.VITE_BASE_ENCRYPTION_KEY);
let config = null;

export async function getConfig() {
  try {
    if (config) return config;
    if (import.meta.env.MODE == 'development') {
      const response = await fetch('/config.json');
      config = await response.json();
    } else {
      const response = await fetch('/config').then((response) => response.text());
      config = JSON.parse(encryption.smDecrypt(response));
    }
    return config;
  } catch (error) {
    console.error('Failed to load config.json:', error);
  }
}
export async function getBaseUrl() {
  try {
    const config = await getConfig();
    return config.BASE_URL || import.meta.env.VITE_APP_BASE_URL;
  } catch (error) {
    console.error('Failed to load config.json:', error);
    return import.meta.env.VITE_APP_BASE_URL; // 降级处理
  }
}

export async function getApiUrl() {
  const baseUrl = await getBaseUrl();
  return baseUrl + import.meta.env.VITE_APP_BASE_API;
}

export async function getHomeConfig() {
  try {
    const config = await getConfig();
    return config['HOME_PAGE_CONFIG'] ?? {};
  } catch (error) {
    console.error('Failed to load config.json:', error);
  }
}
