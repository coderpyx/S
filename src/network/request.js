// 导入axios
import axios from 'axios'

export function request(config) {
  //1. 创建axios实例
  const instance = axios.create({
    baseURL:'http://127.0.0.1:8888/api/private/v1/',
    timeout:1000
  })

  // 2. axios 的拦截器
  // instance.interceptors.response.use(config => {
  //   console.log(config);
  //   return config;

  // },err => {
  //   console.log(err);
  // })
  instance.interceptors.request.use(config => {
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')
    
    return config;

  },err => {
    // console.log(err);
  })


  // 2.2响应拦截
  instance.interceptors.response.use( res => {
    return res
  },err => {
    // console.log(err);

  })
  // 3.发送真正的网络请求
  return instance(config)

}