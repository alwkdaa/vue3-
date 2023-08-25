import axios from 'axios'
import config from '../config'
import { ElMessage } from 'element-plus'
import router from '../router'

const TOKEN_ERROR = 'Token认证失败，请重新登录'
const NETWORK_ERROR = '网络请求一场，请稍后重试...'
// 创建axios的实例对象  添加配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000//访问接口一般都有一个超时时间
})

// 请求的拦截器 req就是request请求的参数
service.interceptors.request.use((req) => {
  // 一些公共的请求机制
  const header = req.headers

  if(!header.Authorization) header.Authorization = 'Jason'
  return req
})

// 响应的拦截器 res就是response响应的参数
service.interceptors.response.use((res) => {
  // 一些公共的响应机制  对返回的数据进行处理
  const { code,data, msg} = res.data
  // 对返回的状态码code进行判断
  if( code === 200 ){
    return data
  }else if(code === 40001){//在这里40001是token认证失败的状态码，后端定义的，所做的就是token认证失败的处理 一般在本文件的开头定义token失败的提示语TOKEN_ERROR，在这里给一个失败的提示
    ElMessage.error(TOKEN_ERROR)
    // 然后给一个定时器，返回登录页
    setTimeout(() => {
      router.push('/login')
    },1500)
    // 然后返回请求错误
    return Promise.reject(TOKEN_ERROR)
  }else{
    // 如果不是200也不是40001，有可能是一些服务器错误，与token认证失败一样，在本文件开头定义服务器失败的提示语NETWORK_ERROR
    ElMessage.error(NETWORK_ERROR)
    return Promise.reject(NETWORK_ERROR)
  }
})

// 核心的requst的函数  也就是请求的函数 传入一个options参数
function request (options) {
  //先获取到options的方法，如果没有就默认get方法
  options.method = options.method || 'get'
  // 如果方法是get方法，做一个统一，统一属性是data传入options的params
  // 有可能传入的方法get是大写，所以这里使用toLowerCase转为小写
  if(options.method.toLowerCase() === 'get'){
    options.params = options.data
  }

  //在开发环境下的数据都是mock模拟的数据，要在生产环境下使用的都是线上环境的baseApi，所以在这里判断一下如果当前环境是生产环境，就将地址换为baseURL
  if(config.env === 'prod'){
    service.defaults.baseURL = config.baseApi
  }else{
    // 如果不是生产环境，就是用mock模拟数据，先判断mock是否开启，只有开启了才使用
    service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
  }
  return service(options)
}

['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      url,
      data,
      method: item,
      ...options
    })
  }
})

// 导出
export default request