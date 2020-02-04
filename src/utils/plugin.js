//导入时间处理包
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)
// 转化时间到相对时间
function relTime(date) {
  return dayjs().locale('zh-cn').from(date)
}
export default {
  install(Vue) {
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({
      duration: 800,
      ...params
    }) // 小伎俩
    Vue.filter('relTime', relTime)
  }
}
