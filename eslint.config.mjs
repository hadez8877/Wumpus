import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'warn',
      "eqeqeq": 'error',
      'no-var': 'off',
      'prefer-const': 'warn',
    },
  },
  pluginJs.configs.recommended,
];
