import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/home/index.vue'
const Layout = () => import('../views/layout')// 布局的组件
const Home = () => import('../views/home/index')// 主页组件
const Question = () => import('../views/home/question')// 问答组件
const Video = () => import('../views/home/video')// 视频组件
const User = () => import('../views/home/user')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [{
      path: '/home',
      component: Home
    }, {
      path: '/question',
      component: Question
    }, {
      path: '/video',
      component: Video
    }, {
      path: '/user',
      component: User
    }]
  }
]

const router = new VueRouter({
  routes
})

export default router
