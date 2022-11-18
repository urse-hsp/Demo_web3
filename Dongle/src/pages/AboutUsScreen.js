import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  DeviceEventEmitter,
  NativeModules,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  Linking,
  FlatList
} from 'react-native'
import { WebView } from 'react-native-webview';
import Ctitle from '../components/title'
import Clipboard from '@react-native-community/clipboard'
import { Toast, Overlay } from 'teaset';
import DeviceInfo from 'react-native-device-info'

let popuKey = undefined

class AboutUsScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      twitter: 'https://twitter.com/Dongle_wallet',
      telegram: 'https://t.me/+JjAiZMrblog0ZmRltelegrame',
      email: 'DongleWallet@gmail.com',
      webUrl: ''
    }

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  deleteView = (
    <Overlay.PullView
      modal={true}
      side='bottom'
      style={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <View style={{
        backgroundColor: '#fff', width: Dimensions.get('window').width, height: 500,
        alignItems: 'center', justifyContent: 'flex-end', borderRadius: 16
      }}>
        <View style={{
          height: 56, display: 'flex', flexDirection: 'row', width: Dimensions.get('window').width,
          justifyContent: 'space-between', alignItems: 'center', borderRadius: 16
        }}>
          <View style={{ width: 16, height: 16, marginLeft: 16 }}></View>
          <Text style={{ fontSize: 18, color: '#222C41' }}>
            用户协议
          </Text>
          <TouchableWithoutFeedback onPress={this.popuHidden.bind(this)}>
            <View style={{ marginRight: 16 }}>
              <Image style={{ width: 16, height: 16, }} source={require('../assets/img/ic_close_16px.png')}></Image>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{ width: Dimensions.get('window').width, height: 430, flex: 1 }}>
          <WebView source={{ uri: 'https://www.kortho.io/dongle/agreement.html', flex: 1 }} />
        </View>
      </View>
    </Overlay.PullView>
  );

  popuHidden() {
    Overlay.hide(popuKey)
  }


  //页面跳转
  onNavPage = () => {
    popuKey = Overlay.show(this.deleteView);
  }

  //打开网页
  onOpenUrl = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.warn('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred'));
  }


  // 复制
  copyString(str) {
    if (!str) return
    Clipboard.setString(str)
    Toast.message('邮箱复制成功')
  }

  render() {
    let { twitter, telegram, email } = this.state

    return (
      <View style={styles.container}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <Ctitle name=''></Ctitle>

        <View style={{ marginTop: 43, alignItems: 'center', justifyContent: 'center' }}>
          <Image style={{ width: 80, height: 80, borderRadius: 10 }} source={require('../assets/img/ic_logo.png')}></Image>
          <Text style={{ fontWeight: 'bold', fontSize: 26, marginTop: 20, color: '#000' }}>
            Dongle
          </Text>
          <Text style={{ fontSize: 16, marginTop: 2, color: '#333' }}>
            Version {DeviceInfo.getVersion()}
          </Text>
        </View>

        <View style={{
          marginTop: 25, marginLeft: 20, marginRight: 20
        }}>
          <TouchableWithoutFeedback onPress={this.onNavPage.bind(this)}>
            <View style={{ height: 60, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={{ fontSize: 18 }}>
                用户协议
              </Text>
              <Image style={{ width: 24, height: 24 }} source={require('../assets/img/ic_right_gray.png')} />
            </View>
          </TouchableWithoutFeedback>
          <View style={{ backgroundColor: 'rgba(235, 237, 240, 1)', height: 1 }}></View>
          <View style={{ height: 60, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text style={{ fontSize: 18 }}>
              官方网站
            </Text>
            <Image style={{ width: 24, height: 24 }} source={require('../assets/img/ic_right_gray.png')} />
          </View>
          <View style={{ backgroundColor: 'rgba(235, 237, 240, 1)', height: 1 }}></View>
          <TouchableWithoutFeedback onPress={this.onOpenUrl.bind(this, twitter)}>
            <View style={{ height: 60, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={{ fontSize: 18 }}>
                Twitter
              </Text>
              <Image style={{ width: 24, height: 24 }} source={require('../assets/img/ic_right_gray.png')} />
            </View>
          </TouchableWithoutFeedback>
          <View style={{ backgroundColor: 'rgba(235, 237, 240, 1)', height: 1 }}></View>

          <TouchableWithoutFeedback onPress={this.onOpenUrl.bind(this, telegram)}>
            <View style={{ height: 60, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={{ fontSize: 18 }}>
                Telegram
              </Text>
              <Image style={{ width: 24, height: 24 }} source={require('../assets/img/ic_right_gray.png')} />
            </View>
          </TouchableWithoutFeedback>
          <View style={{ backgroundColor: 'rgba(235, 237, 240, 1)', height: 1 }}></View>

          <TouchableWithoutFeedback onPress={this.copyString.bind(this, email)}>
            <View style={{ height: 60, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={{ fontSize: 18 }}>
                联系我们
              </Text>
              <Image style={{ width: 24, height: 24 }} source={require('../assets/img/ic_right_gray.png')} />
            </View>
          </TouchableWithoutFeedback>
          <View style={{ backgroundColor: 'rgba(235, 237, 240, 1)', height: 1 }}></View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

})

export default AboutUsScreen;
