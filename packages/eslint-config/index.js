import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginJsonc from 'eslint-plugin-jsonc';
import pluginVue from 'eslint-plugin-vue';
import pluginPrettier from 'eslint-plugin-prettier/recommended';

export default [
  {
    name: 'way/ignores',
    ignores: [
      'public',
      'node_modules',
      'dist',
      'pnpm-lock.yaml',
      'CHANGELOG.en-US.md',
      'play',
      '!.*',
    ],
  },
  {
    name: 'way/languages',
    files: ['**/*.{js,mjs,jsx,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  pluginJs.configs.recommended,
  ...pluginJsonc.configs['flat/recommended-with-jsonc'],
  ...pluginVue.configs['flat/recommended'],
  pluginPrettier,
  {
    name: 'way/package-json',
    files: ['**/package.json'],
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          pathPattern: '^$',
          order: [
            'name',
            'version',
            'private',
            'packageManager',
            'description',
            'keywords',
            'homepage',
            'bugs',
            'license',
            'author',
            'contributors',
            'funding',
            'repository',
            'type',
            'main',
            'module',
            'types',
            'sass',
            'exports',
            'unpkg',
            'jsdelivr',
            'browser',
            'bin',
            'man',
            'directories',
            'scripts',
            'dependencies',
            'devDependencies',
            'peerDependencies',
            'peerDependenciesMeta',
            'optionalDependencies',
            'engines',
            'config',
            'files',
            'publishConfig',
            'overrides',
            'pnpm',
            'husky',
            'lint-staged',
            'eslintConfig',
          ],
        },
        {
          pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
          order: { type: 'asc' },
        },
      ],
    },
  },
  {
    name: 'way/rules',
    rules: {
      // js
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'no-var': 'error',

      // vue
      'vue/block-order': [
        'error',
        {
          order: [
            'script:not([setup])',
            'script[setup]',
            'template',
            'style:not([scoped])',
            'style[scoped]',
          ],
        },
      ],
      'vue/component-name-in-template-casing': [
        'error',
        'kebab-case',
        {
          registeredComponentsOnly: false,
          ignores: [],
        },
      ],
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineOptions', 'defineModel', 'defineProps', 'defineEmits', 'defineSlots'],
          defineExposeLast: true,
        },
      ],
      'vue/html-comment-content-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'always',
        },
      ],
      'vue/html-comment-content-spacing': ['error', 'always'],
      // 'vue/html-comment-indent': ['warn', 2],
      'vue/max-template-depth': ['error', { maxDepth: 8 }],
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['index', '401', '404'],
        },
      ],
      'vue/no-multiple-objects-in-class': 'error',
      'vue/no-ref-object-reactivity-loss': 'error',
      'vue/no-setup-props-reactivity-loss': 'error',
      'vue/no-static-inline-styles': [
        'warn',
        {
          allowBinding: true,
        },
      ],
      'vue/no-undef-properties': 'warn',
      'vue/no-unsupported-features': [
        'warn',
        {
          version: '^3.5.0',
          ignores: [],
        },
      ],
      'vue/no-unused-emit-declarations': 'warn',
      'vue/no-unused-properties': [
        'warn',
        {
          groups: ['props'],
          deepData: false,
          ignorePublicMembers: false,
          unreferencedOptions: [],
        },
      ],
      'vue/no-use-v-else-with-v-for': 'error',
      'vue/no-useless-mustaches': [
        'warn',
        {
          ignoreIncludesComment: true,
          ignoreStringEscape: true,
        },
      ],
      'vue/no-useless-v-bind': 'error',
      'vue/padding-line-between-blocks': 'error',
      'vue/prefer-define-options': 'error',
      'vue/prefer-prop-type-boolean-first': 'error',
      'vue/prefer-separate-static-class': 'error',
      'vue/prefer-true-attribute-shorthand': 'error',
      'vue/require-macro-variable-name': [
        'error',
        {
          defineProps: 'props',
          defineEmits: 'emit',
          defineSlots: 'slots',
          useSlots: 'slots',
          useAttrs: 'attrs',
        },
      ],

      // prettier
      'prettier/prettier': 'error',
    },
  },
];
