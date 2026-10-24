import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { cp, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'

// Refresh persistent caches only when vocabulary content changes, not on login
// or unrelated app deployments. Include shards so direct list edits also invalidate.
const vocabularyHash = createHash('sha256')
const hashVocabularyDirectory = (directory) => {
  readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((entry) => {
      const filePath = path.join(directory, entry.name)
      if (entry.isDirectory()) hashVocabularyDirectory(filePath)
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
  define: {
    'import.meta.env.VITE_VOCABULARY_VERSION': JSON.stringify(vocabularyVersion),
  },
  build: {
    copyPublicDir: false,
    minify: 'esbuild',
    reportCompressedSize: false,
    // Keep each added content batch within the PWA precache asset limit.
    // Static imports retain the existing startup and offline hint behavior.
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'word-notes-four', test: /[\\/]src[\\/]data[\\/]expansionFourWordNotes\.js$/ },
            { name: 'word-notes-five', test: /[\\/]src[\\/]data[\\/]expansionFiveWordNotes\.js$/ },
            { name: 'word-notes-six', test: /[\\/]src[\\/]data[\\/]expansionSixWordNotes\.js$/ },
            { name: 'word-notes-seven', test: /[\\/]src[\\/]data[\\/]expansionSevenWordNotes\.js$/ },
            { name: 'word-notes-eight', test: /[\\/]src[\\/]data[\\/]expansionEightWordNotes\.js$/ },
            { name: 'word-notes-nine', test: /[\\/]src[\\/]data[\\/]expansionNineWordNotes\.js$/ },
          ],
        },
      },
    },
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
