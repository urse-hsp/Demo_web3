import React from 'react';
import {
  View,
  NativeModules,
  Text,
  StyleSheet,
  StatusBar,
  DeviceEventEmitter,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  ImageBackground
} from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { Toast, Theme, Overlay } from 'teaset';
import TabComponent from '../components/tab'
import { getKTOTransfer, getBSCTranscations } from "../api/api";

let popuKey = undefined

class TransferListScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isRefreshing: false,  //刷新
      isLoadMore: false, //控制上拉加载
      chain: {
        contract: '',
        name: ''
      },
      walletInfo: {
        address: '',
        key: ''
      },
      tabList: [
        {
          id: 0,
          choose: true,
          title: '转入'
        }, {
          id: 0,
          choose: true,
          title: '转出'
        }
      ],
      tabActiveIndex: 0, //tab position
      size: 0,
      total: 0,
      tokenList: [
        // {
        //   name: 'KTO',
        //   contract: '0',
        //   img: require('../assets/img/' + 1 + '.png'),
        //   CreateTime:'',
        //   Value:'',
        //   FromAddr:''
        //   ToAddr:''
        // }, {
        //   name: 'KTO',
        //   contract: '0',
        //   img: require('../assets/img/' + 1 + '.png'),
        // },
      ],
    }
  }

  componentDidMount() {
    this.setState({
      chain: this.props.route.params.params.chain,
      walletInfo: this.props.route.params.params.walletInfo,
    }, () => {
      this._onRefresh()
    })
  }

  componentWillUnmount() {
  }

  //获取KTO链转账列表
  async getKTOTransfer() {
    let code
    let addr
    if (this.state.walletInfo.chainName == 'BSC') {
      code = this.state.chain.contract == '0xB8c77482e45F1F44dE1745F52C74426C631bDD52' ? 'BNB' : this.state.chain.contract
      addr = this.state.walletInfo.address
    } else if (this.state.walletInfo.chainName == 'KTO') {
      code = this.state.chain.contract == '0xE388eb6aaBA54412c979564d6aC0537A8AB37f6D' ? 'KTO' : this.state.chain.contract
      addr = 'Kto0' + this.state.walletInfo.address.substring(2)
    } else {
      return
    }

    let param = {
      code: code,
      addr: addr,
      size: this.state.size,
      ty: this.state.tabActiveIndex == 0 ? 1 : 2,
      limit: 10
    }
    try {
      let res
      if (this.state.walletInfo.chainName == 'KTO') {
        res = await getKTOTransfer(param)
      } else {
        res = await getBSCTranscations(param)
      }
      if (res.errCode == 0) {
        console.debug('res-----', res.data)
        if (this.state.size === 0) {
          this.setState({
            tokenList: res.data.dataList,
            total: res.data.total,
            isRefreshing: false,
          })
        } else {
          console.debug(res)
          this.setState({
            tokenList: [...this.state.tokenList, ...res.data.dataList],
            total: res.data.total,
            isLoadMore: false,
            isRefreshing: false,
          })
        }

      } else {
        this.setState({
          isRefreshing: false
        })
      }

    } catch (error) {
      this.setState({
        isRefreshing: false
      })
    }

  }

  // 复制
  copyString() {
    let str = this.state.walletInfo.chainName == 'KTO' ?
      'Kto0' + this.state.walletInfo.address.slice(2) : this.state.walletInfo.address

    Clipboard.setString(str)
    Toast.message('复制成功')
  }

  // 返回
  onBack = () => {
    this.props.navigation.goBack()
  }

  //页面跳转
  onNavPage = (item) => {
    if (item == 'Transfer' || item == 'QRcodePay') {
      this.props.navigation.push(item, {
        screen: item,
        params: {
          chain: this.state.chain,
          walletInfo: this.state.walletInfo
        },
      });
      return;
    }

    this.props.navigation.push(item);
  }

  //tab选择
  onTabRes = (index) => {
    this.setState({
      tabActiveIndex: index,
      tokenList: [],
    }, () => {
      this._onRefresh()
    })
  }

  //刷新 
  _onRefresh = () => {
    // 不处于 下拉刷新 
    if (!this.state.isRefreshing) {
      this.setState({
        size: 0,
        isRefreshing: true
      }, () => {
        this.getKTOTransfer()
      })
    }
  }

  //下拉加载
  _onEndReached = () => {
    console.debug('加载')
    if (this.state.tokenList.length < this.state.total && !this.state.isLoadMore) {
      this.setState({
        size: this.state.size + 1,
        isLoadMore: true
      }, () => {
        this.getKTOTransfer()
      })
    }
  }

  //交易详情
  onItemNavPage = (item) => {
    item.tabActiveIndex = this.state.tabActiveIndex
    this.props.navigation.push('TransferDetail', {
      screen: 'TransferDetail',
      params: {
        transferDetail: item,
        chain: this.state.chain,
        walletInfo: this.state.walletInfo
      },
    });
  }


  render() {
    let { walletInfo, chain, tabActiveIndex, tabList, tokenList } = this.state;

    let tokenListItem = ({ item }) => {
      return (
        <TouchableWithoutFeedback onPress={this.onItemNavPage.bind(this, item)}>
          <View style={{
            backgroundColor: '#fff', display: 'flex', flexDirection: 'column', paddingLeft: 16, paddingRight: 36, height: 64
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 63 }}>
              <Image style={{ width: 24, height: 24, borderRadius: 24 }} source={
                tabActiveIndex == 0 ? require('../assets/img/ic_round_green.png') : require('../assets/img/ic_round_red.png')
              } />
              <View style={{
                backgroundColor: '#fff', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'
              }}>
                <View style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: 12 }}>
                  <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 16, }}>
                    {tabActiveIndex == 0 ? '转入' : '转出'}
                  </Text>

                  {/* walletInfo.address.slice(0, 7) + '****' +
                    walletInfo.address.slice(walletInfo.address.length - 7, walletInfo.address.length) */}
                  <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 12, marginTop: 2 }}>
                    {tabActiveIndex == 0 ?
                      item.FromAddr.slice(0, 10) + '...' + item.FromAddr.slice(item.FromAddr.length - 7, item.FromAddr.length)
                      : item.ToAddr.slice(0, 10) + '...' + item.ToAddr.slice(item.ToAddr.length - 7, item.ToAddr.length)
                    }
                  </Text>
                </View>

                <View style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                  <Text style={[{ fontSize: 16, fontWeight: 'bold' }, { color: tabActiveIndex == 0 ? 'rgba(34, 44, 65, 1)' : 'rgba(255, 54, 54, 1)' }]}>
                    {tabActiveIndex == 0 ? '+' : '-'} {parseFloat(parseFloat(item.Value).toFixed(6)).toString()} {chain.name}

                  </Text>
                  <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 12, marginTop: 2 }}>
                    {item.CreateTime}
                  </Text>
                </View>

              </View>
            </View>
            <View style={{ backgroundColor: 'rgba(235, 235, 240, 1)', height: 1, flex: 1, marginLeft: 60 }} ></View>
          </View>
        </TouchableWithoutFeedback >
      )
    }

    return (
      <View style={styles.container} >
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'light-content'} // enum('default', 'light-content', 'dark-content')
        />
        <ImageBackground style={{ height: 260 }}
          source={require('../assets/img/bg_chiandetail.png')}>
          <View style={{
            borderTopWidth: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            borderTopColor: 'transparent',
          }}>
            <View style={styles.titleWrap} >
              <TouchableOpacity style={[styles.backIcon, { width: 40, height: 40, padding: 0, alignItems: 'center', justifyContent: 'center' }]}
                activeOpacity={1} onPress={this.onBack.bind(this)}>
                <Image style={styles.backIcon} source={require('../assets/img/ic_back_white.png')} />
              </TouchableOpacity>
              <Text style={styles.tabName} >{chain.name}</Text>
              <View style={{ width: 40, height: 40 }}></View>
            </View>
          </View>

          <Text style={{ marginTop: 10, color: '#fff', fontSize: 40, fontWeight: 'bold', textAlign: 'center' }}>
            {chain.num}
          </Text>

          {/* 地址 */}
          <TouchableWithoutFeedback onPress={this.copyString.bind(this)}>
            <View style={{
              marginTop: 32, height: 28, display: 'flex', flexDirection: 'row', alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{ fontSize: 14, color: '#fff' }}>
                {
                  walletInfo.chainName == 'KTO' ? (
                    'Kto0' + walletInfo.address.slice(2, 7) + '****' +
                    walletInfo.address.slice(walletInfo.address.length - 7, walletInfo.address.length)
                  ) : (
                    walletInfo.address.slice(0, 7) + '****' +
                    walletInfo.address.slice(walletInfo.address.length - 7, walletInfo.address.length)
                  )
                }
              </Text>
              <Image style={{ width: 11, height: 11, marginLeft: 8 }} source={require('../assets/img/ic_copy_22px.png')} />
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>

        <View style={{ flex: 1, marginTop: -30, borderTopRightRadius: 16, borderTopLeftRadius: 16, backgroundColor: '#fff' }}>

          {/* TAB */}
          <View style={{ marginTop: 8, height: 45 }}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
              <TabComponent height={45} activeItem={tabActiveIndex} mode='Normal' arrData={tabList} onTabRes={this.onTabRes.bind(this)} />
            </ScrollView>
          </View>

          <FlatList
            style={{ flex: 1 }}
            data={tokenList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={tokenListItem}
            showsVerticalScrollIndicator={false}
            onRefresh={this._onRefresh.bind(this)}
            refreshing={this.state.isRefreshing}
            onEndReached={this._onEndReached.bind(this)}
            ListEmptyComponent={() =>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Image style={{ width: 200, height: 200, marginTop: 60 }} source={require('../assets/img/ic_null.png')} />
                <Text style={{ color: 'rgba(183, 191, 204, 1)', fontSize: 14, marginTop: -20 }}>
                  暂无转账记录~
                </Text>
              </View>
            }
            onEndReachedThreshold={0.3}
          />

          {<View style={{
            display: 'flex', flexDirection: 'row', marginBottom: 30, marginTop: 10,
            alignItems: 'center', justifyContent: 'space-between',
            marginLeft: 16, marginRight: 16
          }}>
            <TouchableOpacity onPress={this.onNavPage.bind(this, 'Transfer')}
              style={{
                height: 48, width: (Dimensions.get('window').width / 2) - 24,
                backgroundColor: 'rgba(3, 178, 75, 0.2)', borderRadius: 4, alignItems: 'center', justifyContent: 'center'
              }}>
              <Text style={{ fontSize: 17, color: 'rgba(3, 178, 75, 1)' }}>
                转账
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onNavPage.bind(this, 'QRcodePay')}
              style={{
                height: 48, width: (Dimensions.get('window').width / 2) - 24, backgroundColor: 'rgba(3, 178, 75, 1)',
                borderRadius: 4, alignItems: 'center', justifyContent: 'center'
              }}>
              <Text style={{ fontSize: 17, color: '#fff' }}>
                收款
              </Text>
            </TouchableOpacity>
          </View>}

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

export default TransferListScreen;
