//封装登录请求的拦截器与tocken

//导入axios
import axios from 'axios'

// 导入json-bigint，这个东西是处理最大安全数值的
import JSONBig from 'json-bigint'

//导入管理token的vuex
import store from '../store'

//导入路由模块
import router from '../router/index'
import string from 'less/lib/less/functions/string'

// 初始化一个axios实例
// 此时我们调用instance就是使用axios
const instance = axios.create({
  //构造参数
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0',//设置请求的常用地址
  // ransformResponse的意思就是可以修改后台响应出来的数据
  transformResponse: [function (data) {//data就是后台返回的数据，此时我们要对后台返回的数据做处理
    try {
      // 此处对 data 进行任意转换处理
      //  当后台 响应的字符串 回到axios请求时 就会触发
      //  data是一个字符串  把字符串转化成 对象并且返回 默认的是JSON.parse()
      // 如果data是一个空字符串  直接转化就会报错
      return JSONBig.parse(data)//如果是最大安全值的我们直接把数据响应
    } catch (e) {
      return data// 如果失败 就把字符串直接返回
    }
  }]
})

// 设置一个请求拦截器
//这是固定写法，参数config就是返回的里面所有的配置，一些请求到的选项
instance.interceptors.request.use(function (config) {
  // config就是请求的参数
  if (store.state.user.token) {//我们此处判断一下vuex里面保管的token里面又没有值
    // 我们可以直接把请求到的token注入到里面,如果token存在 就要注入
    config.headers['Authorization'] = `Bearer ${store.state.user.token}`
  }
}, function (error) {
  //如果不能操控则返回错误
  return Promise.reject(error)
})

//设置一个响应拦截器
instance.interceptors.response.use(function (response) {
// 对响应数据做点什么
  // 得到的数据response实际上被axios包了一层
  try {
    //把数据解构
    return response.data.data
  } catch (e) {
    return response.data
  }
}, async function (error) {
  //如果错误的话，token失效，我们要出路token失效的问题
  // 如何判断失效
  // error  => config (当前请求 的配置) request(请求) response(响应)
  if (error.response && error.response.status === 401) {
    //判断一下响应状态是不是401，如果是的话直接跳转到登录页面
    let toPath = {
      path: '/login',
      query: { redirectUrl: router.currentRoute.path }//这个是路由里面的方法，可以直接获取当前的路由
    }//定义了一个跳转的对象
    // 如果是token过期，我们还要判断一下是否还有备用的refresh_token
    if (store.state.user.refresh_token) {
      try {
        // 如果里面有备用的token，我们应该发送一个请求换取一个新的token
        // 此时我们不应该继续使用instance，因为使用的话会再次进入拦截器
        // 我们使用默认的axios
        let result = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${store.state.user.refresh_token}`
          }
        })
        //此时我们把之前vuex里面的token清空
        store.commit('updateUser', {
          //把新的token存入进去
          user: {
            token: result.data.data.token,//拿到新的token
            refresh_token: store.state.user.refresh_token
          }
        })//更新到vuex数据中，同时更新到本地缓存中
        return instance(error.config)
      } catch (e) {
//  如果错误 表示补救措施也没用了 应该跳转到登录页 并且 把废掉的user全都干掉
        store.commit('clearUser') // 所有的用户信息清空
        router.push(toPath) // 跳转到回登录页
      }
    } else {
      // 连refresh_token 都没有
      //  当访问 页面时 => 去登录 => 登录成功之后 => 回到之前的页面  记住当前的地址 => 登录页面 => 读取地址  => 跳到地址
      //  params 动态路由  user/:id
      // query传参  user? id=123
      //   获取当前页面地址
      router.push(toPath)
    }
  }
  return Promise.reject(error)
})

//导出request工具
export default instance
