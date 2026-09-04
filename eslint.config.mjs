// eslint.config.mjs
import eslint from '@eslint/js';

export default [
  eslint.configs.recommended,
  {
    ignores: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
  },
];
