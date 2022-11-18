import React from 'react';
import {
  View,
  NativeModules,
  Text, StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native'
import Ctitle from '../components/title'
import { Toast } from 'teaset';

import { connect } from 'react-redux'
import { saveCreatWalletInfo } from '../actions'


@connect(({ creatWalletInfo }) => ({ creatWalletInfo }), dispatch => ({
  saveCreatWalletInfo(data) {
    dispatch(saveCreatWalletInfo(data))
  }
}))
class CreatWalletScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      walletName: '',
      password: '',
      rePassword: '',
      passwordHint: ''
    }
  }

  componentDidMount() {
    console.debug(this.props.route.params.params.name)
  }

  //页面跳转
  onNavPage = (item) => {
    if (this.state.walletName == '') {
      Toast.message('请输入身份名称')
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

    this.props.saveCreatWalletInfo({
      walletNet: this.props.route.params.params.name,
      identityName: this.state.walletName,
      walletPw: this.state.password,
      pwMind: this.state.passwordHint
    })

    console.debug(this.props.creatWalletInfo)

    this.props.navigation.push(item);
  }

  //设置名称
  setNameState = (text) => {
    if (text != '')
      this.setState({
        walletName: text.text
      })
  }

  //设置密码
  setPassword = (text) => {
    if (text != '')
      this.setState({
        password: text.text
      })
  }

  //第二次密码
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

  render() {
    let { } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <Ctitle name='创建钱包'></Ctitle>
        <ScrollView style={{ flex: 1 }}>

          <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14, marginTop: 12, marginBottom: 4, marginLeft: 16 }}>
            创建之后，您将会拥有{this.props.route.params.params.name == 'all' ? '身份' : this.props.route.params.params.name}钱包
          </Text>
          <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, marginTop: 12, marginBottom: 4, marginLeft: 16 }}>
            身份名
          </Text>
          <View style={{
            height: 48, marginLeft: 16, marginRight: 16, marginTop: 6, borderWidth: 1,
            borderRadius: 4, backgroundColor: 'rgba(247, 248, 250, 1)', borderColor: 'rgba(235, 238, 245, 1)'
          }}>
            <TextInput placeholder='输入身份名称' maxLength={18} onChangeText={(text) => this.setNameState({ text })}
              style={{ marginLeft: 16, marginRight: 16, fontSize: 14, flex: 1, }} />
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
              style={{ marginLeft: 15, fontSize: 14, flex: 1, }} />
          </View>

          <View style={{ marginTop: 170, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'column' }}>
            <TouchableOpacity onPress={this.onNavPage.bind(this, 'RemarkWordAid')}
              style={{
                height: 48, width: 343, backgroundColor: 'rgba(3, 178, 75, 1)',
                marginBottom: 60, borderRadius: 4, alignItems: 'center', justifyContent: 'center'
              }}>
              <Text style={{ fontSize: 17, color: '#fff' }}>
                创建钱包
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
    flex: 1,
    backgroundColor: '#fff'
  },

})

export default CreatWalletScreen;
