import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    globalSetup: ['src/tests/setup.ts'],
    globals: true,
    coverage: {
      include: ['src/modules/**/*.ts'],
      provider: 'istanbul',
    },
  },
})
