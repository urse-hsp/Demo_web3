/**
 * axios请求二次封装
 * 设置了baseURL
 * 设置了token
 * 避免重复点击
 * 改ts
 */
import React, { Component } from 'react';
import { 
  NativeModules, 
} from 'react-native'; 
import { Toast, Overlay } from 'teaset'
import axios from "axios"; 
import { baseUrl } from './api' 

const languageObj = { // 语言
  zh: 'zh-CN',
  en: 'en-US'
}

class Http {

  constructor() {
    this.http = axios.create({
      baseURL: baseUrl,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    this.initInterceptors()
  } 

  // 初始化拦截器
  initInterceptors() {
    /**
   * 请求拦截器
   * 每次请求前，如果存在token则在请求头中携带token
   */
    this.http.interceptors.request.use(
      async config => {
        // let deviceName = ''
        // if (global.deviceName) {
        //   deviceName = global.deviceName
        // } else {
        //   let deviceNamePro = await DeviceInfo.getDeviceName()
        //   global.deviceName = Platform.OS + "-" + deviceNamePro
        //   deviceName = global.deviceName
        // }

        config.headers['Content-Type'] = 'application/json'
        // config.headers['version'] = DeviceInfo.getVersion();
        // config.headers['DeviceType'] = deviceName;
        // config.headers['shop-token'] = global.token
        // config.headers['deviceId'] = global.deviceID;
        // config.headers['code'] = 'react-native';
        // config.headers['latitude'] = '';
        // config.headers['longitude'] = '';
        // config.headers['registration'] = '';

        // console.debug(config)
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.http.interceptors.response.use(
      // 请求成功
      res => {

        if (res.status === 200) {
          if (res.data.code === 995) {
            Toast.message(res.data.msg)
            setTimeout(() => {
              NativeModules.ReactNativeUtils.exitApp()
            }, 2000)
          }
          if (res.data.errCode != 0) {

          }
          return Promise.resolve(res.data);
        }
      },
      // 请求失败
      error => {
        console.debug('请求错误', error)
        let { response } = error
        if (response) {

        } else {

        }
        return Promise.reject(error);
      }
    );
  }

  get = (url, params = {}) => {
    console.debug(url)
    console.debug(params)

    return this.http({
      method: "get",
      params: params,
      data: params,
      url: url,
      // cancelToken: this.cancelToken
    });
  };
  post = (url, data = {}) => {
    return new Promise((resolve, reject) => {
      console.debug(url)
      console.debug(data)

      this.http({
        method: "post",
        params: data, // 一般情况下用post请求 用data 传body，这里 更具后端 他是 query接参的post请求，这个改成params
        data: data,
        url: url,
        // cancelToken: this.cancelToken
      }).then(response => {
        // console.debug(response, data,'responseresponseresponseresponnse')
        // console.debug('http response', response, url, data)
        resolve(response);
      }).catch(err => {
        reject(err)
      });
    });
  };
  files = (url, data) => {
    var datas = new FormData()
    for (var key in data) {
      datas.append(key, data[key])
    }
    return new Promise((resolve, reject) => {
      this.http({
        url: url,
        method: 'post',
        data: datas,
        headers: { 'Content-Type': 'multipart/form-data' }
        // onUploadProgress: progressEvent => {
        //   var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
        //   callback && callback(complete)
        //   // this.progress = complete
        // }
      }).then(res => {
        resolve(res);
      })
    })
  };
  delete = (url, params = {}) => {
    return this.http({
      method: "delete",
      params: params,
      url: url,
      // cancelToken: this.cancelToken
    });
  };
  put = (url, data = {}) => {
    return this.http({
      method: "put",
      data: data,
      url: url,
      // cancelToken: this.cancelToken
    });
  };
}

const instance = new Http();
export default instance;
