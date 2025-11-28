module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  env: {
    es2022: true,
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        // 指定 monorepo 的 tsconfig 项目，eslint-import-resolver-typescript 会查找 tsconfig.json
        project: ['frontend/tsconfig.json', 'backend/tsconfig.json'],
      },
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    // 你可以按团队规范覆盖规则
    'no-unused-vars': 'off', // 使用 @typescript-eslint/no-unused-vars
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'import/no-unresolved': 'off', // 使用 typescript resolver，交由它处理
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  overrides: [
    {
      // 前端（React）规则
      files: ['frontend/**/*.{ts,tsx,js,jsx}'],
      env: {
        browser: true,
        node: false,
        es2022: true,
      },
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
      ],
      plugins: ['react', 'react-hooks', 'jsx-a11y'],
      rules: {
        // react specific rules
        'react/prop-types': 'off', // TS 用类型检查
        'react/react-in-jsx-scope': 'off',
      },
    },
    {
      // 后端（Node / NestJS）规则
      files: ['backend/**/*.{ts,js}'],
      env: {
        node: true,
        browser: false,
        es2022: true,
      },
      extends: ['plugin:node/recommended'],
      plugins: ['node'],
      rules: {
        'node/no-unsupported-features/es-syntax': 'off', // ts build handled separately
      },
    },
    {
      // Tests
      files: ['**/__tests__/**/*.{ts,tsx,js,jsx}', '**/*.{spec,test}.{ts,tsx,js,jsx}'],
      env: {
        jest: true,
      },
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
    },
  ],
};