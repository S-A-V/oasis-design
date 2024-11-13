export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-html',
    'stylelint-config-recommended-vue',
    'stylelint-config-recess-order',
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['if', 'else', 'for', 'each', 'while', 'mixin', 'include'],
      },
    ],
    'selector-class-pattern': [
      '(^([a-z][a-z0-9]*)(-[a-z0-9]+)*$)|(^el-[a-z-_]+)',
      {
        message: (selector) => `Expected class selector "${selector}" to be kebab-case`,
      },
    ],
  },
};
