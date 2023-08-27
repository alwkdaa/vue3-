// 先引入封装的axios请求的方法 request
import request from "../utils/request"
export default{
  // 封装登录的接口
  login(params){
    return request({
      url:'/users/login',
      method:'post',
      data: params,//这里的params要从页面点击按钮将表单的数据传递进来
      mock: false
    })
  },
  // 待审批事项的接口
  noticeCount(){
    return request({
      url:'/leave/count',
      method:'get',
      data: {},
      mock: true
    })
  },
  // 菜单接口
  menuList(){
    return request({
      url:'/menu/list',
      method:'get',
      data: {},
      mock: true
    })
  },
  //获取用户列表接口
  userList(params){ 
    return request({
      url:'/users/list',
      method:'get',
      data: params,
      mock: true
    })
  } 
}