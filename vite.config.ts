import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dayjs from 'dayjs'
import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint'
import svgLoader from 'vite-svg-loader'
import packageJSON from './package.json'

const isProd = process.env.NODE_ENV === 'production'
const biliEnv = process.env.BILI_ENV as 'uat' | 'prod'
const proxyDist = {
  manga: biliEnv === 'uat'
    ? 'http://uat-manga.bilibili.com'
    : 'https://manga.bilibili.com',
  mng: biliEnv === 'uat'
    ? 'http://uat-manga-mng.bilibili.co'
    : 'https://manga-mng.bilibili.co'
}
const buildDate = dayjs().format('YYYY-MM-DDTHH:mm:ssZ')

const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml (html: string) {
      return html.replace(
        /<meta name="env" content="">/,
        `<meta name="env" content="${process.env.NODE_ENV}">`
      ).replace(
        /<meta name="buildDate" content="">/,
        `<meta name="buildDate" content="${buildDate}">`
      )
        .replace(
          /<meta name="version" content="">/,
          `<meta name="version" content="${packageJSON.version}">`
        )
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {
      NODE_ENV: process.env.NODE_ENV,
      BILI_ENV: process.env.BILI_ENV,
      VERSION: packageJSON.version
    }
  },

  base: isProd
    // ? `//${biliEnv === 'uat' ? 'uat-i0' : 'i0'}.hdslb.com/bfs/manga-static/hime_project_name/`
    ? '/'
    : '/',

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
    }),
    svgLoader(),
    htmlPlugin(),
    legacy({
      targets: 'defaults'
    })
  ],

  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    },

    preprocessorOptions: {
      styl: {
        imports: [
          // path.resolve(__dirname, './src/style/variable.styl')
        ]
      }
    }
  },

  server: {
    proxy: {
      '^/twirp/.*': {
        target: proxyDist.manga,
        changeOrigin: true,
        secure: false
      },
      '^/herald/.*': {
        target: proxyDist.mng,
        changeOrigin: true,
        secure: false
      },
      '^/glados/.*': {
        target: proxyDist.mng,
        changeOrigin: true,
        secure: false
      }
    },
    port: 80,
    host: '0.0.0.0'
  },

  build: {
    assetsInlineLimit: 8192
  }
})
