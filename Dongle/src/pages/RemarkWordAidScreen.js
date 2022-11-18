import React from 'react';
import {
  View, Dimensions,
  NativeModules, TouchableOpacity,
  Text, StyleSheet,
  StatusBar
} from 'react-native'
import { Toast, Wheel } from 'teaset';
import { connect } from 'react-redux'
import { saveCreatWalletInfo } from '../actions'
import Ctitle from '../components/title'
import WordAid from '../components/WordAid'
import "@ethersproject/shims"
let ethers = require('ethers');
import * as Random from 'expo-random';
import Clipboard from '@react-native-community/clipboard'


@connect(({ creatWalletInfo }) => ({ creatWalletInfo }), dispatch => ({
  saveCreatWalletInfo(data) {
    dispatch(saveCreatWalletInfo(data))
  }
}))
class RemarkWordAidScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      myMnemonic: [],
      mnemonic: '',
      remark: ''
    }
  }

  componentDidMount() {
    this.setWallet()
  }

  async setWallet() {
    //16字节的随机数
    let value = await Random.getRandomBytesAsync(16)

    //生成助记词 
    let mnemonic = ethers.utils.entropyToMnemonic(value);

    this.setState({
      myMnemonic: mnemonic.split(' '),
      mnemonic: mnemonic
    })

    this.props.saveCreatWalletInfo({
      walletNet: this.props.creatWalletInfo.walletNet,
      identityName: this.props.creatWalletInfo.identityName,
      walletPw: this.props.creatWalletInfo.walletPw,
      pwMind: this.props.creatWalletInfo.pwMind,
      wordAid: mnemonic
    })
  }

  onNavPage = (item) => {
    this.props.navigation.push(item);
  }

  // 复制助记词
  copyMnemonic(mnemonic) {
    if (!mnemonic) return
    Clipboard.setString(mnemonic)
    Toast.message('复制成功')
  }

  render() {
    let { myMnemonic, mnemonic } = this.state;
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
        <Text style={{ fontSize: 30, marginLeft: 24, marginTop: 15, fontWeight: 'bold', color: '#1e1e1e' }}>备份助词器</Text>
        <Text style={{ fontSize: 14, marginLeft: 24, marginRight: 24, marginTop: 17, color: '#7d7d7d' }}>
          助记词用于恢复钱包及重制钱包密码，请准确无误抄写助记词，并存放在安全的地方。
        </Text>
        <View style={styles.wordaid}>
          <WordAid ClassifyList={myMnemonic} />
        </View>
        <View style={{ marginLeft: 24, marginRight: 24, marginTop: 17 }}>
          <Text style={styles.remindText}>切记:</Text>
          <Text style={styles.remindText}>· 请勿将助记词透露给任何人</Text>
          <Text style={styles.remindText}>· 助记词一旦丢失，资产将无法恢复</Text>
          <Text style={styles.remindText}>· 请勿通过截屏、网络传输的方式进行备份保存</Text>
          <Text style={styles.remindText}>· 遇到任何情况，请不要轻易卸载钱包App</Text>
        </View>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 1, marginRight: 15, marginLeft: 15, marginBottom: 42 }}>
          <TouchableOpacity onPress={this.onNavPage.bind(this, 'VerifyWordAid')} style={[styles.boardContent_item, { backgroundColor: "rgba(3, 178, 75, 1)" }]}>
            <Text style={styles.bc_Text}>备份完成，进行验证</Text>
          </TouchableOpacity>
          <Text style={{ padding: 11, textDecorationLine: "underline" }} onPress={() => this.copyMnemonic(mnemonic)}>复制助词器</Text>
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
    display: 'flex',
    padding: 15,
    marginTop: 22,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#E9EEF2',
    borderRadius: 10,
  },
  remindText: {
    fontSize: 14,
    color: '#DC0E0E'
  },
  bc_Text: {
    fontSize: 15,
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
})

export default RemarkWordAidScreen;
