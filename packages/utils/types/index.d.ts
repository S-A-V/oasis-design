export * from './src/auto-complete-date-time';

export function formatDate(cellValue: string | number | Date | null): string;

export function formatTime(time: string | number, option?: string): string;

export function getQueryObject(url?: string): Record<string, string>;

export function byteLength(str: string): number;

export function cleanArray<T>(actual: T[]): T[];

export function param(json: Record<string, any>): string;

export function param2Obj(url: string): Record<string, string>;

export function html2Text(val: string): string;

export function objectMerge<T extends object>(target: T, source: object | any[]): T;

export function toggleClass(element: HTMLElement, className: string): void;

export function getTime(type: 'start' | 'end'): number;

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean,
): T;

export function deepClone<T>(source: T): T;

export function uniqueArr<T>(arr: T[]): T[];

export function createUniqueString(): string;

export function hasClass(ele: HTMLElement, cls: string): boolean;

export function addClass(ele: HTMLElement, cls: string): void;

export function removeClass(ele: HTMLElement, cls: string): void;

export function makeMap(str: string, expectsLowerCase?: boolean): (key: string) => boolean;

export const exportDefault: string;

export const beautifierConf: {
  html: Record<string, string | boolean>;
  js: Record<string, string | boolean>;
};

export function titleCase(str: string): string;

export function camelCase(str: string): string;

export function isNumberStr(str: string): boolean;
