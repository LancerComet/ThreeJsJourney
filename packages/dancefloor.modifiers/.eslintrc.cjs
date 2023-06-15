module.exports = {
  env: {
    browser: true,
    es2021: true
  },

  extends: [
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
    '@typescript-eslint'
  ],

  ignorePatterns: [
    'protos/**/*',
    'src/protos/**/*'
  ],

  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: false
    }],
    'import/order': ['error', {
      groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      }
    }],
    'import/no-unresolved': 'off',
    'no-proto': 'off',
    'no-use-before-define': 'off',
    'no-lone-blocks': 'off'
  }
}
