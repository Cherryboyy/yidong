//封装登录请求的拦截器与tocken

//导入axios
import axios from 'axios'

// 导入json-bigint，这个东西是处理最大安全数值的
import JSONBig from 'json-bigint'

//导入管理token的vuex
import store from '../store'

//导入路由模块
import router from '../router/index'

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
},function (error) {
  return Promise.reject(error)
})




//导出request工具
export default instance
