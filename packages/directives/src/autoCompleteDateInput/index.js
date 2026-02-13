import { parseCompactDateTime } from '@way-ui/utils/auto-complete-date-time';
// 使用 WeakMap 存储每个元素的 cleanup 函数
const cleanupMap = new WeakMap();
// 指令要求容器内有且仅有一个静态 <input> 元素
export const autoCompleteDateInput = {
  mounted(el, binding) {
    const input = el.querySelector('input');
    if (!input) return;
    const { format = 'YYYY-MM-DD' } = binding.value || {};
    let isProgrammaticUpdate = false;
    const handleInput = () => {
      if (isProgrammaticUpdate) return;
      const raw = input.value.trim();
      if (!raw) return;
      const cursorPos = input.selectionStart || 0;
      const formatted = parseCompactDateTime(raw, cursorPos, format);
      // 触发自定义事件，由父组件监听并更新 model.ref
      isProgrammaticUpdate = true;
      try {
        // 派发自定义事件, 赋值操作在业务侧
        input.dispatchEvent(
          new CustomEvent('auto-complete-update', {
            bubbles: true,
            detail: { value: formatted },
          }),
        );
      } finally {
        isProgrammaticUpdate = false;
      }
    };
    input.addEventListener('input', handleInput);
    // 注册清理函数
    cleanupMap.set(el, () => {
      input.removeEventListener('input', handleInput);
    });
  },
  beforeUnmount(el) {
    const cleanup = cleanupMap.get(el);
    if (cleanup) {
      cleanup();
      cleanupMap.delete(el);
    }
  },
};
