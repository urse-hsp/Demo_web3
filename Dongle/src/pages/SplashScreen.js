import React from 'react';
import {
  DeviceEventEmitter,
  Image,
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  BackHandler,
  ActivityIndicator,
  NativeModules,
  StatusBar
} from 'react-native'
import { Toast  } from 'teaset';

let customKey = null;

class SplashScreen extends React.Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      this.subscription = DeviceEventEmitter.addListener('realmSuccess', (res) => {
        if (this.isFirst) return
        const data = JSON.parse(res.mapBean)
        if (data.length > 0) {
          this._event2()
        } else {
          this._event1()
        }
        this.isFirst = true
      });

      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);

    }

    this.getStorage()
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }

    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  //获取权限
  async getStorage() {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, 
        PermissionsAndroid.PERMISSIONS.CAMERA
      ];

      const granteds = await PermissionsAndroid.requestMultiple(permissions);

      if (granteds["android.permission.READ_EXTERNAL_STORAGE"] === "granted"
        && granteds["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted" 
        && granteds["android.permission.CAMERA"] === "granted") {

        NativeModules.ReactNativeUtils.findRealm('all', 'realmSuccess')
      } else {
        BackHandler.exitApp();
        Toast.message('授权被拒绝, APP无法正常使用，请退出')
      }
    } catch (err) {
      Toast.message(err.toString());
    }
  };

  //无钱包
  _event1() {
    setTimeout(() => {

      this.props.navigation.replace("Welcome")

    }, 1000)
  }

  //有钱包
  _event2() {
    setTimeout(() => {

      this.props.navigation.replace("Tab")

    }, 1000)
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'#fff'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <Image style={{ width: 200, height: 200, marginTop: 168 }} source={require('../assets/img/ic_splash_logo.png')}></Image>
        <Text style={{ fontSize: 30, color: 'rgba(34, 44, 65, 1)', fontWeight: 'bold' }}>Dongle</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

})

export default SplashScreen;
