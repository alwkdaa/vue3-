import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
// 引入路由
import router from './router'
import App from './App.vue'
import axios from 'axios'
import config from './config'
import request from './utils/request'


/* axios.get(config.mockApi + '/login').then((res) => {
  console.log(res);
}) */
const app = createApp(App)

// 注册request
app.config.globalProperties.$request = request


app.use(router)
app.use(ElementPlus)
app.mount('#app')