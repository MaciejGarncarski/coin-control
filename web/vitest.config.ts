import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: ['src/tests/vitest.setup.ts'],
    include: ['**/*.test.ts', '**/*.test.tsx'],
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
