module.exports = {
  env: {
    browser: true,
    es2021: true
  },

  extends: [
    'plugin:vue/essential',
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],

  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },

  plugins: [
    'vue',
    '@typescript-eslint'
  ],

  ignorePatterns: ['**/dist/*.js'],

  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    '@typescript-eslint/no-unused-vars': 'off',

    '@typescript-eslint/no-inferrable-types': 'off',

    'import/order': ['error', {
      groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      }
    }],

    'import/no-unresolved': 'off'
  }
}
