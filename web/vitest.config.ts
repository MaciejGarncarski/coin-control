import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: ['src/tests/vitest.setup.ts'],
    include: ['**/*.test.ts', '**/*.test.tsx'],
    environment: 'jsdom',
    coverage: {
      include: ['src/**'],
      exclude: [
        '**/components/ui/**',
        'src/config/**',
        'src/constants/**',
        '**/**.js',
        '**/**.mjs',
      ],
      provider: 'v8',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
