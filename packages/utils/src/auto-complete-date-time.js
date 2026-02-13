import dayjs from 'dayjs';
/**
 * 判断格式中是否包含时间部分
 */
function hasTimePart(format) {
  return /H|h|mm?|ss?/.test(format);
}
const padZero = (n) => n.toString().padStart(2, '0');
/**
 * 获取某年某月的最大天数（兼容单数字月）
 */
function getMaxDay(yearStr, monthStr) {
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) || 1;
  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) return 31;
  return dayjs(`${year}-${month}`, 'YYYY-M').daysInMonth();
}
/**
 * 输入框输入时, 转换日期格式
 * @param input 输入的字符串
 * @param cursorPos 光标位置
 * @param format 日期格式
 * @returns 补全后的日期字符串
 */
export function parseCompactDateTime(input, cursorPos, format) {
  const isDateTime = hasTimePart(format);
  // 直接取光标前的内容并提取数字
  const digits = input.substring(0, cursorPos).replace(/\D/g, '');
  if (!digits) return '';
  let result = '';
  // --- 年 ---
  const yearDigits = digits.substring(0, 4);
  if (digits.length > 0) {
    let year = yearDigits;
    if (year.length === 4) {
      const y = parseInt(year, 10);
      if (y < 1900) {
        year = '1900';
      }
    }
    result += year;
  }
  // --- 月 ---
  const monthDigits = digits.substring(4, 6);
  if (digits.length > 4) {
    let month = monthDigits;
    if (month.length === 2) {
      const m = parseInt(month, 10);
      if (m === 0) {
        month = '01';
      } else if (m > 12) {
        month = '12';
      }
    }
    result += '-' + month;
  }
  // --- 日 ---
  const dayDigits = digits.substring(6, 8);
  if (digits.length > 6) {
    let day = dayDigits;
    const maxDay = getMaxDay(yearDigits, monthDigits);
    if (day.length === 2) {
      const d = parseInt(day, 10);
      if (d === 0) {
        day = '01';
      } else if (d > maxDay) {
        day = String(maxDay);
      }
    }
    result += '-' + day;
  }
  // --- 自动加空格（仅当日-月-日完整且合法）---
  let timeDigits = '';
  if (isDateTime && digits.length > 8) {
    // 构造标准格式：YYYY-MM-DD（补零）
    const testDate = dayjs(`${yearDigits}-${monthDigits}-${dayDigits}`, 'YYYY-MM-DD', true);
    if (testDate.isValid()) {
      timeDigits = digits.substring(8);
      result += ' ';
    }
  }
  // --- 处理时间 ---
  if (timeDigits) {
    let timeStr = '';
    // 小时（0～23）
    if (timeDigits.length > 0) {
      let h = timeDigits.substring(0, 2);
      if (h.length === 2) {
        const hour = parseInt(h, 10);
        if (hour > 23) h = '23';
      }
      timeStr = h;
    }
    // 分钟（0～59）
    if (timeDigits.length > 2) {
      let m = timeDigits.substring(2, 4);
      if (m.length === 2) {
        const minute = parseInt(m, 10);
        if (minute > 59) m = '59';
      }
      timeStr += ':' + m;
    }
    // 秒（0～59）
    if (timeDigits.length > 4) {
      let s = timeDigits.substring(4, 6);
      if (s.length === 2) {
        const second = parseInt(s, 10);
        if (second > 59) s = '59';
      }
      timeStr += ':' + s;
    }
    result += timeStr;
  }
  return result;
}
/**
 * 补全日期时间字符串的时间部分
 *
 * @param input 输入的日期时间字符串，支持格式：YYYY-MM-DD 或 YYYY-MM-DD HH:MM:SS
 * @returns 补全后的标准日期时间字符串，格式为：YYYY-MM-DD HH:MM:SS
 *
 * @example
 * // 输入纯日期
 * autoCompleteDateTime("2020-09-01") // 返回 "2020-09-01 00:00:00"
 *
 * @example
 * // 输入日期和小时
 * autoCompleteDateTime("2020-09-01 1") // 返回 "2020-09-01 01:00:00"
 *
 * @example
 * // 输入日期和小时（两位数）
 * autoCompleteDateTime("2020-09-01 10") // 返回 "2020-09-01 10:00:00"
 *
 * @example
 * // 输入完整日期时间
 * autoCompleteDateTime("2020-09-01 12:34:56") // 返回 "2020-09-01 12:34:56"
 */
export function autoCompleteDateTime(input) {
  if (!(input === null || input === void 0 ? void 0 : input.trim())) return '';
  const [datePart, timePart = ''] = input.trim().split(/\s+/, 2);
  const date = dayjs(datePart, 'YYYY-MM-DD', true);
  if (!date.isValid()) return input;
  // 解析时间部分：支持 "H", "H:m", "H:m:s"
  const [h = '0', m = '0', s = '0'] = timePart.split(':');
  const hour = Math.min(Math.max(parseInt(h, 10) || 0, 0), 23);
  const minute = Math.min(Math.max(parseInt(m, 10) || 0, 0), 59);
  const second = Math.min(Math.max(parseInt(s, 10) || 0, 0), 59);
  return `${datePart} ${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
}
