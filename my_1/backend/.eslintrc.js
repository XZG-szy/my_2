// backend/.eslintrc.js
export default {
    env: {
        node: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        // 自定义规则
        'no-console': 'off',
    },
};
