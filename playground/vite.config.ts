import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'

import { plugins } from './vite'

export default defineConfig(({ mode }) => {
  const { VITE_APP_BASE_URL } = loadEnv(mode, process.cwd())

  return {
    plugins,
    define: {
      'import.meta.env.VITE_APP_BASE_URL': JSON.stringify(VITE_APP_BASE_URL.replace(/\/+$/, '')),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: true,
      port: 81,
      open: false,
    },
    optimizeDeps: {
      include: ['lodash-es'],
    },
  }
})
