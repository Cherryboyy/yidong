import Vue from 'vue'
import App from './App.vue'
import router from './permission'
// import "@/permission"
import store from './store'
import Vant, {
  Lazyload,
} from 'vant'
import 'vant/lib/index.less'
import 'amfe-flexible'
//导入全局样式
import './styles/index.less'
//导入时间处理
import plugin from './utils/plugin'
//导入图片懒加载插件
Vue.use(plugin)
// 注册好了 支持v-lazy指令
Vue.use(Lazyload)

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
