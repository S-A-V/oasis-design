const prettier = 'prettier --write';
const eslint = 'eslint --fix';
const stylelint = 'stylelint --fix';

export default {
  '*.{html,vue}': [prettier, eslint, stylelint],
  '*.{css,scss}': [prettier, stylelint],
  '*.{js,jsx,mjs,ts,tsx,mts}': [prettier, eslint],
  '*.json': [prettier],
  '*.md': [prettier],
};
