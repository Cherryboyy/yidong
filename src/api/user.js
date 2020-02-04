// 登录接口封装

//引入之前封装的模块
import request from '../utils/request'

export function login(data) {
  return request({
    url: '/authorizations',
    data,
    method: 'post'
  })
}
/** *关注用户***/
export function followUser(data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}
/** *取消关注***/
export function unFollowUser(target) {
  return request({
    method: 'delete',
    url: `/user/followings/${target}`
  })
}
