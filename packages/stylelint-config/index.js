export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-html',
    'stylelint-config-standard-vue/scss',
    'stylelint-config-recess-order',
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'extends',
          'ignores',
          'include',
          'mixin',
          'if',
          'else',
          'media',
          'for',
          'at-root',
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'function',
          'each',
          'use',
          'forward',
          'return',
          'while',
        ],
      },
    ],
    'selector-class-pattern': [
      '(^([a-z][a-z0-9]*)(-[a-z0-9]+)*$)|(^el-[a-z-_]+)',
      {
        message: (selector) => `Expected class selector "${selector}" to be kebab-case`,
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'deep'],
      },
    ],
  },
};
