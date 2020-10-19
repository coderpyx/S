import { request } from './request'
//获取用户数据列表
export function getUserList(params) {
  return request({
    url:'/users',
    params,
  })
}
// 根据用户id获取用户信息
export function getUserinfo(userid) {
  return request({
    url:`/users/${userid}`,

  })
}
//修改用户状态
export function userChange(userinfo) {
  return request({
    method:"put",
    url:`/users/${userinfo.id}/state/${userinfo.mg_state}`,
  })
}

// 编辑用户信息
export function editUser(id,params) {
  return request({
    method:"put",
    url:`/users/${id}`,
    data:params,
  })
}
// 添加用户
export function addUsers(params) {
  return request({
    method:"POST",
    url:'/users',
    data:params
  })
}
// 根据id删除用户信息
export function delUserInfo(id) {
  return request({
    method:"delete",
    url:`/users/${id}`,
  })
}

//分配角色
export function assigningRoles(rid,id) {
  return request({
    method:"put",
    url:`users/${id}/role`,
    data:rid
  })
}


