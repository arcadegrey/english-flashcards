import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { cp, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'

const copyPublicAppAssets = () => ({
  name: 'copy-public-app-assets',
  apply: 'build',
  async writeBundle() {
    const publicDir = path.resolve('public')
    const outDir = path.resolve('dist')
    const ignored = new Set(['audio', 'data', '.DS_Store'])

    await mkdir(outDir, { recursive: true })

    const entries = await readdir(publicDir, { withFileTypes: true })
    await Promise.all(
      entries
        .filter((entry) => !ignored.has(entry.name))
        .map((entry) =>
          cp(path.join(publicDir, entry.name), path.join(outDir, entry.name), {
            recursive: true,
            force: true,
          })
        )
    )
  },
})

const copyPublicDataAfterPwa = () => ({
  name: 'copy-public-data-after-pwa',
  apply: 'build',
  closeBundle: {
    order: 'post',
    async handler() {
      await cp(path.resolve('public/data'), path.resolve('dist/data'), {
        recursive: true,
        force: true,
      })
    },
  },
})

export default defineConfig({
  build: {
    copyPublicDir: false,
    minify: 'esbuild',
    reportCompressedSize: false,
  },
  server: {
    watch: {
      ignored: ['**/public/audio/**']
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true
      }
    }
  },
  plugins: [
    react(),
    copyPublicAppAssets(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.svg'],
      manifest: {
        id: '/',
        name: '英语单词卡片 - English Flashcards',
        short_name: '单词卡片',
        description: '四六级核心词汇学习应用，支持卡片学习和测验模式',
        start_url: '/',
        scope: '/',
        theme_color: '#8b5cf6',
        background_color: '#f5f7fa',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'zh-CN',
        dir: 'ltr',
        categories: ['education', 'productivity'],
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,ico,txt,woff2,webmanifest}'],
        globIgnores: ['**/audio/**', '**/data/**/*.json'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    copyPublicDataAfterPwa()
  ],
})
