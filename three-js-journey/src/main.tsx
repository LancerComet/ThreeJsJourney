import 'reflect-metadata'

import CameraControls from 'camera-controls'
import * as THREE from 'three'
import { createApp } from 'vue'

import { AppLayout } from './layout/app'
import { router } from './plugin/router'

CameraControls.install({ THREE })

createApp(AppLayout)
  .use(router)
  .mount('#app')
