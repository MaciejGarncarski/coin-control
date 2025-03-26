import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

const env = loadEnv(process.env.NODE_ENV as string, process.cwd(), 'VITE_')

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: parseInt(env.VITE_PORT),
  },
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
