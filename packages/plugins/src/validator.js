const REGEX = {
  // 匹配以 http 或 https 开头的 URL
  http: /^(http|https):\/\/.*/,
  // 匹配以 http、https、ftp、mailto 或 tel 开头的外部链接
  externalLink: /^(http|https|ftp|mailto|tel):\/\/.*/,
};

/**
 * 检查给定的 URL 是否以 http 或 https 开头
 * @param {string} url - 要检查的 URL
 * @returns {boolean} - 如果 URL 合法，则返回 true；否则返回 false
 */
export function isHttp(url) {
  return REGEX.http.test(url);
}

/**
 * 检查给定的路径是否为外部链接
 * @param {string} path - 要检查的路径
 * @returns {boolean} - 如果路径是外链，则返回 true；否则返回 false
 */
export function isExternalLink(path) {
  return REGEX.externalLink.test(path);
}

export default {
  isHttp,
  isExternalLink,
};
