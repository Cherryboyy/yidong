// 封装一request模块
// 就是设置一个请求拦截器与响应拦截器
import axios from 'axios'
import JSONBig from 'json-bigint'
import store from '../store'

const instance = axios.create({
  //当请求的时候回响应
  //baseURL是设置了一个默认响应头
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0',
  transformResponse: [function (data) {
    //data是一个字符串把字符串转化为对象并返回
    try {
      return JSONBig.parse(data)
    } catch (e) {
      return data
    }
  }]
})

instance.interceptors.request.use(function (config) {
  //在放回配制之前往配制里塞入token
  if (store.state.user.token) {
    //如果token存在  就要注入到里面
    config.headers['Authorization'] = `Bearer ${store.state.user.token}`
  }
  //配制信息
  return config
}, function (error) {
  return Promise.reject(error)//直接返回promise错误
})
instance.interceptors.response.use(function (response) {
  try {
    return response.data //响应的数据 返回得到的数据
  } catch (e) {
    return response.data
  }

}, function (error) {
  return Promise.reject(error)
})
export default instance
