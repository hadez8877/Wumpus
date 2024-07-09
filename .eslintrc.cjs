module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  plugins: [],
  rules: {
    'prettier/prettier': 'error',
  },
  overrides: [],
};
