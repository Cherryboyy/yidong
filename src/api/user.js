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
/** **获取用户个人信息*****/
export function getUserInfo() {
  return request({
    url: '/user'
  })
}
/****
 * 获取用户个人资料
 * *****/
export function getUserProfile() {
  return request({
    url: '/user/profile' // 获取用户个人资料的接口地址
  })
}
/****
 *封装一个编辑用户头像的API
 * ****/
export function updateImg(data) {
  return request({
    url: '/user/photo', // 编辑头像的地址
    method: 'patch', // 设置头像的类型
    data
  })
}
/** 封装一个 保存用户的方法***/
export function saveUserInfo(data) {
  return request({
    url: '/user/profile', // 编辑资料的地址
    data,
    method: 'patch'
  })
}
