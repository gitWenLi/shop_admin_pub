import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/home',
      component: () => import('../views/Home.vue'),
      children: [
        {
          path: '/users',
          component: () => import('../views/User.vue')
        },
        {
          path: '/roles',
          component: () => import('../views/Roles.vue')
        },
        {
          path: '/rights',
          component: () => import('../views/Rights.vue')
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach(function (to, form, next) {
  const token = localStorage.getItem('token')
  if (token || to.path === '/login') {
    next()
  } else {
    next('/login')
  }
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
