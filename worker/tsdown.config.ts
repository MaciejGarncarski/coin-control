import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/app.ts'],
  format: 'esm',
  platform: 'node',
  target: 'node22',
  outDir: 'dist',
  sourcemap: true,
  clean: true,
})
