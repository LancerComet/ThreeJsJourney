import * as path from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',

  resolve: {
    alias: {
      '@lancercomet/dancefloor': path.resolve(__dirname, '../packages/dancefloor/lib'),
      '@lancercomet/dancefloor.modifiers': path.resolve(__dirname, '../packages/dancefloor.modifiers/lib'),
      three: path.resolve(__dirname, 'node_modules/three'),
      'three.modifiers': path.resolve(__dirname, 'node_modules/three.modifiers')
    }
  },

  plugins: [
    vue(),
    vueJsx({
      babelPlugins: [
        'babel-plugin-transform-typescript-metadata',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    })
  ],

  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  },

  server: {
    port: 80,
    host: '0.0.0.0',
    proxy: {
      '/twirp': {
        target: 'https://manga.bilibili.com',
        changeOrigin: true,
        headers: {
          origin: 'manga.bilibili.com'
        }
      }
    }
  },

  build: {
    assetsInlineLimit: 8192
  }
})
