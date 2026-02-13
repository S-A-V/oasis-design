export declare function getEncrypted(): boolean;
export declare function setEncrypted(encrypted: boolean): void;
export declare function removeEncrypted(): void;
export declare function showError(errorMsg?: string, separator?: string): Promise<void>;
export declare function parseTime(time: string | number | Date, pattern?: string): string | null;
export declare function resetForm(refName: string): void;
export declare function addDateRange(params: any, dateRange: any[], propName?: string): any;
export declare function selectDictLabel(datas: Record<string, any>, value: any): string;
export declare function selectDictLabels(
  datas: Record<string, any>,
  value: string | string[],
  separator?: string,
): string;
export declare function sprintf(str: string, ...args: any[]): string;
export declare function parseStrEmpty(str: string): string;
export declare function mergeRecursive(source: any, target: any): any;
export declare function handleTree(
  data: any[],
  id?: string,
  parentId?: string,
  children?: string,
): any[];
export declare function tansParams(params: Record<string, any>): string;
export declare function getNormalPath(p: string): string;
export declare function blobValidate(data: any): boolean;
