// import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { ToastAndroid, NativeModules, Platform } from 'react-native'

export function ToastCus (msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  } else {
    NativeModules.ReactNativeUtils.ToastIos(msg)
  }
  
}

// 设置本地语言
// export function setLocalLanguage (language) {
//   AsyncStorage.setItem('I18NLanage', language)
//   global.I18n.locale = language
// }

// 设置用户信息
// export function setUserInfo (data) {
//   global.AccessTokenAgent = data.token
//   global.AcceptDate = data.data
//   global.Username = data.Username
//   setStore('AccessTokenAgent', data.token)
//   setStore('AcceptDate', data.data.toString())
//   setStore('Username', data.Username)
// }

// // 获取用户信息
// export async function getUserInfo () {
//   const AccessTokenAgent = await getStore('AccessTokenAgent')
//   const AcceptDate = await getStore('AcceptDate')
//   var data = 1
//   if (AccessTokenAgent && AcceptDate) {
//     data = {
//       AccessTokenAgent,
//       AcceptDate
//     }
//   }
//   return data
// }

// 删除用户信息
// export function removeUserInfo (data) {
//   global.AccessTokenAgent = ''
//   global.AcceptDate = ''
//   global.Username = ''
//   removeStore('AccessTokenAgent')
//   removeStore('AcceptDate')
//   removeStore('Username')
// }

// 倒计时 ，返回 时分秒
export function timeDown (start, end) {
  var times = end - start;
  var days = Math.floor(times / 60 / 60 / 24)
  var hours = Math.floor((times - days * 60 * 60 * 24) / 60 / 60)
  var minutes = Math.floor((times - days * 60 * 60 *24 - hours * 60 * 60) / 60)
  var seconds = times - hours * 60 * 60 - minutes * 60 - days * 60 *60 * 24
  if (days < 10) {
    days = '0' + days
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return { days, hours, minutes, seconds }
}

export function timeDownByLastTime (lastTime) {
  var hours = Math.floor(lastTime / 60 / 60)
  var minutes = Math.floor((lastTime - hours * 60 * 60) / 60)
  var seconds = lastTime - hours * 60 * 60 - minutes * 60
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return { hours, minutes, seconds }
}

// 时间格式处理
export function dateFormat (num, format) {
  if (!num) {
    return dateFormat(new Date().getTime(), format || 'yyyy.mm.dd')
  }
  if (typeof num === 'string') {
    return num
  }
  var Object = new Date(num * 1000 / 1000)
  var Year = String(Object.getFullYear())
  var Month = String(Object.getMonth() + 1)
  if (Month.length < 2) Month = '0' + Month
  var Day = String(Object.getDate())
  if (Day.length < 2) Day = '0' + Day
  if (format === 'yyyy.mm.dd' || !format) {
    return (Year + '.' + Month + '.' + Day)
  }
  var Hour = String(Object.getHours())
  if (Hour.length < 2) Hour = '0' + Hour
  var Minute = String(Object.getMinutes())
  if (Minute.length < 2) Minute = '0' + Minute
  if (format === 'yyyy.mm.dd hh:mm') {
    return (Year + '.' + Month + '.' + Day + ' ' + Hour + ':' + Minute)
  }
  if (format === 'mm月dd hh:mm') {
    return (Month + '月' + Day + ' ' + Hour + ':' + Minute)
  }
  var Second = String(Object.getSeconds())
  if (Second.length < 2) Second = '0' + Second
  if (format === 'yyyy-mm-dd hh:mm:ss') {
    return (Year + '-' + Month + '-' + Day + ' ' + Hour + ':' + Minute + ':' + Second)
  }
  if (format === 'yyyy年mm月dd日') {
    return (Year + '年' + Month + '月' + Day + '日')
  }
  if (format === 'yyyy-mm-dd') {
    return (Year + '-' + Month + '-' + Day)
  }
  return (Year + '.' + Month + '.' + Day + ' ' + Hour + ':' + Minute + ':' + Second)
  // if (format === 'yyyy.mm.dd') {
  //   return (Year + '.' + Month + '.' + Day)
  // } else if (format === 'yyyy.mm.dd hh:mm') {
  //   return (Year + '.' + Month + '.' + Day + ' ' + Hour + ':' + Minute + ':' + Second)
  // }
}

// 计算倒计时时间
export function couputedTimeDown (num) {
  num = parseInt(num);
  let min = Math.floor(num / 60)
  let secoed = num - min * 60
  min = min < 10 ? '0' + min : min.toString()
  secoed = secoed < 10 ? '0' + secoed : secoed.toString()
  return {
    min,
    secoed
  }
}

// 时间转化
export function dateFormatDate (num) {
  num = parseInt(num);
  var obj = new Date((num) * 1000);
  var Month = String(obj.getMonth() + 1);
  if (Month.length < 2) Month = "0" + Month;
  var Day = String(obj.getDate());
  if (Day.length < 2) Day = "0" + Day;
  return Month + '/' + Day
}

export function isEmpty(str) {
  return str === null || str === '' || str === undefined;
}

export function clearNoNum(value) {
  value = value.replace(/[^\d.]/g, "");
  // 保证只有出现一个.而没有多个.
  value = value.replace(/\.{2,}/g, ".");
  // 必须保证第一个为数字而不是.
  value = value.replace(/^\./g, "");
  // 保证.只出现一次，而不能出现两次以上
  value = value
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".");
  // 只能输入两个小数
  value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
  return value;
}

// 只允许数字
export function onlyNumber (val) {
  return val.replace(/[^\d]/g, "");
}

// 深拷贝
export function deepClone(obj) {
  //判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
  var objClone = Array.isArray(obj) ? [] : {};
  //进行深拷贝的不能为空，并且是对象或者是
  if (obj && typeof obj === "object") {
    let keys
    for (keys in obj) {
      if (obj.hasOwnProperty(keys)) {
        if (obj[keys] && typeof obj[keys] === "object") {
          objClone[keys] = deepClone(obj[keys]);
        } else {
          objClone[keys] = obj[keys];
        }
      }
    }
  }
  return objClone;
}

// 递归数据 把Int 转 String
export function recursionIntToString (obj) {
  var objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === "object") {
    let keys
    for (keys in obj) {
      if (obj.hasOwnProperty(keys)) {
        if (obj[keys] && typeof obj[keys] === "object") {
          objClone[keys] = recursionIntToString(obj[keys]);
        } else {
          objClone[keys] = typeof obj[keys] === 'number' ? obj[keys].toString() : obj[keys]
        }
      }
    }
  }
  return objClone
}

// 解决小数点后2为加减 进度不准
export function floatComputed (num1, num2, type) {
  num1 = parseInt((num1 * 100).toFixed(0))
  num2 = parseInt((num2 * 100).toFixed(0))
  let computed = 0
  if (type === '+') {
    computed = (num1 + num2) / 100
  } else if (type === '-') {
    computed = (num1 - num2) / 100
  } else if (type === '*') {
    computed = (num1 * num2) / 10000
  } else if (type === '/') {
    computed = (num1 / num2)
  }
  return computed
}

// 节流
export function throttle(func, delay) {       
  var prev = Date.now()
  return function() {                
    var context = this
    // event.persist && event.persist()
    var args = arguments
    var now = Date.now()
    if (now - prev >= delay) {
      func.apply(context, args)
      prev = Date.now()
    }            
  }        
}
