import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "[request]" */ '@/views/View.vue')
    },
    {
      path: '/edit',
      component: () => import(/* webpackChunkName: "[request]" */ '@/views/Edit.vue')
    },
    {
      path: '/browse',
      component: () => import(/* webpackChunkName: "[request]" */ '@/views/Browse.vue')
    }
  ]
})

export default router
