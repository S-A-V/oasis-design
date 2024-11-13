import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import configPrettier from 'eslint-config-prettier';

import autoImport from './.eslintrc-auto-import.mjs';

export default [
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...autoImport.globals,
      },
    },
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  configPrettier,
  {
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'no-var': 'error',

      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: { max: 20 },
          multiline: { max: 1 },
        },
      ],
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['index', '401', '404'],
        },
      ],
      'vue/singleline-html-element-content-newline': 'off',
    },
  },
  {
    ignores: [
      'node_modules',
      'dist',
      'pnpm-lock.yaml',
      'CHANGELOG.en-US.md',
      'docs/components.d.ts',
      'coverage',
      'play',
      'ssr-testing/cases/*',
      'docs/.vitepress/i18n/*',
      'docs/.vitepress/cache/*',
      'docs/.vitepress/crowdin/*',
      '!docs/.vitepress/crowdin/en-US',
      '!.*',
    ],
  },
];
