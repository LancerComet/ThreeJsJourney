import path from 'path'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import packageJSON from './package.json'

const isProd = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {
      NODE_ENV: process.env.NODE_ENV,
      VERSION: packageJSON.version
    }
  },

  base: isProd
    ? '/'
    : '/',

  resolve: {
    alias: {
      '@lancercomet/dancefloor': path.resolve(__dirname, '../packages/dancefloor'),
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
    }),
    legacy({
      targets: 'defaults'
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
