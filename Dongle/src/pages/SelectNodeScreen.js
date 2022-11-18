import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  StatusBar,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native'
import Ctitle from '../components/title'
import RNFS from 'react-native-fs';
import { Toast, Overlay, Theme } from 'teaset'
import storage from '../utils/storageUtil'
import * as Types from '../constants'

const { ethers } = require("ethers");

const bscRpcUrl = require('../utils/BSCRpcUrlList')
const ethRpcUrl = require('../utils/ETHRpcUrlList')
const ktoRpcUrl = require('../utils/KTORpcUrlList')

class SelectNodeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ktoRpcUrl: ktoRpcUrl.default,
      bscRpcUrl: bscRpcUrl.default,
      ethRpcUrl: ethRpcUrl.default,
      walletInfo: {

      },
      rpcUrlList: [

      ]
    }
  }

  componentDidMount() {
    console.debug(this.state.bscRpcUrl)

    this.setState({
      walletInfo: this.props.route.params.params.walletInfo
    }, () => {
      this.getChain()
    })
  }

  componentWillUnmount() {
    let list
    if (this.state.walletInfo.chainName == 'KTO') {
      list = this.state.ktoRpcUrl
    } else if (this.state.walletInfo.chainName == 'ETH') {
      list = this.state.ethRpcUrl
    } else if (this.state.walletInfo.chainName == 'BSC') {
      list = this.state.bscRpcUrl
    }

    for (let x = 0; x < list.length; x++) {
      list[x].time = ''
      list[x].blockNum = ''
    }
  }

  //判断主链
  getChain = async () => {
    let blockChain
    let chain = this.state.walletInfo
    if (chain.chainName == 'KTO') {
      blockChain = await storage.get(global.KTORpc)
    } else if (chain.chainName == 'BSC') {
      blockChain = await storage.get(global.BSCRpc)
    } else if (chain.chainName == 'ETH') {
      blockChain = await storage.get(global.ETHRpc)
    }

    let list = []
    if (this.state.walletInfo.chainName == 'KTO') {
      list = this.state.ktoRpcUrl
    } else if (this.state.walletInfo.chainName == 'ETH') {
      list = this.state.ethRpcUrl
    } else if (this.state.walletInfo.chainName == 'BSC') {
      list = this.state.bscRpcUrl
    }

    let checkRpc
    for (let x = 0; x < list.length; x++) {
      if (list[x].rpcUrl == blockChain.value.rpcUrl) {
        list[x].isCheck = true
        checkRpc = list[x].isCheck
      }
    }

    this.setState({
      rpcUrlList: list
    }, () => this.getBlockHeight(checkRpc))
  }

  getBlockHeight = async () => {
    for (let x = 0; x < this.state.rpcUrlList.length; x++) {

      const provider = this.state.rpcUrlList[x].rpcUrl
      const rpcprovider = new ethers.providers.JsonRpcProvider(provider)

      //开始时间
      let startTime = (new Date()).valueOf();
      let blockNum = await rpcprovider.getBlockNumber()
      //结束时间
      let endTime = (new Date()).valueOf();
      let time = endTime - startTime

      this.state.rpcUrlList[x].blockNum = blockNum
      this.state.rpcUrlList[x].time = time
    }

    this.setState({
      rpcUrlList: this.state.rpcUrlList
    })
  }

  onItemNavPage = async (item, index) => {
    if (this.state.walletInfo.chainName == 'KTO') {
      global.decimal = '11'
      storage.set(global.KTORpc, item)
    } else if (this.state.walletInfo.chainName == 'ETH') {
      global.ethDecimal = '18'
      storage.set(global.ETHRpc, item)
    } else if (this.state.walletInfo.chainName == 'BSC') {
      global.bscDecimal = '18'
      storage.set(global.BSCRpc, item)
    }

    for (let x = 0; x < this.state.rpcUrlList.length; x++) {
      this.state.rpcUrlList[x].isCheck = false
    }
    this.state.rpcUrlList[index].isCheck = true

    this.setState({
      rpcUrlList: this.state.rpcUrlList
    })
  }



  render() {
    let { walletInfo, rpcUrlList } = this.state

    let rpcListItem = ({ item, index }) => {
      return (
        <TouchableWithoutFeedback onPress={this.onItemNavPage.bind(this, item, index)}>
          <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 16,
            paddingRight: 16, height: 68, width: Dimensions.get('window').width
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#222C41', fontSize: 16, maxWidth: 200 }} numberOfLines={1}>{item.rpcUrl.slice(8)}</Text>
              <Image style={{ width: 24, height: 24, display: item.isCheck ? 'flex' : 'none', marginLeft: 10 }} source={require('../assets/img/ic_rpc_check.png')}></Image>
            </View>


            {
              item.blockNum !== '' ?
                <View style={{ alignItems: 'flex-end' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#222C41', fontSize: 12, marginRight: 8 }}>{item.time} ms</Text>
                    <View style={{ backgroundColor: item.time <= 500 ? '#00C5B0' : item.time <= 1500 ? '#FFA436' : '#FF3636', width: 6, height: 6, borderRadius: 6 }}></View>
                  </View>
                  <Text style={{ color: '#6D788B', fontSize: 12, marginTop: 4 }}>区块高度 {item.blockNum}</Text>
                </View>
                :
                <View style={{ alignItems: 'center' }}>
                  <ActivityIndicator size='small' color={Theme.toastIconTintColor} />
                </View>
            }

          </View>
        </TouchableWithoutFeedback>
      )
    }

    /*分割线*/
    let separatorComponent = () => {
      return <View style={{ height: 0.7, backgroundColor: '#EBEDF0', marginLeft: 16, marginRight: 16 }} />
    }

    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <Ctitle name={walletInfo.chainName}></Ctitle>

        <Text style={{
          height: 36, color: '#222C41', fontSize: 17, fontWeight: 'bold', paddingLeft: 16, textAlignVertical: 'center', marginTop: 5,
          width: Dimensions.get('window').width
        }}>节点速度</Text>

        <View style={{
          marginLeft: 16, marginRight: 16, marginTop: 8, borderColor: '#EBEEF5', borderWidth: 1, borderRadius: 4, backgroundColor: '#F7F8FA',
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 40
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <View style={{ backgroundColor: '#00C5B0', width: 6, height: 6, borderRadius: 6 }}></View>
            <Text style={{ color: '#6D788B', fontSize: 17, marginLeft: 7 }}>快</Text>
          </View>

          <View style={{ height: 12, width: 1, backgroundColor: '#EBEEF5' }}></View>

          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <View style={{ backgroundColor: '#FFA436', width: 6, height: 6, borderRadius: 6 }}></View>
            <Text style={{ color: '#6D788B', fontSize: 17, marginLeft: 7 }}>一般</Text>
          </View>

          <View style={{ height: 12, width: 1, backgroundColor: '#EBEEF5' }}></View>

          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <View style={{ backgroundColor: '#FF3636', width: 6, height: 6, borderRadius: 6 }}></View>
            <Text style={{ color: '#6D788B', fontSize: 17, marginLeft: 7 }}>慢</Text>
          </View>
        </View>

        <View style={{ backgroundColor: '#EDF0F5', height: 8, marginTop: 16, marginBottom: 8, width: Dimensions.get('window').width }}></View>

        <Text style={{
          height: 36, color: '#222C41', fontSize: 17, fontWeight: 'bold', paddingLeft: 16, textAlignVertical: 'center', marginTop: 5,
          width: Dimensions.get('window').width
        }}>默认节点</Text>


        {/* 列表 */}
        <FlatList
          data={rpcUrlList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={rpcListItem}
          ItemSeparatorComponent={separatorComponent} // 分割线
          showsVerticalScrollIndicator={false} />

      </View>
    )
  }
}

export default SelectNodeScreen;