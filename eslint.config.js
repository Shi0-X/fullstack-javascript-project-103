import globals from 'globals';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 12, // ES2021
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-multi-spaces': ['error', { ignoreEOLComments: false }],
      'no-trailing-spaces': 'error',
      indent: ['error', 2],
      'max-len': ['error', { code: 80 }],
    },
  },
];
