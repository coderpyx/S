import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入组件
// 路由懒加载导入
const Login = () => import('../views/login/Login.vue')

const Home = () => import('../views/home/Home.vue')

const Welcome = () => import('../components/user/Welcome.vue')
const Users = () => import('../components/user/Users.vue')
const Roles = () => import('../components/power/Roles.vue')
const Rights = () => import('../components/power/Rights.vue')
const Goods = () => import('../components/goodsList/Goods.vue')


Vue.use(VueRouter)

const routes = [
  //重定向
  {
    path:'',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home,
    // redirect:'/welcome',

    children:[
      {
        path:'',
        redirect:'/welcome',
      },
      {
        path:'/welcome',
        component:Welcome
      },
      {
        path:'/users',
        component:Users
      },
      {
        path:'/goods',
        component:Goods
      },
      {
        path:'/roles',
        component:Roles
      },
      {
        path:'/rights',
        component:Rights
      }
    ]
  }
]
const router = new VueRouter({
  routes,
  mode:'history',//history模式
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if(to.path ==='/login') return next();
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login');
  next();
})


export default router
