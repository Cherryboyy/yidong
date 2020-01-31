 // 配置导航守卫
 import router from '../router'

 // 引入store
 import store from '../store'

 //路由拦截
 router.beforeEach(function (to, from, next) {
   if (to.path.startsWith('/user') && !store.state.user.token) {
     // 拦截是否带有token
     let toPath = {
       path: '/login',
       query: {
         redirectUrl: to.path // 携带要去的地址到登录页 => 登录成功之后  有了权限 再回到刚才没有权限去的地址
       }
     }
     next(toPath)
   } else {
     next()
   }
 })

 export default router
