import { createRouter, createWebHashHistory, onBeforeRouteUpdate} from 'vue-router'
import Home from '../components/Home.vue'

const routes = [
  {
    name: 'home',
    path: '/',
    meta: {
      title: '首页'
    },
    component: Home,
    redirect: '/welcome',
    children: [
      {
        name: 'welcome',
        path: '/welcome',
        meta: {
          title: '欢迎页'
        },
        component: () => import('./../views/Welcome.vue')
      },
      {
        name:'用户管理',
        path:'/system/user',
        meta:{
          title:'用户管理'
        },
        component: () => import('./../views/User.vue'),
      },
      {
        name:'菜单管理',
        path:'/system/menu',
        meta:{
          title:'菜单管理'
        },
        component: () => import('./../views/Menu.vue'),
      },
      {
        name:'角色管理',
        path:'/system/role',
        meta:{
          title:'角色管理'
        },
        component: () => import('./../views/Role.vue'),
      },
      {
        name:'部门管理',
        path:'/system/dept',
        meta:{
          title:'部门管理'
        },
        component: () => import('./../views/Dept.vue'),
      },
    ]
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录页'
    },
    component: () => import('../views/Login.vue')
  },
  {
    name: '404',
    path: '/404',
    meta: {
      title: '登录页'
    },
    component: () => import('../views/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 检查路由的方法
function checkPermission(path){
  // 这里获取的就是当传进来的路径与获取的路径一致时返回长度
  let hasPermission = router.getRoutes().filter(route => route.path == path).length
  if(hasPermission){
    return true
  }else {
    return false
  }
}

// 路由守卫
router.beforeEach((to, from, next) => {
  if(checkPermission(to.path)){
    document.title = to.meta.title
    next()
  }else {
    next('/404')
  }
})

export default router