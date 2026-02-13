export function base64ToUtf8(base64Str) {
  // 使用 atob 解码 Base64 字符串为二进制字符串
  const binaryStr = atob(base64Str);

  // 将二进制字符串转换为 Uint8Array
  const uint8Array = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    uint8Array[i] = binaryStr.charCodeAt(i);
  }

  // 使用 TextDecoder 解码 Uint8Array 为原始字符串
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(uint8Array);
}
export function filterDynamicColumns(data) {
  let result = [];
  const dataClone = JSON.parse(JSON.stringify(data));
  dataClone.forEach((item) => {
    // 如果当前项是动态项，加入结果
    if (item.dynamic) {
      let { children, ...rest } = item; // 去除children属性
      result.push(rest);
    }
    // 如果有 children，递归查找子项中的动态项
    if (item.children && item.children.length > 0) {
      result = result.concat(filterDynamicColumns(item.children)); // 递归调用
    }
  });

  return result;
}

export function mergeDataByKey(dataSet, key) {
  // 创建一个以 key 为键的 Map，方便查找
  const mergedMap = new Map();

  // 遍历每个数组，逐一合并数据
  dataSet.forEach((array) => {
    array.forEach((item) => {
      const existing = mergedMap.get(item[key]);
      if (existing) {
        // 如果该 key 已经存在，合并当前项到已存在项
        Object.assign(existing, item);
      } else {
        // 如果没有该 key，直接添加该项
        item[key] && mergedMap.set(item[key], { ...item });
      }
    });
  });

  // 返回所有合并后的数据
  return Array.from(mergedMap.values());
}

export function isPlainObjectWithKeys(value) {
  return (
    Object.prototype.toString.call(value) === '[object Object]' &&
    value !== null &&
    Object.keys(value).length > 0
  );
}

export function transformData(data, primaryKey) {
  return data.map((item) => {
    let transformedItem = { [primaryKey]: item[primaryKey] };

    Object.keys(item).forEach((key) => {
      if (key !== primaryKey) {
        const doses = item[key];
        if (isPlainObjectWithKeys(doses)) {
          Object.keys(doses).forEach((doseKey) => {
            const newKey = `${key}_${doseKey}`;
            transformedItem[newKey] = doses[doseKey];
          });
        } else {
          transformedItem[key] = item[key];
        }
      }
    });
    return transformedItem;
  });
}

export function buildTree(dataArray, parent = 'pid', son = 'id') {
  const data = JSON.parse(JSON.stringify(dataArray));
  const map = new Map();
  const roots = [];

  // 先将每个节点存入map，方便根据id找到对应的节点
  data.forEach((item) => {
    item.children = [];
    map.set(item[son], item);
  });

  // 遍历数据，根据pid构建父子关系
  data.forEach((item) => {
    const parentNode = map.get(item[parent]);
    if (!parentNode) {
      roots.push(item);
    } else {
      parentNode.children.push(item);
    }
  });

  return roots;
}
function buildDefaultObject(data, primaryKey) {
  // 创建一个对象来存储所有的编码和子字段
  let result = {};

  data.forEach((item) => {
    Object.keys(item).forEach((code) => {
      if (code !== primaryKey) {
        if (!result[code]) {
          result[code] = '';
        }
        // 遍历该编码下的子字段，确保每个子字段都存在并赋值为 "0"
        if (isPlainObjectWithKeys(item[code])) {
          result[code] = {};
          Object.keys(item[code]).forEach((subKey) => {
            if (!(subKey in result[code])) {
              result[code][subKey] = '';
            }
          });
        }
      }
    });
  });

  return result;
}
function completeFields(defaultObj, dataArray) {
  return dataArray.map((item) => {
    // 遍历 defaultObj 中的所有编码
    Object.keys(defaultObj).forEach((code) => {
      // 检查每个编码是否存在于当前数据中
      if (!(code in item)) {
        // 如果没有这个编码，直接添加并使用 defaultObj 中的默认值
        if (typeof defaultObj[code] === 'object') {
          item[code] = { ...defaultObj[code] };
        } else {
          item[code] = defaultObj[code];
        }
      } else {
        // 如果编码已存在，检查子字段是否完整
        if (isPlainObjectWithKeys(item[code])) {
          Object.keys(defaultObj[code]).forEach((subKey) => {
            if (!(subKey in item[code])) {
              // 如果子字段缺失，使用 defaultObj 中的默认值补充
              item[code][subKey] = '0';
            }
          });
        }
      }
    });

    return item;
  });
}
export function mergeAndFill(data, primaryKey) {
  const baseObj = buildDefaultObject(data, primaryKey);
  const completedData = completeFields(baseObj, data);
  return completedData;
}
