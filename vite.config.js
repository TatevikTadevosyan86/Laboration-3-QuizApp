import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      manifest: false,
      includeAssets: ['audio/*.wav'],
      workbox: {
        globPatterns: ['**/*.{html,js,css}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})