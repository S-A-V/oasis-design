import { Component, DefineComponent, ExtractPropTypes, ComponentPublicInstance, VNode } from 'vue';
import { DatePickerType, ElDatePicker } from 'element-plus';

// --- 1. 从你的 types.ts 中提取并导出核心类型 ---
export type WDatePickerModel = string | number | Date | string[] | number[] | Date[];

export interface WDatePickerProps<T extends WDatePickerModel = string> {
  /** 日期组件双向绑定值 */
  modelValue: T;
  /** 显示类型 */
  type?: DatePickerType;
  /** 判断日期是否禁用的函数 */
  disabledDate?: (date: Date) => boolean;
}

export interface WDatePickerEmits {
  /** 更新双向绑定的值 */
  (e: 'update:modelValue', value: WDatePickerModel): void;
  /** 在组件 Input 失去焦点时触发 */
  (e: 'blur', event: FocusEvent): void;
}

// --- 2. 定义组件实例暴露的方法 ---
export interface WDatePickerExpose {
  /** 使输入框获取焦点 */
  focus: () => void;
  /** 内部 Element Plus DatePicker 实例的引用 (如果业务需要) */
  // elRef: InstanceType<typeof ElDatePicker> | null
}

// --- 3. 构造 Vue 组件的 DefineComponent 类型 ---
// 使用泛型来支持不同的 modelValue 类型
export interface WDatePickerComponent<T extends WDatePickerModel = string> extends DefineComponent {
  // Props 定义
  new (): {
    $props: WDatePickerProps<T> & {
      // 扩展支持所有原生的 HTML 属性 (如 class, style) 和 Element Plus 属性
      [key: string]: any;
    };
  };
  // Emits 定义
  $emit: WDatePickerEmits;
  // 暴露的组件实例类型
  $options: {
    expose?: WDatePickerExpose;
  };
  // 插槽类型定义 (根据你的模板)
  $slots: {
    /** 默认插槽 (如果需要) */
    // default?: (props?: any) => VNode[];
    /** 透传 Element Plus DatePicker 的所有插槽 */
    [name: string]: (props?: any) => VNode[];
  };
}

// --- 4. 声明组件 ---
// 这是最后导出的、可以被 Vue 应用使用的组件变量
declare const WDatePicker: WDatePickerComponent;

// --- 5. 导出类型和组件 ---
export default WDatePicker;
