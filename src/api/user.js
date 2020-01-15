// 登录接口封装

//引入之前封装的模块
import request from '../utils/request'

export function login (data) {
  return request ({
    url:'/authorizations',
    data,
    method:'post'
  })
}
