/**
 * 输入框输入时, 转换日期格式
 * @param input 输入的字符串
 * @param cursorPos 光标位置
 * @param format 日期格式
 * @returns 补全后的日期字符串
 */
export declare function parseCompactDateTime(
  input: string,
  cursorPos: number,
  format: string,
): string;
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
export declare function autoCompleteDateTime(input: string): string;
