import { createRouter, createWebHistory } from 'vue-router'

/**
 * 简单的约定式路由实现
 */
const modules = import.meta.glob('../views/**/index.vue')

const routes = Object.entries(modules).map(([_path, component]) => {
  const path = _path.replace('../views', '').replace('/index.vue', '') || '/'
  const name = path.split('/').filter(Boolean).join('-') || 'index'
  return {
    path,
    name,
    component,
  }
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
