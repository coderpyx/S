import { request } from './request'

export function getLogin(params) {
  return request({
    url:'/login',
    params
  })
}

