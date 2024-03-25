import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import * as path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  VitePWA({
    registerType: "autoUpdate",
    manifest: {
      name: "Schrute",
      short_name: "Schrute",
      description: "My Awesome App description",
      display: "standalone",
      background_color: "#EBD723",
      theme_color: "#FFFFFF",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
  }),
  ],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  }
})
