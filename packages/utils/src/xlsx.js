import * as XLSX from 'xlsx/xlsx.mjs';

// 获取导出数据
export function exportExcelBlob(id) {
  const table1 = document.querySelector('#' + id + '.el-table').cloneNode(true);
  // element框架自带两组 table 导出Excel表格会重复,所以需要去除 el-table中的子节点el-table__fixed
  const fix = table1.querySelector('.el-table__fixed');
  const fixr = table1.querySelector('.el-table__fixed-right');
  if (fix) {
    table1.removeChild(fix);
  }
  if (fixr) {
    table1.removeChild(fixr);
  }
  const list2 = table1.querySelectorAll('.el-table__row--level-2');
  if (list2 != null && list2.length > 0) {
    list2.forEach((child) => {
      child.parentNode.removeChild(child);
    });
  }
  const list1 = table1.querySelectorAll('.el-table__row--level-1');
  if (list1 != null && list1.length > 0) {
    list1.forEach((child) => {
      child.parentNode.removeChild(child);
    });
  }
  const sheet1 = XLSX.utils.table_to_sheet(table1, { raw: true }); // 将一个table对象转换成一个sheet对象

  const range = XLSX.utils.decode_range(sheet1['!ref']);
  // 定义border样式
  const borderStyle = {
    top: {
      style: 'thin',
      color: { rgb: '000000' },
    },
    bottom: {
      style: 'thin',
      color: { rgb: '000000' },
    },
    left: {
      style: 'thin',
      color: { rgb: '000000' },
    },
    right: {
      style: 'thin',
      color: { rgb: '000000' },
    },
  };
  // 处理单元格格式
  for (let C = range.s.c; C < range.e.c; ++C) {
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cell = { c: C, r: R };
      const cellRef = XLSX.utils.encode_cell(cell);
      if (sheet1[cellRef]) {
        sheet1[cellRef].s = { font: { name: '黑体', sz: '10' }, border: borderStyle };
        if (!sheet1[cellRef].v) {
          sheet1[cellRef].v = '—';
        }
        if (sheet1[cellRef].v.includes('￥')) {
          sheet1[cellRef].v = sheet1[cellRef].v.replace('￥', '');
        }
      }
    }
  }
  // 处理合并单元格格式
  sheet1['!merges']?.forEach((item) => {
    if (item.e.r === item.s.r && item.e.c !== item.s.c) {
      // 列合并
      const R = item.s.r;
      for (let i = item.s.c; i <= item.e.c; i++) {
        const cell = { c: i, r: R };
        const cell0 = { c: i - 1, r: R };
        const cellRef = XLSX.utils.encode_cell(cell);
        const cellRef0 = XLSX.utils.encode_cell(cell0);
        if (!sheet1[cellRef] && sheet1[cellRef0] && sheet1[cellRef0].v) {
          sheet1[cellRef] = {
            t: 's',
            v: '',
            s: { font: { name: '黑体', sz: '10' }, border: borderStyle },
          };
        }
      }
    } else if (item.e.c === item.s.c && item.e.r !== item.s.r) {
      // 行合并
      const C = item.s.c;
      for (let i = item.s.r; i <= item.e.r; i++) {
        const cell = { c: C, r: i };
        const cell0 = { c: C, r: i - 1 };
        const cellRef = XLSX.utils.encode_cell(cell);
        const cellRef0 = XLSX.utils.encode_cell(cell0);
        if (!sheet1[cellRef] && sheet1[cellRef0] && sheet1[cellRef0].v) {
          sheet1[cellRef] = {
            t: 's',
            v: '',
            s: { font: { name: '黑体', sz: '10' }, border: borderStyle },
          };
        }
      }
    }
  });
  return sheet1;
}

function sheet2blob(sheet, sheetName) {
  sheetName = sheetName || 'sheet1';
  const workbook = {
    SheetNames: [sheetName],
    Sheets: {},
  };
  workbook.Sheets[sheetName] = sheet; // 生成excel的配置项
  // 将工作簿转换为二进制数据
  const wbout = XLSX.write(workbook, {
    bookType: 'xlsx', // 设置文件格式为 xlsx
    type: 'binary', // 设置输出为二进制
  });

  // const wbout = XLSXX.write(workbook, wopts);
  const blob = new Blob([wboutab(wbout)], {
    type: 'application/octet-stream',
  }); // 字符串转ArrayBuffer

  return blob;
}

function wboutab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

export function downloadExcelBlob(sheet1, filename) {
  let url = sheet2blob(sheet1);
  const saveName = filename + '.xlsx';
  if (typeof url === 'object' && url instanceof Blob) {
    url = URL.createObjectURL(url); // 创建blob地址
  }

  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.download = saveName || '';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
