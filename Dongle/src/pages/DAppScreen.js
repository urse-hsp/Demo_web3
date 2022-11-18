import React from 'react';
import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  TouchableOpacity,
  NativeModules,
  Text,
  StatusBar,
  TextInput,
  DeviceEventEmitter,
  StyleSheet, FlatList,
} from 'react-native'
import TabComponent from '../components/tab'
import storage from '../utils/storageUtil'
import { getDappList } from "../api/api";
import { Carousel } from '@ant-design/react-native'

let screenWidth = Dimensions.get('window').width

class DAppScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      url: '',
      walletInfo: {},
      isRefreshing: false,  //刷新
      isLoadMore: false, //控制上拉加载
      bannerList: [],
      recommendList: [
        {
          Title: 'KeepSwap',
          Desc: '建立在Kortho Chain上兑换KTO的去中心化交易所',
          Url: 'https://kswap.web3s.finance', 
          Image: require('../assets/img/ic_keepswap.jpg'),
        },
        {
          Title: 'KtoBridge',
          Desc: '支持币安智能链BSC、科图链KTO跨链交易协议',
          Url: 'https://ktobridge.web3s.finance/',
          Image: require('../assets/img/ic_ktobridge.png'),
        },
        {
          Title: 'United Farm',
          Desc: 'UFT流动性挖矿,一站式聚合平台',
          Url: 'http://uft.web3s.finance',
          Image: require('../assets/img/ic_uft.png'),
        },
        {
          Title: 'DKC Farm',
          Desc: 'DKC流动性挖矿应用',
          Url: 'http://dkc.web3s.finance',
          Image: require('../assets/img/ic_dkc.jpg'),
        },
        {
          Title: 'UniSwap',
          Desc: '基于自动化做市商兑换池的去中心化交易所',
          Url: 'https://app.uniswap.org/#/swap?chain=mainnet',
          Image: require('../assets/img/ic_uniswap.jpg'),
        }, {
          Title: 'PancakeSwap',
          Desc: '支持在币安智能链上兑换的BSC的DEX交易所',
          Url: 'https://pancakeswap.finance/swap',
          Image: require('../assets/img/ic_pancakeswap.png'),
        } ],

      tabActiveIndex: 0, //tab position
      tabList: [
        {
          id: 0,
          choose: true,
          title: '热门'
        },
        // {
        //   id: 0,
        //   choose: true,
        //   title: '收藏'
        // }
      ]
    }

    this.subscription = null
    this.subscription1 = null
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      this.subscription = DeviceEventEmitter.addListener('findSuccess', (res) => {
        let data = JSON.parse(res.mapBean)
        console.debug(data)
        for (const item of data) {
          if (item.choose) {
            this.setState({
              walletInfo: item
            })
          }
        }
      });

      this.subscription1 = DeviceEventEmitter.addListener('findDApp', (res) => {
        let data = JSON.parse(res.mapBean)
        console.debug(data)
        for (const item of data) {
          if (item.choose) {
            this.setState({
              walletInfo: item
            })
          }
        }
      });
    }

    NativeModules.ReactNativeUtils.findRealm('ALL', 'findDApp')
    this._onRefresh()
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }

    if (this.subscription1) {
      this.subscription.remove()
    }
  }


  //获取dapp
  async getKTOTransfer() {
    try {
      let res = await getDappList()
      if (res.errCode == 0) {
        console.debug('res-----', res.data)
        if (this.state.size === 0) {

          let list = []
          let banner = []
          res.data.forEach(item => {
            if (item.Cy == 2) {
              list.push(item)
            } else if (item.Cy == 1) {
              banner.push(item)
            }
          });

          console.debug('-----', list.length)
          if (list.length > 0) {

            this.setState({
              // recommendList: list,
              bannerList: banner,
              isRefreshing: false,
            })
          } else {
            this.setState({
              bannerList: banner,
              isRefreshing: false,
            })
          }
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

  //获取主链
  async getBlockChain(item) {
    let blockChain
    let chain = this.state.walletInfo
    if (chain.chainName == 'KTO') {
      blockChain = await storage.get(global.KTORpc)
    } else if (chain.chainName == 'BSC') {
      blockChain = await storage.get(global.BSCRpc)
    } else if (chain.chainName == 'ETH') {
      blockChain = await storage.get(global.ETHRpc)
    }

    console.debug(blockChain)
    NativeModules.ReactNativeUtils.startWebViewActivity(JSON.stringify(this.state.walletInfo),
      item, JSON.stringify(blockChain))
  }


  setUrl = (text) => {
    if (text != '')
      this.setState({
        url: text.text
      })
  }

  //页面跳转
  onNavPage = (item) => {
    console.debug('----',item)

    //跳转Web3页面

    if (item.indexOf("https://") != -1 || item.indexOf("http://") != -1) {

      this.getBlockChain(item)
      return
    }
  }

  //页面跳转
  goWeb = () => {
    this.getBlockChain(this.state.url)
    this.setState({
      url: ''
    })
  }

  //tab选择
  onTabRes = (index) => {
    this.setState({
      tabActiveIndex: index
    })
  }

  render() {
    let { recommendList, tabList, tabActiveIndex, url, bannerList } = this.state

    let renderRecommendItem = ({ item }) => {
      return (
        <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, item.Url)}>
          <View style={{
            backgroundColor: '#fff', display: 'flex', flexDirection: 'column', height: 80
          }}>
            <View style={{
              backgroundColor: '#fff', display: 'flex', flexDirection: 'row',
              height: 79, alignItems: 'center', marginLeft: 16, marginRight: 13
            }}>

              <Image style={{ width: 48, height: 48, borderRadius: 8 }}
                source={{ uri: "https://www.kortho.io/static/" + item.Image }}
                resizeMode='contain' />

              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: '#222C41', fontSize: 17, fontWeight: 'bold' }}>
                  {item.Title}
                </Text>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#6D788B', fontSize: 12, marginTop: 4 }}>
                    {item.Desc}
                  </Text>
                  <TouchableOpacity >
                    <Text style={{ color: '#B7BFCC', fontSize: 12 }}>
                      {/* 收藏 */}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ backgroundColor: 'rgba(235, 235, 240, 1)', height: 1, flex: 1, marginLeft: 76 }} ></View>
          </View>
        </TouchableWithoutFeedback>
      )
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />

        <View style={{ display: 'flex', flexDirection: 'column' }}>
          {/* 头图 */}
          <View style={{ height: 160 }}>
            <Carousel
              style={{ height: 160 }}
              interval={5000}
              control={false}>
              {
                bannerList.map((item, index) =>
                  <TouchableWithoutFeedback key={item.Id} onPress={() => {
                    if (item.Url !== '') {
                      this.onNavPage(item.Url)
                    }
                  }}>
                    <View>
                      <Image source={{ uri: "https://www.kortho.io/static/" + item.Image }} style={{ height: 160 }} />
                      <View style={{
                        position: 'absolute', right: 20, bottom: 10, flexDirection: 'row',
                        width: 20, height: 20, alignItems: 'flex-end', justifyContent: 'center'
                      }}>
                        <Text style={{ color: '#fff', fontSize: 13 }}>{index + 1}</Text>
                        <Text style={{ color: '#fff', fontSize: 10 }}>/{bannerList.length}</Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                )
              }
            </Carousel>
          </View>
          {/* 搜索 */}
          <View style={{
            shadowOffset: { width: 2, height: 3 }, shadowOpacity: 0.8, shadowRadius: 10, elevation: 5,
            height: 36, marginTop: -16, marginLeft: 15, marginRight: 15, borderRadius: 10, backgroundColor: '#fff',
            display: 'flex', flexDirection: 'row', alignItems: 'center'
          }}>
            <Image style={{ width: 15, height: 15, marginLeft: 15 }} source={require('../assets/img/search_30px_gray.png')} />
            <TextInput placeholder='输入链接访问' clearButtonMode='while-editing' style={{ marginLeft: 15, fontSize: 14, flex: 1, }}
              onChangeText={(text) => this.setUrl({ text })} returnKeyType='search'
              enablesReturnKeyAutomatically={true}
              autoCapitalize='none'
              value={url}
              onSubmitEditing={() => this.goWeb()} />
          </View>
        </View>
        {/* TAB */}
        <View style={{ marginTop: 8, height: 45 }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
            <TabComponent height={45} activeItem={tabActiveIndex} mode='Normal' arrData={tabList} onTabRes={this.onTabRes.bind(this)} />
          </ScrollView>
        </View>

        <FlatList
          style={{ marginTop: 4 }}
          data={recommendList}
          onRefresh={this._onRefresh.bind(this)}
          refreshing={this.state.isRefreshing}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderRecommendItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({


})

export default DAppScreen;
