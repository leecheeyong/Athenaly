import './assets/style.css'
import 'boxicons/css/boxicons.min.css'

import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
 {
    path: '/activity',
    name: 'Visualization',
    component: () => import('@/views/Visualizer.vue')
  },
   {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/views/Demo.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash
      }
    }
  }
})

createApp(App).use(router).mount('#app')
