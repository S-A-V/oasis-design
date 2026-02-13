/**
 * luckysheet 导出方法
 * @param luckysheet luckysheet.getluckysheetfile() 获取的对象
 * @param fileName 文件名（不带后缀）
 * @param actionType 'export' 导出，'print' 打印
 * @param printerName 打印机名称
 * @returns Promise<void>
 */
export declare function exportLuckysheet(
  luckysheet: Array<Record<string, unknown>>,
  fileName: string,
  actionType?: 'export' | 'print',
  printerName?: string,
): Promise<void>;
