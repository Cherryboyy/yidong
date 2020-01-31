//专门处理频道的请求
import request from '@/utils/request'

//获取我的频道
export function getMyChannels() {
  //返回的是一个promise  
  return request({
    url: '/user/channels'
  })
}
