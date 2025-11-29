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
    files: ['apps/demo/**/*'],
    rules: {
      'no-console': 'off',
      'no-debugger': 'off',
    },
  },
)
