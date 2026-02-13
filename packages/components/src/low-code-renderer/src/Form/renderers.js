import Select from './select.vue';
import Cascader from './cascader.vue';
import Checkbox from './checkbox.vue';
import Switch from './switch.vue';
import DatePicker from './date-picker.vue';
import CustomDateRangePicker from './custom-date-range-picker.vue';
import InputText from './input-text.vue';
import InputNumber from './input-number.vue';
import Radio from './radio.vue';
import TreeSelect from './tree-select.vue';
// 使用全局变量存储renderers，确保跨包共享
let globalRenderers;

// 初始化全局renderers
const initGlobalRenderers = () => {
  // 检查全局对象中是否已存在renderers
  if (typeof window !== 'undefined') {
    window.__GLOBAL_RENDERERS__ = {
      select: Select,
      cascader: Cascader,
      checkbox: Checkbox,
      switch: Switch,
      'date-picker': DatePicker,
      'date-range-picker': CustomDateRangePicker,
      'input-text': InputText,
      'input-number': InputNumber,
      radio: Radio,
      'tree-select': TreeSelect,
    };
    globalRenderers = window.__GLOBAL_RENDERERS__;
  }
  return globalRenderers;
};

// 确保初始化
initGlobalRenderers();

const registerRenderers = (renderersToRegister) => {
  if (!renderersToRegister) {
    return console.warn('[Renderers] No renderers provided for registration.');
  }

  // 支持单个或批量注册
  const renderersArray = Array.isArray(renderersToRegister)
    ? renderersToRegister
    : [renderersToRegister];

  renderersArray.forEach((renderer) => {
    const { name, component } = renderer;

    if (!name || !component) {
      return console.warn('[Renderers] Each renderer must have a name and component property.');
    }

    if (globalRenderers[name]) {
      return console.warn(`[Renderers] The renderer named "${name}" has already been registered.`);
    }

    globalRenderers[name] = component;
  });

  return globalRenderers;
};

const getRenderers = () => {
  // 确保每次获取最新的全局renderers
  return initGlobalRenderers();
};

export { registerRenderers, getRenderers };
