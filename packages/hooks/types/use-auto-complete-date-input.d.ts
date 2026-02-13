import type { Ref } from 'vue';
import type { ElDatePicker } from 'element-plus';
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
export declare function useAutoCompleteDateInput(
  pickerInstances: {
    ref: Ref<InstanceType<typeof ElDatePicker> | null>;
    model: Ref<string | null>;
    format?: string;
    disabledDate?: (date: Date) => boolean;
  }[],
  delay?: number,
): void;
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
export declare function useAutoCompleteDateInputManually(
  pickerInstances: {
    ref: Ref<InstanceType<typeof ElDatePicker> | null>;
    model: Ref<string | null>;
    format?: string;
    disabledDate?: (date: Date) => boolean;
  }[],
  delay?: number,
): Promise<() => void>;
