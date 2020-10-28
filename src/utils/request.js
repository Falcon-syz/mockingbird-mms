import axios from "axios"

import { Message, Loading } from 'element-ui';

//封装一个axios实例
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // baseURL:'/api',
  timeout: 5000,
  // headers: {'X-Custom-Header': 'foobar'}
});

// request.get("/test.json").then(response=>{
//   console.log(response.data)
// })
const loadingCom = {
  loadingInstance: null,//loading实例
  open() {
    //创建实例，会打开加载窗口
    this.loadingInstance = Loading.service({
      target: ".main",
      spinner: "el-icon-loading",
      // background:"blue",
      text: "玩命加载中"
    });
  },

  //关闭加载
  close() {
    if (this.loadingInstance) {
      this.loadingInstance.close()
    }
  }
};


// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  console.log("请求拦截器")
  loadingCom.open()
  return config;
}, function (error) {
  // 对请求错误做些什么
  loadingCom.close()
  return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  loadingCom.close()
  if (response.data.code !== 2000) {
    Message({
      message: response.data.message || "系统异常",
      type: "warning",
      duration: 5 * 1000
    })
  }
  return response;
}, function (error) {
  // 对响应错误做点什么
  loadingCom.close()
  Message({
    message: error.message,
    type: "error",
    duration: 5 * 1000
  })
  return Promise.reject(error);
});


export default request
