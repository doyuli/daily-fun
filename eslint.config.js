import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    pnpm: true,
    ignores: [
      '**/types',
      '**/cache',
      '**/*.svg',
    ],
  },
  {
    files: ['playground/**/*'],
    rules: {
      'no-console': 'off',
      'pnpm/json-enforce-catalog': 'off',
    },
  },
)
