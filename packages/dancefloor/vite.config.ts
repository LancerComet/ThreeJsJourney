import path from 'path'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import typescript from '@rollup/plugin-typescript'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint'

export default defineConfig({
  base: '/',

  plugins: [
    vue(),
    vueJsx({
      babelPlugins: [
        'babel-plugin-transform-typescript-metadata',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    }),
    eslintPlugin({
      cache: false
    })
  ],

  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  },

  server: {
    port: 3000,
    host: '0.0.0.0'
  },

  build: {
    assetsInlineLimit: 8192,
    lib: {
      entry: path.resolve(__dirname, './lib/index.ts'),
      name: 'Dancefloor',
      fileName: (format) => {
        return format === 'umd'
          ? 'index.js'
          : `index.${format}.js`
      }
    },
    rollupOptions: {
      external: [
        'vue'
      ],
      output: {
        globals: {
          vue: 'Vue'
        }
      },
      plugins: [
        typescript({
          rootDir: path.resolve(__dirname, './lib'),
          declaration: true,
          declarationDir: path.resolve(__dirname, './dist'),
          exclude: path.resolve(__dirname, './node_modules/**'),
          allowSyntheticDefaultImports: true
        })
      ]
    }
  }
})
