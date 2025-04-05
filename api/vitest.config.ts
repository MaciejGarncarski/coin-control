import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      include: ['**/*.controller.ts', '**/*.service.ts'],
      provider: 'v8',
    },
  },
})
