import * as Types from '../constants'
 

// 设置钱包信息
export function saveCreatWalletInfo (data) { 
  return {
    type: Types.SAVE_CREAT_WALLET_INFO,
    payload: data
  }
}
 

// 设置webview 路径
export function saveWebviewUrl(url) {
  return {
    type: Types.SAVE_WEBVIEW_URL,
    payload: url
  }
}
 