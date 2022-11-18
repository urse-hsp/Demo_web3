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
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native'
import { Camera } from 'expo-camera';
import { Toast, Theme } from 'teaset';
import Ctitle from '../components/title'
import TabComponent from '../components/tab'

let ethers = require('ethers');

let customKey = null;

class ImportWalletScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      mnemonic: '',
      password: '',
      rePassword: '',
      passwordHint: '',

      tabActiveIndex: 0, //tab position
      tabList: [
        {
          id: 0,
          choose: true,
          title: '导入助记词'
        },
        {
          id: 1,
          choose: false,
          title: '导入私钥'
        }
      ],
      textHint: '请输入您的英文助记词，请留意字符大小写。',
      textTitle: '助记词'
    }

    this.subscription = undefined
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      this.subscription = DeviceEventEmitter.addListener('putRealm', (res) => {
        let data = JSON.parse(res.mapBean)
        console.debug(data)

        if (data) {

          this.hideCustom()

          this.props.navigation.replace('Tab');
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
    if (this.state.mnemonic == '' && this.state.tabActiveIndex == 0) {
      Toast.message('请输入助记词')
      return
    }

    //秘钥
    if (this.state.mnemonic !== '' && this.state.tabActiveIndex == 0) {
      let list = this.state.mnemonic.split(' ')
      if (list.length < 12) {
        Toast.message('助记词不能少于12个单词')
        return
      }
    }

    if (this.state.mnemonic !== '' && this.state.tabActiveIndex == 1) {
      let list = this.state.mnemonic.split(' ')
      if (list.length > 1) { 
        Toast.message('请检查当前秘钥输入是否正确')
        return
      }
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

    this.showCustom(item);
  }

  //创建钱包
  _creatWallet(item) {
    let that = this
    setTimeout(function () {
      let mnemonicWallet
      let wallet
      if (that.state.tabActiveIndex == 0) {
        let mnemonic = that.state.mnemonic
        mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic)

        wallet = {
          address: mnemonicWallet.address,
          mnemonic: mnemonicWallet.mnemonic.phrase,
          path: mnemonicWallet.mnemonic.path,
          privateKey: mnemonicWallet.privateKey,
          publicKey: mnemonicWallet.publicKey,
          chainName: that.props.route.params.params.name,
          walletName: that.props.route.params.params.name + ' - ' + Math.floor(Math.random() * 10000),
          choose: true,
          password: that.state.password,
          passwordHint: that.state.passwordHint
        }
      } else {
        let privateKey = that.state.mnemonic
        mnemonicWallet = new ethers.Wallet(privateKey)

        wallet = {
          address: mnemonicWallet.address,
          mnemonic: '',
          path: '',
          privateKey: mnemonicWallet.privateKey,
          publicKey: mnemonicWallet.publicKey,
          chainName: that.props.route.params.params.name,
          walletName: that.props.route.params.params.name + ' - ' + Math.floor(Math.random() * 10000),
          choose: true,
          password: that.state.password,
          passwordHint: that.state.passwordHint
        }
      }

      //存入数据库
      NativeModules.ReactNativeUtils.putRealm(JSON.stringify(wallet))
    }, 100)
  }

  showCustom(item) {
    customKey = Toast.show({
      text: '正在创建钱包',
      icon: <ActivityIndicator size='large' color={Theme.toastIconTintColor} />,
      position: 'center',
      duration: 2000,
    });

    this._creatWallet(item)
  }

  hideCustom() {
    if (!customKey) return;
    Toast.hide(customKey);
    customKey = null;
  }

  //tab选择
  onTabRes = (index) => {
    if (index == 0) {
      this.setState({
        tabActiveIndex: index,
        textHint: '请输入您的英文助记词，请留意字符大小写。',
        textTitle: '助记词'
      })
    } else {
      this.setState({
        tabActiveIndex: index,
        textHint: '请输入PrivateKey，请留意字符大小写。',
        textTitle: '明文私钥'
      })
    }
  }

  //扫一扫
  async onNavCamera() {
    let { status } = await Camera.requestCameraPermissionsAsync();

    if (status === 'granted') {
      this.props.navigation.push('SaoYiSao', {
        screen: 'SaoYiSao',
        params: {
          returnTag: (res) => {
            console.debug(res)
            this.setState({
              mnemonic: res
            })

          },
        },
      });
    } else {
      Toast.message('没有相机权限,无法打开相机')
    }
  }

  render() {
    let { tabActiveIndex, tabList, textHint, textTitle, mnemonic } = this.state
    return (
      <View style={styles.container}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <Ctitle saoYiSaoIcon={true} onRightFunc={this.onNavCamera.bind(this)} name='导入钱包' ></Ctitle>
        {/* TAB */}
        <View style={{ height: 45 }}>
          <TabComponent height={45} activeItem={tabActiveIndex} mode='Normal' arrData={tabList} onTabRes={this.onTabRes.bind(this)} />
        </View>
        <ScrollView style={{ flex: 1, marginTop: 20 }}>

          <Text style={{ marginLeft: 16, marginRight: 16, marginTop: 8, color: 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
            {textHint}
          </Text>
          <Text style={{ marginLeft: 16, marginRight: 16, marginTop: 20, color: 'rgba(34, 44, 65, 1)', fontSize: 14 }}>
            {textTitle}
          </Text>
          <View style={{
            height: 83, borderWidth: 1, borderColor: '#EBEEF5', borderRadius: 4, backgroundColor: '#F7F8FA',
            marginLeft: 16, marginTop: 6, marginRight: 16,
          }}>
            <TextInput placeholder={'请输入您的' + textTitle} clearButtonMode='while-editing' multiline={true}
              textAlignVertical="top" onChangeText={(text) => this.setMnemonic({ text })} defaultValue={mnemonic}
              style={{
                fontSize: 14, paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, color: '#333',
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
              style={{ marginLeft: 15, fontSize: 14, flex: 1, }} />
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

export default ImportWalletScreen;
