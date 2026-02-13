export type SM4Mode = 'cbc' | 'ecb';

export declare class Encryption {
  constructor(key: string);

  /**
   * 国密4加密
   * @param text 需要加密的文本
   * @param mode 加密模式（'ecb' 或 'cbc'，默认 'cbc'）
   * @returns 加密后的文本
   */
  smEncrypt(text: string, mode?: SM4Mode): string;

  /**
   * 国密4解密
   * @param text 需要解密的文本
   * @param mode 解密模式（'ecb' 或 'cbc'，默认 'cbc'）
   * @returns 解密后的文本
   */
  smDecrypt(text: string, mode?: SM4Mode): string;

  /**
   * AES加密
   * @param text 需要加密的文本
   * @returns 加密后的文本
   */
  aesEncrypt(text: string): string;

  /**
   * AES解密
   * @param text 需要解密的文本
   * @returns 解密后的文本
   */
  aesDecrypt(text: string): string;
}
