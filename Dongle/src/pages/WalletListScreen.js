import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  ActivityIndicator,
  DeviceEventEmitter,
  NativeModules,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  FlatList
} from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { Toast, Overlay, Theme } from 'teaset';
import mulcall from '../utils/balanceUtil'

let popuKey = null;

class WalletListScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      walletList: [],
      totalNum: '0.00'
    }

    this.subscription = null
  }

  componentDidMount() {
    this.showCustom();

    if (Platform.OS === 'android') {
      this.subscription = DeviceEventEmitter.addListener('AllSuccess', (res) => {
        let data = JSON.parse(res.mapBean)
        this.getChainNum(data)
      });
    }

    NativeModules.ReactNativeUtils.findRealm('ALL', 'AllSuccess')
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
  }

  overlayCustomView = (
    <Overlay.View
      style={{ alignItems: 'center', justifyContent: 'center' }}
      modal={true}
      overlayOpacity={0.1}
    >
      <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center' }}>
        <ActivityIndicator size='large' color={Theme.toastIconTintColor} />
        <Text style={{ marginTop: 10 }}>
          正在查询···
        </Text>
      </View>
    </Overlay.View>
  );

  showCustom() {
    popuKey = Overlay.show(this.overlayCustomView);
  }

  hideCustom() {
    Overlay.hide(popuKey)
  }

  //获取数量
  async getChainNum(list) {

    let wallet = list

    for (let index = 0; index < list.length; index++) {
      let item = list[index]
      let chainList = []
      if (item.chainName == 'KTO') {
        chainList = await mulcall.ktoBalance(item.chainList, item.address)
      } else if (item.chainName == 'ETH') {
        chainList = await mulcall.ethBalance(item.chainList, item.address)
      } else if (item.chainName == 'BSC') {
        chainList = await mulcall.bscBalance(item.chainList, item.address)
      }

      wallet[index].chainList = chainList
    }

    let num = 0
    for (const item of wallet) {
      if (item.chainName == 'KTO') {
        for (const chain of item.chainList) {
          if (chain.name == 'KTO') {
            num += parseFloat(chain.num)
          }
        }
      }
    }

    this.setState({
      walletList: wallet,
      totalNum: num.toFixed(6)
    }, () => {
      this.hideCustom()
    })
  }

  // 返回
  onBack = () => {
    this.props.navigation.goBack()
  }

  copyString = (str) => {
    if (!str) return
    Clipboard.setString(str)
    Toast.message('复制成功')
  }

  render() {
    let { walletList, totalNum } = this.state

    let chainListItem = (item, chainName) => {
      return (
        <View style={{
          backgroundColor: '#fff', flexDirection: 'row', height: 60, justifyContent: 'space-between',
          alignItems: 'center', marginLeft: 15, marginRight: 15
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>


            {
              chainName == 'KTO' ? (
                item.name == 'KTO' ? (
                  <Image style={{ width: 36, height: 36, borderRadius: 36 }} source={require('../assets/img/ic_kto.png')} />
                ) : (
                  <Image style={{ width: 36, height: 36, borderRadius: 36 }}
                    source={{ uri: 'http://165.154.42.138:8033/static/image/' + item.contract + '.png' }} />
                )
              ) : (
                chainName == 'ETH' ? (

                  item.name == 'ETH' ? (
                    <Image style={{ width: 36, height: 36, borderRadius: 36 }} source={require('../assets/img/ic_eth.png')} />
                  ) : (
                    <Image style={{ width: 36, height: 36, borderRadius: 36 }} source={require('../assets/img/ic_eth_nor.png')} />
                  )
                ) : (
                  item.name == 'BNB' ? (
                    <Image style={{ width: 36, height: 36, borderRadius: 36 }} source={require('../assets/img/ic_bnb.png')} />
                  ) : (
                    <Image style={{ width: 36, height: 36, borderRadius: 36 }} source={require('../assets/img/ic_bnb_nor.png')} />
                  )
                ))
            }

            <Text style={{ fontSize: 17, color: 'rgba(34, 44, 65, 1)', marginLeft: 12 }}>
              {item.name}
            </Text>
          </View>
          <Text style={{ fontSize: 18, color: 'rgba(34, 44, 65, 1)' }}>
            {item.num}
          </Text>
        </View>
      )
    }

    let ListItem = (listItem) => {
      return (
        <View style={{
          backgroundColor: '#fff', flexDirection: 'column', borderRadius: 16,
          marginLeft: 16, marginRight: 16, marginBottom: 12
        }}>

          <TouchableWithoutFeedback onPress={this.copyString.bind(this, listItem.address)}>
            <View style={{
              height: 48, marginLeft: 15, marginRight: 15,
              flexDirection: 'row', alignItems: 'center'
            }}>
              <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 17 }}>
                {listItem.walletName}
              </Text>

              <Text style={{ color: '#666', fontSize: 12, marginLeft: 10 }}>
                {listItem.chainName == 'KTO' ? (
                  'Kto0' + listItem.address.slice(2, 6) + '...' +
                  listItem.address.slice(listItem.address.length - 7, listItem.address.length)
                ) : (
                  listItem.address.slice(0, 6) + '...' +
                  listItem.address.slice(listItem.address.length - 7, listItem.address.length)
                )
                }
              </Text>

              <Image style={{ width: 12, height: 12, marginLeft: 8 }} source={require('../assets/img/ic_copy_black.png')} ></Image>
            </View>
          </TouchableWithoutFeedback>

          <View style={{ backgroundColor: 'rgba(235, 235, 240, 1)', height: 1 }}></View>

          <FlatList
            style={{ marginTop: 8, marginBottom: 8 }}
            data={listItem.chainList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => chainListItem(item, listItem.chainName)}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'light-content'} // enum('default', 'light-content', 'dark-content')
        />

        <View style={{
          borderTopWidth: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          borderTopColor: 'transparent', backgroundColor: 'rgba(3, 178, 75, 1)'
        }}>
          <View style={styles.titleWrap} >
            <TouchableOpacity style={[styles.backIcon, { width: px2dp(80), height: px2dp(80), padding: 0, alignItems: 'center', justifyContent: 'center' }]}
              activeOpacity={1} onPress={this.onBack.bind(this)}>
              <Image style={styles.backIcon} source={require('../assets/img/ic_back_white.png')} />
            </TouchableOpacity>
            <Text style={styles.tabName} >
              资产总览
            </Text>
            <View style={[styles.backIcon, { width: px2dp(88), height: px2dp(80), alignItems: 'center', justifyContent: 'center' }]}></View>
          </View>
        </View>

        <View style={{
          backgroundColor: 'rgba(3, 178, 75, 1)', height: 106, borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16
        }} >
          <View style={{
            height: 126, marginLeft: 16, marginRight: 16, backgroundColor: '#fff', borderRadius: 16,
            alignItems: 'center', marginTop: 12
          }}>
            <Text style={{ marginTop: 16, color: 'rgba(34, 44, 65, 1)', fontSize: 14 }}>
              总资产(KTO)
            </Text>
            <Text style={{ marginTop: 8, color: 'rgba(34, 44, 65, 1)', fontSize: 40, fontWeight: 'bold' }}>
              {totalNum}
            </Text>
          </View>
        </View>

        <FlatList
          style={{ marginTop: 50 }}
          data={walletList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => ListItem(item)}
          showsVerticalScrollIndicator={false}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(247, 248, 250, 1)'
  },
  titleWrap: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    paddingLeft: 16
  },
  tabName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: FONT_SIZE(18),
    width: px2dp(500),
    textAlign: 'center',
    flex: 1,
  },
})

export default WalletListScreen;
