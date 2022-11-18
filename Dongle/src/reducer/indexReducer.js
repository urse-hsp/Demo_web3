import * as Types from '../constants'


// 设置钱包信息
let initCreatWalletInfo = {
  identityName: '',//身份名称
  walletPw: '', //钱包密码 
  pwMind: '',//密码提示
  wordAid: '',//助记词
}

export const creatWalletInfo = (state = initCreatWalletInfo, action) => {
  switch (action.type) {
    case Types.SAVE_CREAT_WALLET_INFO:
      return action.payload;
    default:
      return state;
  }
}


// 设置webview url
export const webviewUrl = (state = '', action) => {
  switch (action.type) {
    case Types.SAVE_WEBVIEW_URL:
      return action.payload;
    default:
      return state;
  }
}
