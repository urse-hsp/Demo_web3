import React from 'react';
import {
  View,
  NativeModules,
  Text,
  StyleSheet,
  ActivityIndicator,
  DeviceEventEmitter,
  StatusBar,
  TouchableOpacity
} from 'react-native'
import { Toast, Theme } from 'teaset';
import { connect } from 'react-redux'
import { saveCreatWalletInfo } from '../actions'
import Ctitle from '../components/title'
import ChooseWordAid from '../components/WordAid/ChooseWordAid'
import ChooseWord from '../components/WordAid/ChooseWord'

import storage from '../utils/storageUtil'
import * as Types from '../constants'

let ethers = require('ethers');

let customKey = null;

@connect(({ creatWalletInfo }) => ({ creatWalletInfo }), dispatch => ({
  setCreatWalletInfo(data) {
    dispatch(saveCreatWalletInfo(data))
  }
}))
class VerifyWordAidScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      creatWalletInfo: {},
      myMnemonic: [{ isRight: 'true' }, { isRight: 'true' }, { isRight: 'true' }, { isRight: 'true' }, { isRight: 'true' }, { isRight: 'true' }, { isRight: 'true' }, { isRight: 'true' }, { isRight: 'true' }, { isRight: 'true' }, { isRight: 'true' }, { isRight: 'true' }], //显示助记词
      rightMnemonic: [], //正确助记词
      selectMnemonic: [],//乱顺序的助记词
      remark: '',
      isEnable: true, //是否可点击选择
      isShowHint: false,//是否显示提示
    }

    this.subscription = null
  }

  componentDidMount() {
    console.debug(this.props.creatWalletInfo)

    let { creatWalletInfo } = this.props
    let selMenemonic = creatWalletInfo.wordAid.split(' ').sort()
    let list = []
    for (const item of selMenemonic) {
      list.push({ name: item, sele: false })
    }
    this.setState({
      selectMnemonic: list,
      rightMnemonic: creatWalletInfo.wordAid.split(' ')
    })


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

  //页面跳转  
  onNavPage = (item) => {
    for (const item of this.state.myMnemonic) {
      if (item.name == undefined) {
        Toast.message('助词器错误')
        return
      }
    }

    this.showCustom()
    this._creatWallet(item)
  }

  //创建钱包
  _creatWallet(item) {
    var that = this;
    setTimeout(function () {
      let mnemonic = that.props.creatWalletInfo.wordAid
      let path = "m/44'/60'/0'/0/0";
      let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, path)

      let walletInfo = {
        walletInfo: mnemonicWallet,
        createInfo: that.props.creatWalletInfo
      }

      storage.set(Types.WALLET_INFO, walletInfo)

      let wallet = {
        address: mnemonicWallet.address,
        mnemonic: mnemonicWallet.mnemonic.phrase,
        path: mnemonicWallet.mnemonic.path,
        privateKey: mnemonicWallet.privateKey,
        publicKey: mnemonicWallet.publicKey,
        chainName: that.props.creatWalletInfo.walletNet,
        walletName: that.props.creatWalletInfo.identityName,
        choose: true,
        password: that.props.creatWalletInfo.walletPw,
        passwordHint: that.props.creatWalletInfo.pwMind
      }

      console.debug(wallet)
      //存入数据库
      NativeModules.ReactNativeUtils.putRealm(JSON.stringify(wallet))
    }, 2000);


  }

  showCustom() {
    customKey = Toast.show({
      text: '正在创建钱包',
      icon: <ActivityIndicator size='large' color={Theme.toastIconTintColor} />,
      position: 'center',
      duration: 2000,
    });
  }

  hideCustom() {
    if (!customKey) return;
    Toast.hide(customKey);
    customKey = null;
  }

  //助记词选择
  ontabPress = (index) => {
    if (!this.state.isEnable) {
      return
    }

    if (this.state.rightMnemonic[0] == this.state.selectMnemonic[index].name) {
      //更新底部显示
      this.state.selectMnemonic[index].sele = true
      //移除已选择词
      this.state.rightMnemonic.shift()
      //更新显示助记词
      this.setState({
        isEnable: true
      })

      for (let x = 0; x < this.state.myMnemonic.length; x++) {
        if (this.state.myMnemonic[x].name == undefined) {
          this.state.myMnemonic[x] = { name: this.state.selectMnemonic[index].name, isRight: 'true' }
          return
        }
      }
    } else {
      //更新底部显示
      this.state.selectMnemonic[index].sele = true
      //更新显示助记词
      //禁止点击
      this.setState({
        isEnable: false,
        isShowHint: true
      })

      for (let x = 0; x < this.state.myMnemonic.length; x++) {
        if (this.state.myMnemonic[x].name == undefined) {
          this.state.myMnemonic[x] = { name: this.state.selectMnemonic[index].name, isRight: 'false' }
          return
        }
      }
    }

  }

  //助记词删除
  onWordPress = (index) => {
    //遍历恢复 
    for (let x = 0; x < this.state.selectMnemonic.length; x++) {
      if (this.state.selectMnemonic[x].name == this.state.myMnemonic[index].name) {
        this.state.selectMnemonic[x].sele = false
      }
    }

    this.state.myMnemonic[index] = { isRight: 'true' }

    this.setState({
      isEnable: true,
      isShowHint: false
    })
  }

  render() {
    let { myMnemonic, selectMnemonic } = this.state;
    let hintText = this.state.isShowHint ?
      <View style={styles.hint_Text}>
        <Text style={{ color: 'red', }}>助记词顺序错误，请检查您抄写的助记词是否正确</Text>
      </View>
      : <View style={styles.hint_Text} />
    return (
      <View style={styles.container}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'#fff'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <Ctitle name=''></Ctitle>
        <Text style={{ fontSize: 30, marginLeft: 24, marginTop: 15, fontWeight: 'bold', color: '#1e1e1e' }}>验证助记词</Text>
        <Text style={{ fontSize: 14, marginLeft: 24, marginRight: 24, marginTop: 10, color: '#7d7d7d' }}>
          请根据您抄写的助记词，按顺序选择填充
        </Text>
        <View style={styles.wordaid}>
          <ChooseWordAid ClassifyList={myMnemonic} onWordRes={this.onWordPress.bind(this)} />
        </View>
        {hintText}
        <View style={{ marginLeft: 30, marginRight: 30, marginTop: 20 }}>
          <ChooseWord ClassifyList={selectMnemonic} onTabRes={this.ontabPress.bind(this)} />
        </View>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 1, marginRight: 15, marginLeft: 15, marginBottom: 42 }}>
          <TouchableOpacity onPress={this.onNavPage.bind(this, 'Tab')} style={[styles.boardContent_item, { backgroundColor: "rgba(3, 178, 75, 1)" }]}>
            <Text style={styles.bc_Text}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  wordaid: {
    padding: 15,
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#E9EEF2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  remindText: {
    fontSize: 14,
    color: '#DC0E0E'
  },
  bc_Text: {
    fontSize: FONT_SIZE(15),
    color: '#fff',
  },
  boardContent_item: {
    width: 345,
    height: 50,
    backgroundColor: '#0BB27E',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  hint_Text: {
    marginTop: 6,
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center'
  }
})

export default VerifyWordAidScreen;
