import 'reflect-metadata'

import { createApp } from 'vue'
import { AppLayout } from './layout/app'
import { router } from './plugin/router'

createApp(AppLayout)
  .use(router)
  .mount('#app')
