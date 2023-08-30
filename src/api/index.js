// 先引入封装的axios请求的方法 request
import request from "../utils/request"
export default {
  // 封装登录的接口
  login(params) {
    return request({
      url: '/users/login',
      method: 'post',
      data: params,//这里的params要从页面点击按钮将表单的数据传递进来
      mock: false
    })
  },
  // 待审批事项的接口
  noticeCount() {
    return request({
      url: '/leave/count',
      method: 'get',
      data: {},
      mock: true
    })
  },
  // 菜单接口
  menuList() {
    return request({
      url: '/menu/list',
      method: 'get',
      data: {},
      mock: false
    })
  },
  //获取用户列表接口
  userList(params) {
    return request({
      url: '/users/list',
      method: 'get',
      data: params,
      mock: false
    })
  },
  // 删除用户接口
  userDelete(params) {
    return request({
      url: '/users/delete',
      method: 'post',
      data: params,
      mock: false
    })
  },
  // 获取角色名称列表接口
  getRoleList() {
    return request({
      url: '/roles/allList',
      method: 'get',
      mock: true
    })
  },
  // 获取部门列表
  getDeptList() {
    return request({
      url: '/dept/list',
      method: 'get',
      mock: true
    })
  },
  // 新增编辑用户
  userSubmit(params) {
    return request({
      url: '/users/operate',
      method: 'post',
      mock: false,
      data: params
    })
  },
  // 菜单新增和编辑接口
  menuSubmit(params) {
    return request({
      url: '/menu/operate',
      method: 'post',
      mock: false,
      data: params
    })
  },
  /* 角色列表相关接口 */
  roleList() {
    return request({
      url: '/roles/list',
      method: 'get',
      mock: true,
    })
  },
  // 角色创建接口
  roleOperate(params) {
    return request({
      url: '/roles/operate',
      method: 'post',
      mock: true,
      data: params
    })
  },
  // 角色权限设置
  updatePermission(params) {
    return request({
      url: '/roles/update/permission',
      method: 'post',
      mock: true,
      data: params
    })
  }
}