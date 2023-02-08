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
  {
    path: '/home',
    name: 'Home',
    component: () => import("@/components/Home.vue"),
    children: [
      {
        path: '/home',
        redirect: '/home/welcome'
      }
      ,
      {
        path: 'welcome',
        component: () => import('@/components/Welcome.vue')
      },
      {
        path: '/users',
        component: () => import('@/components/user/User.vue')
      },
      {
        path: '/rights',
        component: () => import('@/components/power/Rights.vue')
      },
      {
        path: '/roles',
        component: () => import('@/components/power/Roles.vue')
      },
      {
        path: '/categories',
        component: () => import('@/components/goods/Cate.vue')
      },
      {
        path: '/params',
        component: () => import('@/components/goods/Params.vue')
      },
      {
        path: '/goods',
        component: () => import('@/components/goods/List.vue')
      },
      {
        path: '/goods/add',
        component: () => import('@/components/goods/Add.vue')
      },
      {
        path: '/reports',
        component: () => import('@/components/report/Report.vue')
      },
    ]
  },

]

const router = new VueRouter({
  routes
})
// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // to  要访问的路径
  // from  从哪个路径来的
  // next  放行  next("/login")强制跳转 

  if (to.path === "/login") return next()
  // 获取toktn
  const token_ = window.sessionStorage.getItem('token')
  if (!token_) return next('/login')
  next()
})
export default router
