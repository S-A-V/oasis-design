/**
 * 金额千分位格式化，添加逗号分隔符
 * @param {*} value 需要格式化的数值
 * @returns 格式化后的字符串
 */
export function formatMoney(value) {
  if (value === null || value === undefined || value === '') return '';

  // 转换为字符串并去掉空格
  let stringValue = String(value).trim();

  // 判断是否为负数
  let isNegative = stringValue.startsWith('-');
  if (isNegative) {
    stringValue = stringValue.substring(1);
  }

  // 分离整数部分和小数部分
  let parts = stringValue.split('.');
  let integerPart = parts[0];
  let decimalPart = parts[1] || '';

  // 对整数部分添加千分位分隔符
  let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // 组合结果
  let result = formattedInteger;
  if (decimalPart) {
    result += '.' + decimalPart;
  }

  // 如果是负数，加上负号
  if (isNegative) {
    result = '-' + result;
  }

  return result;
}
