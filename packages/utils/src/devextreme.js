import { saveAs } from 'file-saver-es';
import { Workbook } from 'exceljs';

/**
 * devextreme表格导出方法
 * @param _instance devextreme实例
 * @param fileName 导出文件名
 * @param exportFn devextem数据获取函数
 * @returns promise
 */
export function exportDevextremeData(_instance, fileName, exportFn) {
  if (!_instance) {
    throw new Error('表格实例为空');
  }
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('sheet1');
  return exportFn({
    worksheet: worksheet,
    component: _instance,
  }).then(() => {
    return workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName);
    });
  });
}
