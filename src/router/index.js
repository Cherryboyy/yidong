import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入vuex管理的toenk
// import store from '@/store'
// import Home from '../views/home/index.vue'
const Layout = () => import('../views/layout') // 布局的组件
const Home = () => import('../views/home/index') // 主页组件
const Question = () => import('../views/home/question') // 问答组件
const Video = () => import('../views/home/video') // 视频组件
const User = () => import('../views/home/user') // 个人中心
const Profile = () => import('../views/home/user/profile') //编辑资料
const Chat = () => import('../views/home/user/chat') // 小智同学
const Login = () => import('../views/login') //登录组件
const Article = () => import('../views/article') //文章详情
const Search = () => import('../views/search') //搜索中心
const SearchResult = () => import('../views/search/result') //搜索结果

Vue.use(VueRouter)


const routes = [{
  path: '/',
  component: Layout, //一级路由
  children: [{ //二级路由
    path: '/',
    component: Home //首页
  }, {
    path: '/question',
    component: Question //问答组件
  }, {
    path: '/video',
    component: Video //视频组件
  }, {
    path: '/user',
    component: User //个人中心
  }]
}, {
  path: '/user/profile',
  component: Profile //编辑资料
}, {
  path: '/user/chat',
  component: Chat //小智同学
}, {
  path: '/login',
  component: Login //登录
}, {
  path: '/article',
  component: Article //文章详情
}, {
  path: '/search',
  component: Search //搜索
}, {
  path: '/search/result',
  component: SearchResult //搜索结果
}]

const router = new VueRouter({
  routes
})

export default router
