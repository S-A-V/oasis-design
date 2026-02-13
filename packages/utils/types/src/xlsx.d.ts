// Excel列定义
export interface ExcelColumn {
  label: string; // 列标题
  prop: string; // 列属性名
  width?: number; // 列宽度
  formatter?: (val: any) => any; // 格式化函数
}

// 导出Excel配置项
export interface ExportOptions {
  filename?: string; // 文件名
  sheets?: Array<{
    name: string; // 工作表名称
    columns: ExcelColumn[]; // 列定义
    data: any[]; // 数据源
  }>;
  autoWidth?: boolean; // 是否自动列宽
}

// 导入Excel配置项
export interface ImportOptions {
  fields?: string[]; // 字段映射
  sheet?: number | string; // 工作表索引或名称
  header?: number; // 表头行号
  skipEmpty?: boolean; // 是否跳过空行
}

// 导入结果
export interface ImportResult {
  headers: string[]; // 表头
  data: any[]; // 数据
  errors?: string[]; // 错误信息
}

// 工作表类型
export type Sheet = import('xlsx').Sheet;

/**
 * 将表格导出为Excel工作表
 * @param id 表格元素ID
 */
export function exportExcelBlob(id: string): Sheet;

/**
 * 下载Excel文件
 * @param sheet 工作表对象
 * @param filename 文件名(不含扩展名)
 */
export function downloadExcelBlob(sheet: Sheet, filename: string): void;
