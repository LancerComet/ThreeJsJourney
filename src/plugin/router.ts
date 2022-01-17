import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { pageConfig } from '../config'

const pages: RouteRecordRaw[] = []
Object.keys(pageConfig).forEach(sectionName => {
  const baseUrl = sectionName.replace(/ /g, '-').toLowerCase()
  pageConfig[sectionName].forEach(item => {
    pages.push({
      ...item,
      name: `${sectionName}.${item.name as string}`,
      path: '/' + baseUrl + '/' + item.path
    })
  })
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...pages,
    {
      path: '/test',
      component: () => import('../views/test/index').then(item => item.TestPage)
    },
    {
      path: '/',
      component: () => import('../views/index/index').then(item => item.IndexPage)
    }
  ]
})

export {
  router
}
