import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: [
            'packages/**/*.{test,spec}.ts',
          ],
        },
      },
    ],
  },
})
