import React from 'react';
import {
  View, TouchableWithoutFeedback,
  Text, StyleSheet,
  StatusBar,
  Image,
  TextInput,
  Dimensions,
  DeviceEventEmitter,
  NativeModules
} from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import QRCode from 'react-native-qrcode-svg'
import { Toast, Overlay } from 'teaset';

import * as Types from '../constants'
import storage from '../utils/storageUtil'

let popuKey = undefined

class MyScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabListOne: [
        {
          icon: require('../assets/img/' + 'ic_my_1' + '.png'),
          name: '资产总览',
          page: 'WalletList'
        },
        {
          icon: require('../assets/img/' + 'ic_my_3' + '.png'),
          name: '地址本',
          page: 'AddressList'
        },
        {
          icon: require('../assets/img/' + 'ic_my_4' + '.png'),
          name: '导出助记词',
          page: 'showPwd'
        },
      ],
      tabListTWo: [
        // {
        //   icon: require('../assets/img/' + 'ic_my_5' + '.png'),
        //   name: '通用设置',
        //   page: ''
        // }, 
        {
          icon: require('../assets/img/' + 'ic_my_5' + '.png'),
          name: '选择节点',
          page: 'selectNode'
        },
        {
          icon: require('../assets/img/' + 'ic_invite' + '.png'),
          name: '邀请好友',
          page: 'inviteScreen'
        },
        {
          icon: require('../assets/img/' + 'ic_my_7' + '.png'),
          name: '关于我们',
          page: 'AboutUs'
        },
      ],
      walletInfo: {
        mnemonic: ''
      }, 
      pwd: ''
    }

    this.subscription = null
    this.subscription1 = null
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      this.subscription1 = DeviceEventEmitter.addListener('findSuccess', (res) => {
        let data = JSON.parse(res.mapBean)
        for (const item of data) {
          if (item.choose) {
            if (item.chainName == 'KTO') {
              item.address = 'Kto0' + item.address.slice(2)
            }
            this.setState({
              walletInfo: item
            }) 
          }
        }
      })

      this.subscription = DeviceEventEmitter.addListener('findMy', (res) => {
        let data = JSON.parse(res.mapBean)
        for (const item of data) {
          if (item.choose) {
            if (item.chainName == 'KTO') {
              item.address = 'Kto0' + item.address.slice(2)
            }

            let list = []
            if (item.mnemonic) {
              list = [{
                icon: require('../assets/img/' + 'ic_my_1' + '.png'),
                name: '资产总览',
                page: 'WalletList'
              },
              {
                icon: require('../assets/img/' + 'ic_my_3' + '.png'),
                name: '地址本',
                page: 'AddressList'
              },
              {
                icon: require('../assets/img/' + 'ic_my_4' + '.png'),
                name: '导出助记词',
                page: 'showPwd'
              },]
            } else {
              list = [{
                icon: require('../assets/img/' + 'ic_my_1' + '.png'),
                name: '资产总览',
                page: 'WalletList'
              },
              {
                icon: require('../assets/img/' + 'ic_my_3' + '.png'),
                name: '地址本',
                page: 'AddressList'
              },
              ]
            }
            this.setState({
              walletInfo: item,
              tabListOne: list
            })
          }
        }
      });
    }

    NativeModules.ReactNativeUtils.findRealm('ALL', 'findMy') 
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }

    if (this.subscription1) {
      this.subscription1.remove()
    }
  }

  //页面跳转
  onNavPage = (item) => {
    if (item == 'AddressList' || item == 'AboutUs' || item == 'selectNode') {
      this.props.navigation.push(item, {
        screen: item,
        params: {
          walletInfo: this.state.walletInfo,
          type: true
        },
      });
      return
    } else if (item == 'showPwd') {
      popuKey = Overlay.show(this.pwdView);
      return
    }

    this.props.navigation.push(item);
  }

  pwdView = (
    <Overlay.PopView
      modal={true}
      style={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <View style={{
        backgroundColor: '#fff', minWidth: 320, minHeight: 174,
        borderRadius: 20, alignItems: 'center', justifyContent: 'flex-end'
      }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 16, marginTop: 24, fontWeight: 'bold' }}>
            请输入密码
          </Text>
          <View style={{
            backgroundColor: 'rgba(247, 248, 250, 1)', borderWidth: 1, marginTop: 16,
            borderColor: 'rgba(235, 238, 245, 1)', width: 250, height: 38, borderRadius: 4
          }}>
            <TextInput style={{ flex: 1, marginLeft: 16, marginRight: 16, justifyContent: 'center' }}
              placeholder='输入钱包密码' onChangeText={(text) => this.setPwd({ text })} secureTextEntry={true}></TextInput>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: 'rgba(237, 237, 237, 1)', width: 320 }}></View>
        <View style={{ height: 48, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <TouchableWithoutFeedback onPress={this.popuHidden.bind(this)}>
            <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 16, flex: 1, textAlign: 'center' }}>
              取消
            </Text>
          </TouchableWithoutFeedback>
          <View style={{ backgroundColor: 'rgba(237, 237, 237, 1)', width: 1, height: 45 }}></View>
          <TouchableWithoutFeedback onPress={this.editComfire.bind(this)}>
            <Text style={{ color: 'rgba(3, 178, 75, 1)', fontSize: 16, flex: 1, textAlign: 'center' }}>
              确认
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Overlay.PopView>
  );

  setPwd = (text) => {
    if (text != '') {
      this.setState({
        pwd: text.text
      })
    }
  }

  popuHidden() {
    Overlay.hide(popuKey)
  }

  //确认密码
  editComfire() {
    console.debug(this.state.walletInfo.password)
    console.debug(this.state.pwd)
    if (this.state.walletInfo.password == this.state.pwd) {
      Overlay.hide(popuKey)

      popuKey = Overlay.show(this.mnemonicView(this.state.walletInfo));
    } else {
      Toast.message('密码错误，请重试')
    }
  }

  mnemonicView = (value) => {
    return (
      <Overlay.PopView
        style={{ alignItems: 'center', justifyContent: 'center' }}
      >
        <View style={{
          backgroundColor: '#fff', minWidth: 320, minHeight: 380,
          borderRadius: 20, alignItems: 'center', justifyContent: 'center'
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>
            导出助记词
          </Text>

          <View style={{ flex: 1, marginTop: 20, alignItems: 'center' }}>
            <QRCode
              value={value.mnemonic}
              size={178}
            />
          </View>

          <View style={{
            backgroundColor: 'rgba(233, 237, 245, 1)', borderRadius: 6, width: 262, height: 60,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ marginLeft: 12, marginRight: 12 }}>
              {value.mnemonic}
            </Text>
          </View>

          <View style={{ height: 1, backgroundColor: 'rgba(237, 237, 237, 1)', width: 320, marginTop: 20 }}></View>
          <View style={{ height: 48, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <TouchableWithoutFeedback onPress={this.copyString.bind(this, value.mnemonic)}>
              <Text style={{ color: 'rgba(3, 178, 75, 1)', fontSize: 16, flex: 1, textAlign: 'center' }}>
                复制
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Overlay.PopView>
    )
  }

  // 复制
  copyString(str) {
    if (!str) return
    Clipboard.setString(str)
    Toast.message('复制成功')
    Overlay.hide(popuKey)
  }


  render() {
    let { tabListOne, tabListTWo, walletInfo } = this.state
    return (
      <View style={styles.container}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <Text style={{ fontSize: 18, height: 44, color: '#1e1e1e', marginTop: 30, fontWeight: 'bold', textAlign: 'center' }}>
          我的
        </Text>

        <View>
          {
            tabListOne.map((item, index) => {
              return (
                <TouchableWithoutFeedback key={index} onPress={this.onNavPage.bind(this, item.page)}>
                  <View style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <View style={{
                      paddingLeft: 16, paddingRight: 16, height: 48,
                      display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ height: 16, width: 16, marginRight: 11 }} source={item.icon} />
                        <Text style={{ color: '#1E1E1E', fontSize: 14, fontWeight: 'bold', fontFamily: 'PingFangSC-Regular' }}>{item.name}</Text>
                      </View>
                      <Image style={{ width: 24, height: 24 }} source={require('../assets/img/ic_right_gray.png')} />
                    </View>
                    {
                      index != 3 ?
                        <View style={{ backgroundColor: '#EFEFEF', marginLeft: 15, width: 1000, height: 0.5 }} /> : null
                    }
                  </View>
                </TouchableWithoutFeedback>
              )
            })
          }

          {/* <View style={{ height: 8, backgroundColor: 'rgba(237, 240, 245, 1)' }}></View> */}

          {
            tabListTWo.map((item, index) => {
              return (
                <TouchableWithoutFeedback key={index} onPress={this.onNavPage.bind(this, item.page)}>
                  <View style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <View style={{
                      paddingLeft: 16, paddingRight: 16, height: 48,
                      display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ height: 16, width: 16, marginRight: 11 }} source={item.icon} />
                        <Text style={{ color: '#1E1E1E', fontSize: 14, fontWeight: 'bold', fontFamily: 'PingFangSC-Regular' }}>{item.name}</Text>
                      </View>
                      <Image style={{ width: 24, height: 24 }} source={require('../assets/img/ic_right_gray.png')} />
                    </View>
                    {
                      index != 1 ?
                        <View style={{ backgroundColor: '#EFEFEF', marginLeft: 15, width: 1000, height: 0.5 }} /> : null
                    }
                  </View>
                </TouchableWithoutFeedback>
              )
            })
          }
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

export default MyScreen;
