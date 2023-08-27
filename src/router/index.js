import { createRouter, createWebHashHistory} from 'vue-router'
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
        name:'system',
        path:'/system',
        meta:{
          title:'系统管理'
        },
        component: () => import('./../views/Welcome.vue'),
        children:[
          {
            name:'user',
            path:'user',
            meta:{
              title:'用户管理'
            },
            component: () => import('./../views/Welcome.vue'),
          },
          {
            name:'menu',
            path:'/menu',
            meta:{
              title:'菜单管理'
            },
            component: () => import('../views/Welcome.vue'),
          },
          {
            name:'role',
            path:'/role',
            meta:{
              title:'角色管理'
            },
            component: () => import('../views/Welcome.vue'),
          },
          {
            name:'dept',
            path:'/dept',
            meta:{
              title:'部门管理'
            },
            component: () => import('../views/Welcome.vue'),
          },
        ]
      },
      {
        name:'audit',
        path:'/audit',
        meta:{
          title:'审批管理'
        },
        component: () => import('../views/Welcome.vue'),
        children:[
          {
            name:'leave',
            path:'/leave',
            meta:{
              title:'休假申请'
            },
            component: () => import('../views/Welcome.vue'),
          },
          {
            name:'approve',
            path:'/approve',
            meta:{
              title:'待我审批'
            },
            component: () => import('../views/Welcome.vue'),
          },
        ]
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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router