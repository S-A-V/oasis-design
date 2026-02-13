import Excel from 'exceljs';
import { saveAs } from 'file-saver-es';

export function exportLuckysheet(luckysheet, fileName, actionType = 'export', printerName = '') {
  // 参数为luckysheet.getluckysheetfile()获取的对象
  // 1.创建工作簿，可以为工作簿添加属性
  const workbook = new Excel.Workbook();
  // 2.创建表格，第二个参数可以配置创建什么样的工作表
  if (Object.prototype.toString.call(luckysheet) === '[object Object]') {
    luckysheet = [...luckysheet];
  }
  luckysheet.forEach(function (table) {
    const t_data = table.data;
    if (t_data.length === 0) return true;
    // ws.getCell('B2').fill = fills.
    const t_name = table.name;
    const t_config = table.config;
    const t_showGridLines = table.showGridLines;
    const worksheet = workbook.addWorksheet(t_name);
    const merge = (t_config && t_config.merge) || {};
    const borderInfo = (t_config && t_config.borderInfo) || [];
    const columnLen = (t_config && t_config.columnlen) || {};
    const protect = (t_config && t_config.authority) || {};
    const listMap = (t_config && t_config.listMap) || {};
    const unLockCell = (t_config && t_config.unLockCell) || null;
    worksheet.pageSetup.showGridLines = t_config && t_showGridLines === 1;
    // 3.设置单元格合并,设置单元格边框,设置单元格样式,设置值
    const defaultRowHeight = table.defaultRowHeight;
    const defaultColWidth = table.defaultColWidth;
    worksheet.properties.defaultRowHeight = defaultRowHeight / 1.285;
    worksheet.properties.defaultColWidth = defaultColWidth / 8.2;
    const defaultFontSize = t_config.defaultFontSize;
    const defaultFontStyle = t_config.defaultFontStyle;
    setStyleAndValue(table.data, worksheet, listMap, unLockCell, defaultFontSize, defaultFontStyle);
    setMerge(merge, worksheet);
    setBorder(borderInfo, worksheet);
    setColWidth(columnLen, worksheet);
    void setProtect(protect, worksheet);
    return true;
  });
  // return
  // 4.写入 buffer
  const buffer = workbook.xlsx.writeBuffer().then((data) => {
    // 打印
    if (actionType === 'print') {
      if (window.electronAPI) {
        const options = [];
        options[0] = 'excelPrint';
        options[1] = {
          ExcelName: fileName + '.xlsx',
          ReportOpStyle: 1,
          Printer: printerName,
        };
        options[2] = data;
        window.electronAPI.doExtension(options);
      } else {
        return {
          message: '暂不支持打印',
        };
      }
      return;
    }

    // 导出
    const blob = new Blob([data], {
      type: 'application/vnd.ms-excel;charset=utf-8',
    });
    // console.log("导出成功！")
    saveAs(blob, `${fileName}.xlsx`);
  });
  return buffer;
}

function setStyleAndValue(
  cellArr,
  worksheet,
  listMap,
  unLockCell,
  defaultFontSize,
  defaultFontStyle,
) {
  if (!Array.isArray(cellArr)) return;
  cellArr.forEach(function (row, rowid) {
    row.every(function (cell, columnid) {
      let fill;
      //  style 填入到_value中可以实现填充色
      const letter = createCellPos(columnid);
      const target = worksheet.getCell(letter + (rowid + 1));
      if (!cell) {
        return true;
      }
      fill = fillConvert(cell.bg);
      if (defaultFontSize && !cell.fs) {
        cell.fs = defaultFontSize;
      }
      if (defaultFontStyle) {
        cell.ff = defaultFontStyle;
      }
      const font = fontConvert(cell.ff, cell.fc, cell.bl, cell.it, cell.fs, cell.cl, cell.ul);
      const alignment = alignmentConvert(cell.vt, cell.ht, cell.tb, cell.tr);
      let value = '';
      if (cell.v && cell.m && cell.m.toString().indexOf('*') >= 0) {
        value = {
          richText: [
            { font: { color: { argb: 'FF0000' } }, text: '*' },
            { text: cell.m.replace('*', '') },
          ],
        };
      } else if (cell.f) {
        value = { formula: cell.f, result: cell.v };
      } else if (!cell.v && cell.ct && cell.ct.s) {
        // xls转为xlsx之后，内部存在不同的格式，都会进到富文本里，即值不存在与cell.v，而是存在于cell.ct.s之后
        // value = cell.ct.s[0].v
        value = '';
        const _ct = cell.ct;
        _ct.s.forEach((arr) => {
          value = value + arr.v;
        });
      } else {
        value = cell.v;
      }
      // console.log('1233', letter + (rowid + 1))
      target.font = font;
      target.alignment = alignment;
      target.value = value;
      target.numFmt = '@'; // 强制文本格式
      if (cell.ps) {
        target.note = {};
        target.note.texts = [
          {
            font: {
              bold: true,
              size: 9,
              color: { theme: 1 },
              name: 'Calibri',
              family: 1,
              scheme: 'minor',
            },
            text: cell.ps.value,
          },
        ];
        target.note.editAs = 'twoCells';
      }
      const _listMap = listMap;
      if (_listMap[letter + (rowid + 1)]) {
        target.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"' + _listMap[letter + (rowid + 1)].join(',') + '"'],
        };
      }
      if (unLockCell) {
        const _unLockCell = unLockCell;
        if (_unLockCell[rowid + '_' + columnid]) {
          target.protection = {
            locked: false,
            hidden: false,
          };
        } else {
          fill = fillConvert('#F2F2F2');
        }
      }
      for (const key in fill) {
        console.log(key);
        target.fill = fill;
        break;
      }
      return true;
    });
  });
}
function createCellPos(n) {
  const ordA = 'A'.charCodeAt(0);
  const ordZ = 'Z'.charCodeAt(0);
  const len = ordZ - ordA + 1;
  let s = '';
  while (n >= 0) {
    s = String.fromCharCode((n % len) + ordA) + s;
    n = Math.floor(n / len) - 1;
  }
  return s;
}
function fillConvert(bg) {
  if (!bg) {
    return {};
  }
  const fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: bg.replace('#', '') },
  };
  return fill;
}
function fontConvert(ff = 0, fc = '#000000', bl = 0, it = 0, fs = 9, cl = 0, ul = 0) {
  // luckysheet：ff(样式), fc(颜色), bl(粗体), it(斜体), fs(大小), cl(删除线), ul(下划线)
  const luckyToExcel = {
    0: '微软雅黑',
    1: '宋体（Song）',
    2: '黑体（ST Heiti）',
    3: '楷体（ST Kaiti）',
    4: '仿宋（ST FangSong）',
    5: '新宋体（ST Song）',
    6: '华文新魏',
    7: '华文行楷',
    8: '华文隶书',
    9: 'Arial',
    10: 'Times New Roman ',
    11: 'Tahoma ',
    12: 'Verdana',
    num2bl: function (num) {
      return num === 0 ? false : true;
    },
  };
  // 出现Bug，导入的时候ff为luckyToExcel的val
  const font = {
    name: typeof ff === 'number' ? luckyToExcel[ff] : ff,
    family: 1,
    size: fs,
    color: { argb: fc.replace('#', '') },
    bold: luckyToExcel.num2bl(bl),
    italic: luckyToExcel.num2bl(it),
    underline: luckyToExcel.num2bl(ul),
    strike: luckyToExcel.num2bl(cl),
  };
  return font;
}
function alignmentConvert(vt = 'default', ht = 'default', tb = 'default', tr = 'default') {
  // luckysheet:vt(垂直), ht(水平), tb(换行), tr(旋转)
  const luckyToExcel = {
    vertical: {
      0: 'middle',
      1: 'top',
      2: 'bottom',
      default: 'top',
    },
    horizontal: {
      0: 'center',
      1: 'left',
      2: 'right',
      default: 'left',
    },
    wrapText: {
      0: false,
      1: false,
      2: true,
      default: false,
    },
    textRotation: {
      0: 0,
      1: 45,
      2: -45,
      3: 'vertical',
      4: 90,
      5: -90,
      default: 0,
    },
  };
  const alignment = {
    vertical: luckyToExcel.vertical[vt],
    horizontal: luckyToExcel.horizontal[ht],
    wrapText: luckyToExcel.wrapText[tb],
    textRotation: luckyToExcel.textRotation[tr],
  };
  return alignment;
}
function setMerge(luckyMerge = {}, worksheet) {
  const mergearr = Object.values(luckyMerge);
  mergearr.forEach((elem) => {
    // elem格式：{r: 0, c: 0, rs: 1, cs: 2}
    // 按开始行，开始列，结束行，结束列合并（相当于 K10:M12）
    const _elem = elem;
    worksheet.mergeCells(_elem.r + 1, _elem.c + 1, _elem.r + _elem.rs, _elem.c + _elem.cs);
  });
}
function setBorder(luckyBorderInfo, worksheet) {
  if (!Array.isArray(luckyBorderInfo)) return;
  luckyBorderInfo.forEach(function (elem) {
    // 现在只兼容到borderType 为range的情况
    // console.log('ele', elem)
    const _elem = elem;
    if (_elem.rangeType === 'range') {
      const border = borderConvert(_elem.borderType, _elem.style, _elem.color);
      const rang = _elem.range[0];
      // console.log('range', rang)
      const row = rang.row;
      const column = rang.column;
      for (let i = row[0] + 1; i < row[1] + 2; i++) {
        for (let y = column[0] + 1; y < column[1] + 2; y++) {
          worksheet.getCell(i, y).border = border;
        }
      }
    }
    if (_elem.rangeType === 'cell') {
      // col_index: 2
      // row_index: 1
      // b: {
      //   color: '#d0d4e3'
      //   style: 1
      // }
      // const { col_index, row_index } = _elem.value
      const borderData = Object.assign({}, _elem.value);
      delete borderData.col_index;
      delete borderData.row_index;
      // const border = addborderToCell(borderData, _elem.value.row_index, _elem.value.col_index)
      // console.log('bordre', border, borderData)
      // worksheet.getCell(row_index + 1, col_index + 1).border = border
    }
    // console.log(rang.column_focus + 1, rang.row_focus + 1)
    // worksheet.getCell(rang.row_focus + 1, rang.column_focus + 1).border = border
  });
}
function borderConvert(borderType, style = '1', color = '#000') {
  // 对应luckysheet的config中borderinfo的的参数
  if (!borderType) {
    return {};
  }
  const luckyToExcel = {
    type: {
      'border-all': 'all',
      'border-top': 'top',
      'border-right': 'right',
      'border-bottom': 'bottom',
      'border-left': 'left',
    },
    style: {
      0: 'none',
      1: 'thin',
      2: 'hair',
      3: 'dotted',
      4: 'dashDot', // 'Dashed',
      5: 'dashDot',
      6: 'dashDotDot',
      7: 'double',
      8: 'medium',
      9: 'mediumDashed',
      10: 'mediumDashDot',
      11: 'mediumDashDotDot',
      12: 'slantDashDot',
      13: 'thick',
    },
  };
  const template = {
    style: luckyToExcel.style[style],
    color: { argb: color.replace('#', '') },
  };
  const border = {};
  if (luckyToExcel.type[borderType] === 'all') {
    border['top'] = template;
    border['right'] = template;
    border['bottom'] = template;
    border['left'] = template;
  } else {
    border[luckyToExcel.type[borderType]] = template;
  }
  return border;
}
function setColWidth(columnLen, worksheet) {
  for (const key in columnLen) {
    const value = columnLen[key];
    const dobCol = worksheet.getColumn(parseInt(key) + 1);
    if (dobCol) {
      dobCol.width = value / 8.2;
    }
  }
}
async function setProtect(authority, worksheet) {
  if (!authority) {
    return;
  }
  if (authority.sheet === 1) {
    const options = {
      selectLockedCells: false, //允许用户选择锁定的单元格
      selectUnlockedCells: true, //允许用户选择未锁定的单元格
      formatCells: false, //允许用户格式化单元格
      formatColumns: false, //允许用户格式化单元格
      formatRows: false, //允许用户格式化单元格
      insertColumns: false, //允许用户格式化单元格
      insertRows: false, //允许用户格式化单元格
      insertHyperlinks: false, //允许用户格式化单元格
      deleteColumns: false, //允许用户格式化单元格
      deleteRows: false, //允许用户格式化单元格
      sort: false, //允许用户格式化单元格
      autoFilter: false, //允许用户格式化单元格
      pivotTables: false, //允许用户格式化单元格
    };
    await worksheet.protect('zwx123', options);
  }
}
