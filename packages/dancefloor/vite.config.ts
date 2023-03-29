import path from 'path'
import typescript from '@rollup/plugin-typescript'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

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
        'vue',
        'three',
        'three.modifiers',
        'three/examples/jsm/geometries/TextGeometry',
        'three/examples/jsm/loaders/MTLLoader',
        'three/examples/jsm/loaders/OBJLoader',
        'three/examples/jsm/controls/OrbitControls',
        'three/examples/jsm/loaders/SVGLoader'
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
