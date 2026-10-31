import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { cp, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { wordHintFallbacks } from './scripts/word-hint-fallbacks.mjs'

// Refresh persistent caches only when vocabulary content changes, not on login
// or unrelated app deployments. Include shards so direct list edits also invalidate.
const vocabularyHash = createHash('sha256')
const hashVocabularyDirectory = (directory) => {
  readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((entry) => {
      if (entry.isDirectory() && ['catalog', 'details'].includes(entry.name)) return
      const filePath = path.join(directory, entry.name)
      if (entry.isDirectory()) hashVocabularyDirectory(filePath)
      // Derived from the canonical full/core files already included in this hash.
      else if (entry.name === 'extended.json') return
      else if (entry.name.endsWith('.json')) {
        vocabularyHash.update(filePath)
        vocabularyHash.update(readFileSync(filePath))
      }
    })
}
vocabularyHash.update(readFileSync('public/data/vocabulary.json'))
hashVocabularyDirectory('public/data/vocabulary')
const vocabularyVersion = vocabularyHash.digest('hex').slice(0, 16)

const copyPublicAppAssets = () => ({
  name: 'copy-public-app-assets',
  apply: 'build',
  async writeBundle() {
    const publicDir = path.resolve('public')
    const outDir = path.resolve('dist')
    const ignored = new Set(['audio', 'audio-updates', 'data', '.DS_Store'])

    await mkdir(outDir, { recursive: true })

    const entries = await readdir(publicDir, { withFileTypes: true })
    await Promise.all(
      entries
        .filter((entry) => !ignored.has(entry.name))
        .map((entry) =>
          cp(path.join(publicDir, entry.name), path.join(outDir, entry.name), {
            recursive: true,
            force: true,
            // Original design sheets are retained in source, never shipped.
            filter: source => !/(?:-source|-alpha|sprite[^/]*)\.png$/.test(source),
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
  define: {
    'import.meta.env.VITE_VOCABULARY_VERSION': JSON.stringify(vocabularyVersion),
  },
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
    wordHintFallbacks(),
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
        theme_color: '#4F7CFF',
        background_color: '#F7FAFF',
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
        globIgnores: ['**/audio/**', '**/audio-updates/**', '**/data/**/*.json', '**/images/**', '**/assets/word-hints/**'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/images/') && url.pathname.endsWith('.webp'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'flashcards-images-v1',
              matchOptions: { ignoreSearch: true },
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 30,
                purgeOnQuotaError: true,
              },
              cacheableResponse: {
                statuses: [200],
                headers: { 'content-type': 'image/webp' },
              },
            },
          },
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
