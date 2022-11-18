import { Dimensions, PixelRatio, Platform, Alert, NativeModules } from 'react-native';
import DeviceInfo from 'react-native-device-info';
// import AsyncStorage from './storeage'
import { FontSize } from './FontSize'
import { Px2Dp } from './Px2dp.js'
// import I18n from '../language/I18n'
import instance from './request.js'
import { baseUrl, walletUrl } from './request'

import * as AsignStyles from './AsignStyles'



//当前钱包主链 decimal
global.decimal = ''
global.ethDecimal = ''
global.bscDecimal = ''

global.KTORpc = 'KTO_PRC_URL'
global.BSCRpc = 'BSC_PRC_URL'
global.ETHRpc = 'ETH_PRC_URL'


global.token = ''
global.processEnv = 'https://www.kortho.io/'
global.devWebviewUrl = ''

global.AccessTokenAgent = ''
global.AcceptDate = ''
global.Username = ''
global.naviagtion = null
global.appVersion = DeviceInfo.getVersion() // app版本
global.globalRouteParams = '' //  webview Params { url: '' }  //  { id: ' }

global.deviceID = ''

for (let i in AsignStyles) {
  global[i] = AsignStyles[i]
}



const { height, width } = Dimensions.get('window');
export default globalRequestUrl = baseUrl


global.globalImgUrl = globalRequestUrl + '/static/image/'
global.globalNodeImgUrl = walletUrl + '/static/image/'
global.iOS = (Platform.OS === 'ios');
// 系统是安卓
global.Android = (Platform.OS === 'android');
// 获取屏幕宽度
global.SCREEN_WIDTH = width;
// 获取屏幕高度
global.SCREEN_HEIGHT = height;
// 获取屏幕分辨率
global.PixelRatio = PixelRatio.get();
// 最小线宽
global.pixel = 1 / PixelRatio;
// global.HttpUtils=HttpUtils;
// global.storage = AsyncStorage
global.FONT_SIZE = FontSize;
global.px2dp = Px2Dp;
// global.I18n = I18n;
global.https = instance
global.globalCodeAddress = 'https://cn.etherscan.com/tx/'
global.globalCodeKTOAddress = 'https://www.kortho.io/blockchain-pay-detail?searchVal='
global.languageTransObj = {
  zh: '简体中文',
  en: 'English'
}
// 颜色变量
global.gColorVar = {
  theme: '#2F59FF',
  theme2: '#FF7D3B'
}
