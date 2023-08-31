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
  // 获取权限列表的接口
  permissionList(){
    return request({
      url: '/users/getPermissionList',
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
  // 获取所有用户列表
  userAllList(){
    return request({
      url: '/users/all/list',
      method: 'get',
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
      mock: false
    })
  },
  // 获取部门列表
  getDeptList(params) {
    return request({
      url: '/dept/list',
      method: 'get',
      mock: false,
      data: params
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
  roleList(params) {
    return request({
      url: '/roles/list',
      method: 'get',
      mock: false,
      data:params
    })
  },
  // 角色创建接口
  roleOperate(params) {
    return request({
      url: '/roles/operate',
      method: 'post',
      mock: false,
      data: params
    })
  },
  // 角色权限设置
  updatePermission(params) {
    return request({
      url: '/roles/update/permission',
      method: 'post',
      mock: false,
      data: params
    })
  },
  /* 部门相关接口 */
  // 部门创建编辑删除接口
  deptOperate(params){
    return request({
      url:"/dept/operate",
      method: 'post',
      mock: false,
      data: params
    })
  },
  /* 审批相关接口 */
  // 获取审批列表
  getApplyList(params){
    return request({
      url:"/leave/list",
      method: 'get',
      mock: true,
      data: params
    })
  }
}