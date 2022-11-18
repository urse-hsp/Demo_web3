import React from 'react';
import {
  View,
  NativeModules,
  Text, StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  DeviceEventEmitter
} from 'react-native'
import Ctitle from '../components/title'
import { Toast } from 'teaset';

import storage from '../utils/storageUtil'
import * as Types from '../constants'

const { ethers } = require("ethers");
const erc20abi = require("../utils/erc20.json")


class AddChainScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      walletName: '',
      symbol: '',
      decimal: '',
      key: ''
    }

    this.subscription = null
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      this.subscription = DeviceEventEmitter.addListener('addEvent', (res) => {
        let data = JSON.parse(res.mapBean)
        if (data) {
          Toast.message('添加成功')
          this.props.navigation.goBack()
        } else {
          Toast.message('添加失败，请重试')
        }
      });
    }

    this.setState({
      key: this.props.route.params.params.key
    }, () => console.debug(this.state.key.slice(0, 3)))
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
  }

  //页面跳转
  onNavPage = (item) => {
    if (this.state.walletName == '') {
      Toast.message('请输入代币合约地址')
      return
    }

    if (this.state.decimal == '') {
      Toast.message('正在查询精度，请稍后')
      return
    }

    if (this.state.symbol == '') {
      Toast.message('正在查询代币符号，请稍后')
      return
    }

    let chain = {
      contract: this.state.walletName,
      name: this.state.symbol,
      decimal: this.state.decimal,
      num: '0'
    }

    NativeModules.ReactNativeUtils.operateChain(this.state.key, JSON.stringify(chain), true);

  }

  //设置合约地址
  setNameState = (text) => {
    if (text != '')
      this.setState({
        walletName: text.text
      })
    this.getErc20(text.text)
  }

  getErc20 = async (name) => {
    let blockChain
    let chain = this.state.key.slice(0, 3)
    if (chain == 'KTO') {
      blockChain = await storage.get(global.KTORpc)
    } else if (chain == 'BSC') {
      blockChain = await storage.get(global.BSCRpc)
    } else if (chain == 'ETH') {
      blockChain = await storage.get(global.ETHRpc)
    }

    const rpcprovider = new ethers.providers.JsonRpcProvider(blockChain.value.rpcUrl)
    const contract = new ethers.Contract(name, erc20abi, rpcprovider);
    let decimal = await contract.decimals();
    let symbol = await contract.callStatic.symbol();
    console.debug('decimal', decimal)
    console.debug('symbol', symbol)
    this.setState({
      decimal: decimal + '',
      symbol: symbol
    })
  }

  render() {
    let { symbol, decimal } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <Ctitle name='新增代币'></Ctitle>
        <ScrollView style={{ flex: 1 }}>

          <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, marginTop: 12, marginBottom: 4, marginLeft: 16 }}>
            代币合约
          </Text>
          <View style={{
            height: 48, marginLeft: 16, marginRight: 16, marginTop: 6, borderWidth: 1,
            borderRadius: 4, backgroundColor: 'rgba(247, 248, 250, 1)', borderColor: 'rgba(235, 238, 245, 1)'
          }}>
            <TextInput placeholder='输入代币合约地址' onChangeText={(text) => this.setNameState({ text })}
              style={{ marginLeft: 16, marginRight: 16, fontSize: 14, flex: 1, }} />
          </View>

          <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, marginTop: 20, marginBottom: 4, marginLeft: 16 }}>
            代币符号
          </Text>
          <View style={{
            height: 48, marginLeft: 16, marginRight: 16, marginTop: 6, borderWidth: 1,
            borderRadius: 4, backgroundColor: 'rgba(247, 248, 250, 1)', borderColor: 'rgba(235, 238, 245, 1)'
          }}>
            <TextInput placeholder='' defaultValue={symbol} editable={false}
              style={{ marginLeft: 16, marginRight: 16, fontSize: 14, flex: 1, }} />
          </View>


          <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, marginTop: 20, marginBottom: 4, marginLeft: 16 }}>
            代币精度
          </Text>
          <View style={{
            height: 48, marginLeft: 16, marginRight: 16, marginTop: 6, borderWidth: 1,
            borderRadius: 4, backgroundColor: 'rgba(247, 248, 250, 1)', borderColor: 'rgba(235, 238, 245, 1)'
          }}>
            <TextInput placeholder='' defaultValue={decimal} editable={false}
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
    flex: 1,
    backgroundColor: '#fff'
  },

})

export default AddChainScreen;
