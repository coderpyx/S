import { request } from './request'

//获取权限列表
export function getRightsList(type) {
  return request({
    url:`rights/${type}`,
  })
}
//获取角色列表
export function getRolesList() {
  return request({
    url:'/roles',
  })
}

// 删除角色指定权限
export function removeRight(roleId, rightId) {
  return request({
    method:"delete",
    url:`roles/${roleId}/rights/${rightId}`,
  })
}
//编辑提交角色
export function editRoles(roleId,parmas) {
  return request({
    method:"put",
    url:`roles/${roleId}`,
    data:parmas
  })
}
//删除角色
export function delRoles(roleId) {
  return request({
    method:"delete",
    url:`roles/${roleId}`,
  })
}

//添加角色
export function addRoles(parmas) {
  return request({
    method:"post",
    url:'/roles',
    data:parmas
  })
}

//角色授权
export function roleAuth(roleId,parmas) {
  return request({
    method:"post",
    url:`roles/${roleId}/rights`,
    data:parmas
  })
}


