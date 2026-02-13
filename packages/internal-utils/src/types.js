/* eslint-disable vue/prefer-import-from-vue */
import { isString } from '@vue/shared';

export { isString } from '@vue/shared';

export const isNumber = (val) => typeof val === 'number';

export const isStringNumber = (val) => {
  if (!isString(val)) {
    return false;
  }
  return !Number.isNaN(Number(val));
};
