import Vue from 'vue'
import VueRouter from 'vue-router'
import '@/assets/css/global.css'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("@/components/Login.vue")
  },

]

const router = new VueRouter({
  routes
})

export default router
