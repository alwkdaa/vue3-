import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入路由
import router from './router'
import App from './App.vue'
/* import axios from 'axios'
import config from './config' */
import request from './utils/request'
// 引入二次封装的localstorage
import storage from './utils/storage'
// 引入封装的接口api
import api from './api'
// 引入vuex
import store from './store'

/* axios.get(config.mockApi + '/login').then((res) => {
  console.log(res);
}) */
const app = createApp(App)

// 注册request
app.config.globalProperties.$request = request;
app.config.globalProperties.$api = api;
app.config.globalProperties.$storage = storage;

// 自定义指令
app.directive('has',{
  // 这里参数el代表的就是dom
  beforeMount: (el,binding) => {
    let userAction = storage.getItem('actionList')
    let value = binding.value
    let hasPermission = userAction.includes(value)
    if(!hasPermission){
      el.style.display = 'none'
      setTimeout(()=>{
        el.parentNode.removeChild(el)
      },0)
    }
  }
})

app.use(router)
app.use(ElementPlus, { size: 'small' })
app.use(store)
app.mount('#app')