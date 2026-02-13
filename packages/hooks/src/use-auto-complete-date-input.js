import { nextTick, onMounted, onBeforeUnmount } from 'vue';
import { parseCompactDateTime } from '@way-ui/utils/auto-complete-date-time';
/**
 * 获取 Element Plus 日期选择器的真实 DOM 元素
 */
function getRealElement($el) {
  if (!$el) return null;
  if ($el instanceof HTMLElement) return $el;
  if ($el.nodeType === Node.TEXT_NODE || $el.nodeType === Node.COMMENT_NODE) {
    const sibling = $el.nextElementSibling;
    if (sibling instanceof HTMLElement) return sibling;
  }
  if ($el.parentNode instanceof Element) {
    const editor = $el.parentNode.querySelector('.el-date-editor');
    if (editor) return editor;
  }
  return null;
}
const delayFun = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
/**
 * 绑定日期组件自动格式化核心逻辑
 */
function bindAutoCompleteDateInput(pickerRef, model, format, cleanupMap, disabledDate) {
  let _a;
  if (!((_a = pickerRef.value) === null || _a === void 0 ? void 0 : _a.$el)) return;
  const realEl = getRealElement(pickerRef.value.$el);
  if (!realEl || cleanupMap.has(realEl)) return;
  const input = realEl.querySelector('input');
  if (!input) return;
  // 防止input.dispatchEvent多次触发
  let isProgrammaticUpdate = false;
  // 记录上一次的合法值，若输入的值不满足disabledDate校验，则使用上一次合法值
  let lastValidValue = model.value;
  const handleInput = () => {
    if (isProgrammaticUpdate) return;
    const raw = input.value.trim();
    if (!raw) {
      model.value = null;
      lastValidValue = null;
      return;
    }
    // 获取光标位置
    const cursorPos = input.selectionStart || 0;
    const formatted = parseCompactDateTime(raw, cursorPos, format);
    // 判断是否满足disabledDate校验, 只校验完整日期
    const isComplete =
      /^\d{4}-\d{2}-\d{2}$/.test(formatted) ||
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(formatted);
    const isDisabled =
      isComplete &&
      (disabledDate === null || disabledDate === void 0
        ? void 0
        : disabledDate(new Date(formatted)));
    isProgrammaticUpdate = true;
    try {
      if (isDisabled) {
        // 恢复上一个合法值
        input.value = lastValidValue || '';
        // 不满足则不触发 model 更新
        return;
      }
      input.value = formatted; // 更新 UI 显示
      model.value = formatted; // 同步到数据模型
      lastValidValue = formatted; // 更新合法值
      input.dispatchEvent(new Event('input', { bubbles: true }));
    } finally {
      // 恢复标志
      isProgrammaticUpdate = false;
    }
  };
  input.addEventListener('input', handleInput);
  // 清理函数
  cleanupMap.set(realEl, () => {
    input.removeEventListener('input', handleInput);
  });
}
/**
 * 自动补全日期组件的输入
 *
 * 日期选择器的输入添加自动格式化功能，当用户输入日期时，会自动按照指定格式进行补全和格式化。
 *
 * @param pickerInstances 日期选择器实例配置数组
 * @param delay 可选的延迟时间（单位毫秒，默认为 0），如果发现实例没有挂载成功，可以加上延迟时间
 *
 * @example
 * // 基本使用
 * const datePickerRef = useTemplateRef<InstanceType<typeof ElDatePicker>>('datePicker')
 * const dateModel = ref<string | null>(null)
 *
 * useAutoCompleteDateInput([
 *   {
 *     ref: datePickerRef,
 *     model: dateModel,
 *     format: 'YYYY-MM-DD'
 *   }
 * ])
 *
 * @example
 * // 多个日期选择器
 * const picker1Ref = useTemplateRef<InstanceType<typeof ElDatePicker>>('picker1')
 * const picker1Model = ref<string | null>(null)
 *
 * const picker2Ref = useTemplateRef<InstanceType<typeof ElDatePicker>>('picker2')
 * const picker2Model = ref<string | null>(null)
 *
 * useAutoCompleteDateInput([
 *   {
 *     ref: picker1Ref,
 *     model: picker1Model,
 *     format: 'YYYY-MM-DD'
 *   },
 *   {
 *     ref: picker2Ref,
 *     model: picker2Model,
 *     format: 'YYYY-MM-DD HH:mm:ss'
 *   }
 * ], 100) // 添加 100ms 延迟
 */
export function useAutoCompleteDateInput(pickerInstances, delay) {
  // 遍历清理
  const cleanupMap = new Map();
  onMounted(async () => {
    await nextTick();
    // 延时处理，防止有些场景下，组件的DOM元素还没有渲染完成
    await delayFun(delay);
    for (const item of pickerInstances) {
      const { ref: pickerRef, model, format = 'YYYY-MM-DD', disabledDate } = item;
      bindAutoCompleteDateInput(pickerRef, model, format, cleanupMap, disabledDate);
    }
  });
  onBeforeUnmount(() => {
    // 批量清理所有监听器
    for (const cleanup of cleanupMap.values()) {
      cleanup();
    }
    cleanupMap.clear();
  });
}
/**
 * 手动初始化自动补全（用于 dialog / drawer 等动态场景）
 * @returns 清理函数，调用后移除所有事件监听器
 *
 * @example
 * let cleanupFn: (() => void) | null = null
 * async function onDialogOpened() {
 *  // 日期输入时format
 *  cleanupFn?.()
 *  cleanupFn = await useAutoCompleteDateInputManually(
 *    [
 *      {
 *        ref: baseInfoBirthdayRef,
 *        model: personBirthdayModel,
 *        format: 'YYYY-MM-DD HH:mm:ss',
 *      },
 *      {
 *        ref: baseInfoDeaddateRef,
 *        model: deaddateModel,
 *      },
 *    ],
 *    1000,
 *  )
 * }
 */
export async function useAutoCompleteDateInputManually(pickerInstances, delay) {
  // 遍历清理
  const cleanupMap = new Map();
  await nextTick();
  // 延时处理，防止有些场景下，组件的DOM元素还没有渲染完成
  await delayFun(delay);
  for (const item of pickerInstances) {
    const { ref: pickerRef, model, format = 'YYYY-MM-DD', disabledDate } = item;
    bindAutoCompleteDateInput(pickerRef, model, format, cleanupMap, disabledDate);
  }
  return () => {
    // 批量清理所有监听器
    for (const cleanup of cleanupMap.values()) {
      cleanup();
    }
    cleanupMap.clear();
  };
}
