import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  DeviceEventEmitter,
  NativeModules,
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import Ctitle from '../components/title'
import { Toast, Overlay } from 'teaset';
import Clipboard from '@react-native-community/clipboard'

let popuKey = undefined

class WalletDetailScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      walletInfo: {
        walletName: '',
        address: '',
        passwordHint: ''
      },
      walletName: '',
      pwd: ''
    }

    this.subscription = null
    this.subscription2 = null
  }

  componentDidMount() {
    this.setState({
      walletInfo: this.props.route.params.params.walletInfo
    })

    if (Platform.OS === 'android') {
      this.subscription = DeviceEventEmitter.addListener('deleteRealm', (res) => {
        let data = JSON.parse(res.mapBean)
        if (data) {
          //删除成功
          Toast.message('删除成功')
          Overlay.hide(popuKey)
          this.props.route.params.params.returnTag();
          this.props.navigation.goBack();
        } else {
          Overlay.hide(popuKey)
          Toast.message('删除失败，请重试')
        }
      });

      this.subscription2 = DeviceEventEmitter.addListener('replace', (res) => {
        let data = JSON.parse(res.mapBean)
        if (data) {
          //修改成功
          Overlay.hide(popuKey)
          this.props.route.params.params.returnTag();
          this.props.navigation.goBack();
        } else {
          Overlay.hide(popuKey)
          Toast.message('修改失败，请重试')
        }
      });
    }

  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
    if (this.subscription2) {
      this.subscription2.remove()
    }
  }

  editNameView = (
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
            编辑钱包名称
          </Text>
          <View style={{
            backgroundColor: 'rgba(247, 248, 250, 1)', borderWidth: 1, marginTop: 16,
            borderColor: 'rgba(235, 238, 245, 1)', width: 250, height: 38, borderRadius: 4
          }}>
            <TextInput style={{ flex: 1, marginLeft: 16, marginRight: 16, justifyContent: 'center' }}
              placeholder='输入钱包名称' onChangeText={(text) => this.setName({ text })}></TextInput>
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

  //设置地址
  setName = (text) => {
    if (text != '') {
      this.setState({
        walletName: text.text
      })
    }
  }

  //确定修改
  editComfire() {
    if (this.state.walletName == '') {
      Toast.message('钱包名称不能为空')
      return
    }

    let wallet = this.state.walletInfo
    wallet.walletName = this.state.walletName
    this.setState({
      walletInfo: wallet
    })
    NativeModules.ReactNativeUtils.replaceRealm(this.state.walletInfo.key, JSON.stringify(this.state.walletInfo))
  }

  //修改钱包名称
  editWalletName() {
    popuKey = Overlay.show(this.editNameView);
  }

  deleteView = (
    <Overlay.PopView
      modal={true}
      style={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <View style={{
        backgroundColor: '#fff', minWidth: 320, minHeight: 195,
        borderRadius: 20, alignItems: 'center', justifyContent: 'flex-end'
      }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 16, marginTop: 15, fontWeight: 'bold' }}>
            请输入密码
          </Text>
          <View style={{
            backgroundColor: 'rgba(247, 248, 250, 1)', borderWidth: 1, marginTop: 16,
            borderColor: 'rgba(235, 238, 245, 1)', width: 250, height: 38, borderRadius: 4
          }}>
            <TextInput style={{ flex: 1, marginLeft: 16, marginRight: 16, justifyContent: 'center' }}
              placeholder='输入钱包密码' onChangeText={(text) => this.setPwd({ text })} secureTextEntry={true}></TextInput>
          </View>

          <Text style={{ color: 'red', fontSize: 13, marginTop: 15,maxWidth:250 ,textAlign:'center'}}>
            请谨慎操作,删除之后无法恢复,请注意保存好自己的助记词和秘钥
          </Text>

        </View> 
        <View style={{ height: 0.7, backgroundColor: 'rgba(237, 237, 237, 1)', width: 320 }}></View>
        <View style={{ height: 45, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <TouchableWithoutFeedback onPress={this.popuHidden.bind(this)}>
            <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 16, flex: 1, textAlign: 'center' }}>
              取消
            </Text>
          </TouchableWithoutFeedback>
          <View style={{ backgroundColor: 'rgba(237, 237, 237, 1)', width: 1, height: 45 }}></View>
          <TouchableWithoutFeedback onPress={this.popuComfire.bind(this)}>
            <Text style={{ color: 'rgba(3, 178, 75, 1)', fontSize: 16, flex: 1, textAlign: 'center' }}>
              删除
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Overlay.PopView>
  );

  popuHidden() {
    Overlay.hide(popuKey)
  }

  //删除弹窗确认按钮
  popuComfire() { 
    console.debug(this.state.walletInfo.password)
    console.debug(this.state.pwd)
    if (this.state.walletInfo.password == this.state.pwd) { 
      NativeModules.ReactNativeUtils.deleteWallet(this.state.walletInfo.key)
    } else {
      Toast.message('密码错误，请重试')
    }
  }

  //删除钱包
  deleteWallet() {
    popuKey = Overlay.show(this.deleteView);
  }

  pwdHintView(hint) {
    return (
      <Overlay.PopView
        modal={true}
        style={{ alignItems: 'center', justifyContent: 'center' }}
      >
        <View style={{
          backgroundColor: '#fff', minWidth: 320, minHeight: 130,
          borderRadius: 20, alignItems: 'center', justifyContent: 'flex-end'
        }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 19, fontWeight: 'bold' }}>
              {hint}
            </Text>
          </View>
          <View style={{ height: 1, backgroundColor: 'rgba(237, 237, 237, 1)', width: 320 }}></View>
          <View style={{ height: 45, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback onPress={this.popuHidden.bind(this)}>
              <Text style={{ color: 'rgba(3, 178, 75, 1)', fontSize: 16, flex: 1, textAlign: 'center' }}>
                确认
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Overlay.PopView>
    )
  }

  //密码提示
  pwdHint() {
    if (this.state.walletInfo.passwordHint == '') {
      Toast.message('暂未设置密码提示')
      return
    }

    popuKey = Overlay.show(this.pwdHintView(this.state.walletInfo.passwordHint));
  }

  // 复制
  copyString(str) {
    if (!str) return
    Clipboard.setString(str)
    Toast.message('复制成功')
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
          <TouchableWithoutFeedback onPress={this.pwdComfire.bind(this)}>
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

  //确认密码
  pwdComfire() {
    console.debug(this.state.walletInfo.password)
    console.debug(this.state.pwd)
    if (this.state.walletInfo.password == this.state.pwd) {
      Overlay.hide(popuKey)

      popuKey = Overlay.show(this.privateView(this.state.walletInfo));
    } else {
      Toast.message('密码错误，请重试')
    }
  }

  //导出私钥
  onPrivate() {
    popuKey = Overlay.show(this.pwdView);
  }


  privateView = (value) => {
    return (
      <Overlay.PopView
        style={{ alignItems: 'center', justifyContent: 'center' }}
      >
        <View style={{
          backgroundColor: '#fff', minWidth: 320, minHeight: 380,
          borderRadius: 20, alignItems: 'center', justifyContent: 'center'
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>
            导出私钥
          </Text>

          <View style={{ flex: 1, marginTop: 20, alignItems: 'center' }}>
            <QRCode
              value={value.privateKey}
              size={178}
            />
          </View>

          <View style={{
            backgroundColor: 'rgba(233, 237, 245, 1)', borderRadius: 6, width: 262, height: 60,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ marginLeft: 12, marginRight: 12 }}>
              {value.privateKey}
            </Text>
          </View>

          <View style={{ height: 1, backgroundColor: 'rgba(237, 237, 237, 1)', width: 320, marginTop: 20 }}></View>
          <View style={{ height: 48, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <TouchableWithoutFeedback onPress={this.copyString.bind(this, value.privateKey)}>
              <Text style={{ color: 'rgba(3, 178, 75, 1)', fontSize: 16, flex: 1, textAlign: 'center' }}>
                复制
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Overlay.PopView>
    )
  }

  //页面跳转
  onNavPage = (item) => {
    this.props.navigation.push(item, {
      screen: item,
      params: {
        walletInfo: this.state.walletInfo,
        returnTag: (info) => {
          this.setState({
            walletInfo: info
          })
        },
      },
    });
  }

  render() {
    let { walletInfo } = this.state
    return (
      <View style={styles.container}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <Ctitle name='钱包详情'></Ctitle>
        <View style={{ backgroundColor: '#fff', flexDirection: 'column' }}>

          <TouchableWithoutFeedback onPress={this.editWalletName.bind(this)}>
            <View style={{
              height: 48, justifyContent: 'space-between', flexDirection: 'row',
              marginLeft: 16, marginRight: 16, alignItems: 'center'
            }}>
              <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                {
                  walletInfo.chainName == 'KTO' ? (
                    <Image style={{ width: 30, height: 30, borderRadius: 30 }} source={require('../assets/img/ic_kto.png')} />
                  ) : (
                    <Image style={{ width: 36, height: 36, borderRadius: 36 }} source={require('../assets/img/ic_eth.png')} />
                  )
                }
                <Text style={{ marginLeft: 12, fontSize: 17, color: 'rgba(34, 44, 65, 1)' }}>
                  {walletInfo.walletName}
                </Text>
                <Image style={{ width: 24, height: 24 }} source={require('../assets/img/ic_pen_gray.png')} />
              </View>

              <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
                  编辑钱包名称
                </Text>
                <Image style={{ width: 24, height: 24, marginLeft: -5 }} source={require('../assets/img/ic_right_gray.png')} />
              </View>
            </View>
          </TouchableWithoutFeedback>

          <View style={{ backgroundColor: 'rgba(235, 235, 240, 1)', height: 1 }}></View>
          <TouchableWithoutFeedback onPress={this.copyString.bind(this, walletInfo.address)}>
            <View style={{
              height: 48, flexDirection: 'row', alignItems: 'center',
              marginLeft: 16, marginRight: 16, justifyContent: 'space-between'
            }}>
              <Text style={{ fontSize: 17, color: 'rgba(34, 44, 65, 1)' }}>
                {
                  walletInfo.chainName == 'KTO' ? (
                    'Kto0' + walletInfo.address.slice(2, 6) + '****' +
                    walletInfo.address.slice(walletInfo.address.length - 13, walletInfo.address.length)
                  ) : (
                    walletInfo.address.slice(0, 8) + '****' +
                    walletInfo.address.slice(walletInfo.address.length - 13, walletInfo.address.length)
                  )
                }
              </Text>
              <Image style={{ width: 18, height: 18 }} source={require('../assets/img/ic_copy_black.png')} />
            </View>
          </TouchableWithoutFeedback>
          <View style={{ backgroundColor: 'rgba(235, 235, 240, 1)', height: 1 }}></View>

          <TouchableWithoutFeedback onPress={this.onPrivate.bind(this)}>
            <View style={{
              height: 48, flexDirection: 'row', alignItems: 'center',
              marginLeft: 16, marginRight: 16, justifyContent: 'space-between'
            }}>
              <Text style={{ fontSize: 17, color: 'rgba(34, 44, 65, 1)' }}>
                导出私钥
              </Text>
              <Image style={{ width: 24, height: 24, marginLeft: 5 }} source={require('../assets/img/ic_right_gray.png')} />
            </View>
          </TouchableWithoutFeedback>

          <View style={{ backgroundColor: 'rgba(235, 235, 240, 1)', height: 1 }}></View>

          <TouchableWithoutFeedback onPress={this.pwdHint.bind(this)}>
            <View style={{
              height: 48, flexDirection: 'row', alignItems: 'center',
              marginLeft: 16, marginRight: 16, justifyContent: 'space-between'
            }}>
              <Text style={{ fontSize: 17, color: 'rgba(34, 44, 65, 1)' }}>
                密码提示
              </Text>
              <Image style={{ width: 24, height: 24, marginLeft: 5 }} source={require('../assets/img/ic_right_gray.png')} />
            </View>
          </TouchableWithoutFeedback>

          <View style={{ backgroundColor: 'rgba(235, 235, 240, 1)', height: 1 }}></View>

          <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, 'ReplacePassword')}>
            <View style={{
              height: 48, flexDirection: 'row', alignItems: 'center',
              marginLeft: 16, marginRight: 16, justifyContent: 'space-between'
            }}>
              <Text style={{ fontSize: 17, color: 'rgba(34, 44, 65, 1)' }}>
                重置密码
              </Text>
              <Image style={{ width: 24, height: 24, marginLeft: 5 }} source={require('../assets/img/ic_right_gray.png')} />
            </View>
          </TouchableWithoutFeedback>
          <View style={{ backgroundColor: 'rgba(235, 235, 240, 1)', height: 1 }}></View>
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>

          <TouchableOpacity onPress={this.deleteWallet.bind(this)}
            style={{
              height: 48, width: 343, backgroundColor: '#fff',
              marginBottom: 60, borderRadius: 4, alignItems: 'center', justifyContent: 'center'
            }}>
            <Text style={{ fontSize: 17, color: 'rgba(255, 43, 90, 1)' }}>
              删除钱包
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(247, 248, 250, 1)'
  },

})

export default WalletDetailScreen;
