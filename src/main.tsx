import 'reflect-metadata'

import '@bilibili-firebird/style/lib/classes-style.styl'
import '@bilibili-firebird/style/lib/animation.styl'

import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
import { createApp } from 'vue'

import { AppLayout } from './layout/app'

dayjs.locale('zh-cn')
initApp()

function initApp () {
  const app = createApp(AppLayout)
  app.mount('#app')
}
