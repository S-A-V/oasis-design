import config from '@way-ui/eslint-config';

export default [
  ...config,
  {
    name: 'local/ignores',
    ignores: ['playground'],
  },
  {
    name: 'local/rules',
    rules: {
      'vue/block-order': 'off',
      'vue/multi-word-component-names': 'warn',
    },
  },
];
