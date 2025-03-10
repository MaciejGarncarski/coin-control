import { defineConfig, loadEnv } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

const env = loadEnv(process.env.NODE_ENV as string, process.cwd(), 'VITE_')

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: parseInt(env.VITE_PORT),
  },
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // test: {
  //   globals: true,
  //   environment: "jsdom",
  // },
})
