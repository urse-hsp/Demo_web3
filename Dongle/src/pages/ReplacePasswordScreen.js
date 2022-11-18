import React from 'react';
import {
  View,
  NativeModules,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView, 
  DeviceEventEmitter,
} from 'react-native'
import { Toast } from 'teaset';
import Ctitle from '../components/title'

class ReplacePasswordScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      walletInfo: {
        passwordHint: ''
      },
      mnemonic: '',
      password: '',
      rePassword: '',
      passwordHint: '',
    }

    this.subscription = null
  }

  componentDidMount() {
    this.setState({
      walletInfo: this.props.route.params.params.walletInfo,
      passwordHint: this.props.route.params.params.walletInfo.passwordHint
    })

    if (Platform.OS === 'android') {
      this.subscription = DeviceEventEmitter.addListener('replace', (res) => {
        let data = JSON.parse(res.mapBean)
        if (data) {

          let wallet = this.state.walletInfo
          wallet.password = this.state.password
          wallet.passwordHint = this.state.passwordHint

          this.props.route.params.params.returnTag(wallet);
          this.props.navigation.goBack();
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
  }

  //设置助记词
  setMnemonic = (text) => {
    if (text != '')
      this.setState({
        mnemonic: text.text
      })
  }

  //设置密码
  setPassword = (text) => {
    if (text != '')
      this.setState({
        password: text.text
      })
  }

  setRePassword = (text) => {
    if (text != '')
      this.setState({
        rePassword: text.text
      })
  }

  //设置密码提示
  setPasswordHint = (text) => {
    if (text != '')
      this.setState({
        passwordHint: text.text
      })
  }

  //页面跳转
  onNavPage = (item) => {
    if (this.state.mnemonic == '') {
      Toast.message('请输入助记词')
      return
    }

    if (this.state.password == '') {
      Toast.message('请输入密码')
      return
    }

    if (this.state.password.length < 8) {
      Toast.message('密码长度不能少于8位')
      return
    }

    if (this.state.rePassword == '') {
      Toast.message('请再次输入密码')
      return
    }

    if (this.state.password != this.state.rePassword) {
      Toast.message('两次密码输入不一致，请检查')
      return
    }

    if (this.state.mnemonic != this.state.walletInfo.mnemonic) {
      Toast.message('助记词错误，请重新输入')
      return
    }

    let wallet = this.state.walletInfo
    wallet.password = this.state.password
    wallet.passwordHint = this.state.passwordHint

    NativeModules.ReactNativeUtils.replaceRealm(this.state.walletInfo.key, JSON.stringify(wallet))
  }

  render() {
    let { walletInfo, passwordHint } = this.state
    return (
      <View style={styles.container}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <Ctitle name='重置密码'></Ctitle>
        <ScrollView style={{ flex: 1 }}>

          <Text style={{ marginLeft: 16, marginRight: 16, marginTop: 20, color: 'rgba(34, 44, 65, 1)', fontSize: 14 }}>
            输入助记词至输入框, 请留意字符大小写及空格
          </Text>
          <View style={{
            height: 83, borderWidth: 1, borderColor: '#EBEEF5', borderRadius: 4, backgroundColor: '#F7F8FA',
            marginLeft: 16, marginTop: 6, marginRight: 16,
          }}>
            <TextInput placeholder='助记词, 用空格分隔' clearButtonMode='while-editing' multiline={true}
              textAlignVertical="top" onChangeText={(text) => this.setMnemonic({ text })}
              style={{
                fontSize: 14, paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, color: '#B7BFCC',
              }} />
          </View>

          <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, marginTop: 20, marginBottom: 4, marginLeft: 16 }}>
            设置钱包密码
          </Text>
          <View style={{
            height: 48, marginLeft: 16, marginRight: 16, marginTop: 6, borderWidth: 1,
            borderRadius: 4, backgroundColor: 'rgba(247, 248, 250, 1)', borderColor: 'rgba(235, 238, 245, 1)'
          }}>
            <TextInput placeholder='输入密码' secureTextEntry={true} maxLength={18} onChangeText={(text) => this.setPassword({ text })}
              style={{ marginLeft: 16, marginRight: 16, fontSize: 14, flex: 1, }} />
          </View>
          <View style={{
            height: 48, marginLeft: 16, marginRight: 16, marginTop: 12, borderWidth: 1,
            borderRadius: 4, backgroundColor: 'rgba(247, 248, 250, 1)', borderColor: 'rgba(235, 238, 245, 1)'
          }}>
            <TextInput placeholder='再次输入密码' secureTextEntry={true} maxLength={18} onChangeText={(text) => this.setRePassword({ text })}
              style={{ marginLeft: 16, marginRight: 16, fontSize: 14, flex: 1, }} />
          </View>

          <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, marginTop: 20, marginBottom: 4, marginLeft: 16 }}>
            密码提示（可选）
          </Text>
          <View style={{
            height: 48, marginLeft: 16, marginRight: 16, marginTop: 6, borderWidth: 1,
            borderRadius: 4, backgroundColor: 'rgba(247, 248, 250, 1)', borderColor: 'rgba(235, 238, 245, 1)'
          }}>
            <TextInput placeholder='输入密码提示' maxLength={18} onChangeText={(text) => this.setPasswordHint({ text })}
              style={{ marginLeft: 15, fontSize: 14, flex: 1, }} value={passwordHint} />
          </View>

          <View style={{ marginTop: 170, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'column' }}>
            <TouchableOpacity onPress={this.onNavPage.bind(this, 'Tab')}
              style={{
                height: 48, width: 343, backgroundColor: 'rgba(3, 178, 75, 1)',
                marginBottom: 60, borderRadius: 4, alignItems: 'center', justifyContent: 'center'
              }}>
              <Text style={{ fontSize: 17, color: '#fff' }}>
                确认
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },

})

export default ReplacePasswordScreen;
