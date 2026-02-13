import { defineComponent, getCurrentInstance, h } from 'vue';
import { dayjs, ElTableColumn } from 'element-plus';
// import * as dayjs from "dayjs";
import { base64ToUtf8, buildTree } from '../../utils';
window.dayjs = dayjs;

function isNumeric(str) {
  return !Number.isNaN(parseFloat(str)) && Number.isFinite(Number(str));
}

const renderColumn = (column) => {
  return h(
    ElTableColumn,
    {
      label: column.label,
      align: column.align || 'left',
      headerAlign: column.headerAlign || 'center',
      width: column.width,
      minWidth: column.minWidth,
      className: column.summaryType,
      prop: column.column || '',
      fixed: column.fixed || false,
      showOverflowTooltip: column.showOverflowTooltip || false,
    },
    {
      default: (scope) => {
        if (column.children && column.children.length > 0) {
          return (
            column.children?.map((item) => {
              return renderColumn(item);
            }) || null
          );
        } else {
          return wrapEventCell(scope, column);
        }
      },
    },
  );
};

const wrapEventCell = (rowData, column) => {
  const ctx = getCurrentInstance();
  if (column.eventType) {
    return h(
      'div',
      {
        style: { color: '#2f7dff', cursor: 'pointer' },
        onClick: () => {
          ctx.emit('cell-click', { rowData, column });
        },
      },
      renderCell(rowData, column),
    );
  } else {
    return renderCell(rowData, column);
  }
};
const renderCell = (rowData, column) => {
  let data = '';
  if (column.formatType === 'text') {
    data = rowData.row[column.column];
  } else if (column.formatType === 'jsExpression') {
    const dynamicFunction = new Function(base64ToUtf8(column.format));
    data = dynamicFunction()(rowData, column);
  }
  // if (isNumeric(data)) {
  //   data = `${data}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // }
  return data;
};

// 递归渲染 el-table-column 的子组件
export default defineComponent({
  name: 'WLowCodeDrillDownColumnRender',
  props: {
    columns: {
      type: Array,
      required: true,
    },
  },
  emits: ['cell-click'],
  computed: {
    columnsTree() {
      const tableColumnsCopy = JSON.parse(JSON.stringify(this.columns));
      return buildTree(tableColumnsCopy);
    },
  },
  render() {
    return this.columnsTree.map((column) => {
      return renderColumn(column);
    });
  },
});
