/**
 * 加密解密方法
 */
import * as CryptoJS from 'crypto-js';
import * as GmCrypt from 'gm-crypt';

const { sm4 } = GmCrypt;

export class Encryption {
  constructor(key) {
    // this.key = keys || VITE_BASE_ENCRYPTION_KEY;
    this.key = key;
  }

  // 国密4加密
  smEncrypt(text, mode = 'cbc') {
    const sm4Instance = new sm4({
      key: this.key, // key值与后端一致
      mode, // 加密的方式有两种，ecb和cbc两种，这里使用的是ecb，cbc模式还要加一个iv的参数，ecb不用
      iv: mode === 'cbc' ? this.key : null,
      cipherType: 'base64',
    });
    return sm4Instance.encrypt(text);
  }

  // 国密4解密
  smDecrypt(text, mode = 'cbc') {
    const sm4Instance = new sm4({
      key: this.key, // key值与后端一致
      mode, // 加密的方式有两种，ecb和cbc两种，这里使用的是ecb，cbc模式还要加一个iv的参数，ecb不用
      iv: mode === 'cbc' ? this.key : null,
      cipherType: 'base64',
    });
    return sm4Instance.decrypt(text);
  }

  // AES加密
  aesEncrypt(text) {
    const keyHex = CryptoJS.enc.Utf8.parse(this.key);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }

  // AES解密
  aesDecrypt(text) {
    const keyHex = CryptoJS.enc.Utf8.parse(this.key);
    const decrypted = CryptoJS.AES.decrypt(text, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
