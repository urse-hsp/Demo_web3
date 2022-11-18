import React from 'react';
import {
  View,
  Dimensions,
  Text,
  Image,
  TouchableWithoutFeedback,
  NativeModules,
  FlatList,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
  DeviceEventEmitter,
} from 'react-native'
import { getVersion, getSymbolBalances } from '../api/api'
import { Camera } from 'expo-camera';
import Clipboard from '@react-native-community/clipboard'
import { BoxShadow } from 'react-native-shadow'
import { Toast, Theme, Overlay } from 'teaset';
import CustomAlertDialog from './Home/CustomAlertDialog'
import CustomImage from '../components/CustomImage'
import CreatWalletPopu from './Home/CreatWalletPopu';
import storage from '../utils/storageUtil'
import mulcall from '../utils/balanceUtil'
import DeviceInfo from 'react-native-device-info'
import RNFS from 'react-native-fs';

let customKey = undefined

class HomeScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isRefreshing: false,  //刷新
      showWalletPopu: false, //选择钱包弹窗
      createWalletType: '',
      showCreatPopu: false,   //钱包创建弹窗
      walletInfo: {
        address: '',
      },
      tokenList: [
        {
          // name: 'KTO',
          // contract: '0',
          // img: require('../assets/img/' + 1 + '.png'),
          // num: 0
        },
      ],
      progressNum: '0',
      ip: ''
    }

    this.subscription = null
    this.subscription2 = null
  }

  async componentDidMount() {
    NativeModules.ReactNativeUtils.getIP(
      (res) => {
        this.setState({
          ip: res
        })
      })

    this.getVersion()
    this.getChain()

    if (Platform.OS === 'android') {
      this.subscription = DeviceEventEmitter.addListener('findSuccess', (res) => {
        let data = JSON.parse(res.mapBean)
        for (const item of data) {
           

          if (item.choose) {
            if (item.chainList.length == 0) {
              item.chainList = [{}]
            }

            console.log('+++++当前钱包', item)

            this.setState({
              walletInfo: item,
              tokenList: item.chainList
            }, () => {
              this._onRefresh()
            })
          }
        }
      });

      this.subscription2 = DeviceEventEmitter.addListener('replace', (res) => {
        let data = JSON.parse(res.mapBean)
        if (data) {
          console.debug('存储成功')
        } else {
          console.debug('存储错误')
          this.getChainNum(this.state.walletInfo)
        }
      });
    }

    NativeModules.ReactNativeUtils.findRealm('ALL', 'findSuccess')

    this.clearImageCache()
  }

  async clearImageCache() {
    let isClear = await storage.get('isClear1')
    if (isClear == undefined) {
      //清除图片缓存
      NativeModules.ReactNativeUtils.clearImgCache(
        (callback) => {
          storage.set('isClear1', true)
        }, (err) => {

        })
    }
  }

  downloadCustomView = () => {
    return (
      <Overlay.View
        style={{ alignItems: 'center', justifyContent: 'center' }}
        modal={true}
      >
        <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center' }}>
          <ActivityIndicator size='large' color={Theme.toastIconTintColor} />
          <Text style={{ marginTop: 20 }}>
            正在下载APP...
          </Text>
        </View>
      </Overlay.View>
    )
  };

  showUpDataCustom() {
    customKey = Overlay.show(this.downloadCustomView());
  }

  hideUpdataCustom() {
    Overlay.hide(customKey)
  }
 

  //获取更新
  async getVersion() {
    try {
      let formData = new FormData();
      formData.append("version", DeviceInfo.getVersion());
      let res = await getVersion(formData)
      console.debug(res)
      if (res.errCode == 1001) {
        this.showPopu(res.data)
      } else {
        this.isRequesting = false
      }
    } catch (error) {
      this.hideUpdataCustom()
      this.isRequesting = false
    }
  }

  showPopu(data) {
    customKey = Overlay.show(this.overlayCustomView(data));
  }

  hidePopu() {
    Overlay.hide(customKey)
  }

  overlayCustomView = (data) => {
    return (
      <Overlay.PopView
        modal={true}
        style={{ alignItems: 'center', justifyContent: 'center' }}
      >
        <View style={{
          backgroundColor: '#fff', minWidth: 320, minHeight: 174,
          borderRadius: 20, alignItems: 'center', justifyContent: 'flex-end'
        }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: '#000', fontSize: 18, marginTop: 20, fontWeight: 'bold' }}>
              APP更新
            </Text>
            <Text style={{ color: '#333', fontSize: 16, marginTop: 20 }}>
              {data.Msg}
            </Text>
          </View>
          <View style={{ height: 1, backgroundColor: 'rgba(237, 237, 237, 1)', width: 320 }}></View>
          <View style={{ height: 48, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <TouchableWithoutFeedback onPress={() => {
              this.hidePopu()
            }}>
              <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 16, flex: 1, textAlign: 'center' }}>
                取消
              </Text>
            </TouchableWithoutFeedback>
            <View style={{ backgroundColor: 'rgba(237, 237, 237, 1)', width: 1, height: 45 }}></View>
            <TouchableWithoutFeedback onPress={this.updataComfire.bind(this, data)}>
              <Text style={{ color: 'rgba(3, 178, 75, 1)', fontSize: 16, flex: 1, textAlign: 'center' }}>
                确认
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Overlay.PopView>
    )
  };

  updataComfire = async (data) => {
    let that = this
    that.hidePopu()
    const downloadDest = `${RNFS.DocumentDirectoryPath}/app.apk`;

    const options = {
      fromUrl: data.UrlAndroid,    //更新包的地址 
      toFile: downloadDest,  //下载后保存的地址
      progressInterval: 100,
      progress: (res) => {
        let num = ((res.bytesWritten / res.contentLength) * 100).toFixed(0)
        console.debug(num)
        that.setState({
          progressNum: num
        })
      },
      begin: (res) => {
        that.showUpDataCustom()
      }
    };
    const ret = RNFS.downloadFile(options);
    ret.promise.then(res => {

      that.hideUpdataCustom()

      //下载成功
      NativeModules.ReactNativeUtils.installApp(downloadDest, (res) => {
        if (res == 0) {
          // 安装成功
          NativeModules.ReactNativeUtils.findRealm('all', 'realmSuccess')
        }
      });
    }).catch(err => {
      console.debug('err-------', err)
      NativeModules.ReactNativeUtils.findRealm('all', 'realmSuccess')
    });
  }

  //获取数量
  getChainNum = async (item) => {
    let chainList = []
    if (item.chainName == 'KTO') {
      let dataList = await this.getKTONum(item)
      console.debug('接口查询数据', dataList)
      if (dataList.length > 0) {
        chainList = dataList
      } else {
        chainList = await mulcall.ktoBalance(item.chainList, item.address)
      }
    } else if (item.chainName == 'ETH') {
      chainList = await mulcall.ethBalance(item.chainList, item.address)
    } else if (item.chainName == 'BSC') {
      chainList = await mulcall.bscBalance(item.chainList, item.address)
    }

    item.chainList = chainList

    if (this.state.walletInfo.key == item.key) {
      this.setState({
        tokenList: chainList,
        isRefreshing: false
      }, () => {
        NativeModules.ReactNativeUtils.replaceRealm(this.state.walletInfo.key, JSON.stringify(item))
      })
    } else {
      console.debug('钱包切换了，重新查询')
      this.getChainNum(this.state.walletInfo)
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
    if (this.subscription2) {
      this.subscription2.remove()
    }
  }

  //KTO 获取数量 
  getKTONum = async (item) => {
    let contract = ''
    item.chainList.forEach(item => {
      if (item.contract == '0xE388eb6aaBA54412c979564d6aC0537A8AB37f6D') {
        contract += (item.name + ',')
      } else {
        contract += (item.contract + ',')
      }
    });

    try {
      let formData = new FormData();
      formData.append("addr", item.address);
      formData.append("symbols", contract.substring(0, contract.length - 1));
      let res = await getSymbolBalances(formData)
      if (res.errCode == 0) {
        let dataList = []
        for (let x = 0; x < item.chainList.length; x++) {
          let contract = item.chainList[x]
          res.data.forEach(_item => {
            if (_item.Symbol == contract.contract) {
              dataList.push({
                contract: contract.contract,
                decimal: contract.decimal,
                name: contract.name,
                num: parseFloat(parseFloat(_item.Amount).toFixed(6)).toString()
              })
            } else if (_item.Symbol == contract.name) {
              dataList.push({
                contract: contract.contract,
                decimal: contract.decimal,
                name: contract.name,
                num: parseFloat(parseFloat(_item.Amount).toFixed(6)).toString()
              })
            }
          });
        }
        return dataList
      } else {
        return []
      }
    } catch (error) {
      return []
    }
  }

  //设定主链
  getChain = async () => {
    let ktoRpcUrl = await storage.get(global.KTORpc)
    if (ktoRpcUrl == undefined) {
      global.decimal = '11'
      storage.set(global.KTORpc, {
        chainId: 2559,
        rpcUrl: 'https://www.kortho-chain.com'
      })
    }

    let bscRpcUrl = await storage.get(global.BSCRpc)
    if (bscRpcUrl == undefined) {
      global.bscDecimal = '18'
      storage.set(global.BSCRpc, {
        chainId: 56,
        rpcUrl: 'https://bsc-dataseed.binance.org'
      })
    }

    let ethRpcUrl = await storage.get(global.ETHRpc)
    if (ethRpcUrl == undefined) {
      global.ethDecimal = '18'
      storage.set(global.ETHRpc, {
        chainId: 1,
        rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
      })
    }
  }

  //隐藏数量
  onHideWallet = () => {
    this.setState({
      showCreatPopu: true
    })
  }

  //显示钱包列表
  onShowWalletPopu = () => {
    this.setState({
      showWalletPopu: true
    })
  }

  // 复制
  copyString(str) {
    if (!str) return
    if (this.state.walletInfo.chainName == 'KTO') {
      Clipboard.setString('Kto0' + str.slice(2))
    } else {
      Clipboard.setString(str)
    }

    Toast.message('复制成功')
  }

  //扫一扫
  async onNavCamera(item) {
    let { status } = await Camera.requestCameraPermissionsAsync();

    if (status === 'granted') {
      this.props.navigation.push(item, {
        screen: item,
        params: {
          chain: this.state.tokenList[0],
          walletInfo: this.state.walletInfo,
          type: true
        },
      });
    } else {
      Toast.message('没有相机权限,无法打开相机')
    }
  }

  //页面跳转
  onNavPage = (item) => {
    if (item == 'AssetsMannager') {
      this.props.navigation.push(item, {
        screen: item,
        params: {
          name: this.state.walletInfo.chainName,
          key: this.state.walletInfo.key,
          returnTag: () => {
            NativeModules.ReactNativeUtils.findRealm('ALL', 'findSuccess')
          },
        },
      });
      return
    } else if (item == 'Transfer' || item == 'QRcodePay') {
      this.props.navigation.push(item, {
        screen: item,
        params: {
          chain: this.state.tokenList[0],
          walletInfo: this.state.walletInfo
        },
      });
      return;
    } else if (item == 'WalletDetail') {
      this.props.navigation.push(item, {
        screen: item,
        params: {
          walletInfo: this.state.walletInfo,
          returnTag: () => {
            console.debug('钱包修改')
            NativeModules.ReactNativeUtils.findRealm('ALL', 'findSuccess')
          },
        },
      });
      return;
    }

    this.props.navigation.push(item);
  }

  //代币详情
  onItemNavPage = (item) => {
    this.props.navigation.push('TransferList', {
      screen: 'TransferList',
      params: {
        chain: item,
        walletInfo: this.state.walletInfo,
        returnTag: () => {
          console.debug('删除代币')
          NativeModules.ReactNativeUtils.findRealm('ALL', 'findSuccess')
        },
      },
    });
  }

  //刷新 
  _onRefresh = () => {
    // 不处于 下拉刷新 
    if (!this.state.isRefresh) {
      this._getHotList()
    }
  }

  _getHotList = () => {
    this.setState({
      isRefreshing: true,
    }, () => {
      this.getChainNum(this.state.walletInfo)
    });
  }

  render() {
    let { walletInfo, tokenList, showWalletPopu, showCreatPopu } = this.state;

    const shadowOpt = {
      width: screenWidth,
      height: 172,
      paddingLeft: 100,
      color: "#03B24B",
      border: 10,
      radius: 12,
      opacity: 0.08,
      x: 30,
      y: 10,
      side: 'bottom',
      style: {}
    }

    let tokenListItem = ({ item }) => {
      return (
        <TouchableWithoutFeedback onPress={this.onItemNavPage.bind(this, item)}>
          <View style={{
            backgroundColor: '#fff', display: 'flex', flexDirection: 'column', height: 60
          }}>
            <View style={{
              backgroundColor: '#fff', display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
              height: 59, alignItems: 'center', marginLeft: 16, marginRight: 16
            }}>
              <View style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

                {
                  walletInfo.chainName == 'KTO' ? (
                    item.name == 'KTO' ? (
                      <Image style={{ width: 36, height: 36, borderRadius: 36 }} source={require('../assets/img/ic_kto.png')} />
                    ) : (
                      <View>
                        <CustomImage uri={'http://www.unionminer.cc:8033/static/image/' + item.contract + '.png'} style={{ width: 36, height: 36, borderRadius: 36 }}
                          errImage={require('../assets/img/ic_kto_nor.png')} />
                      </View>
                    )
                  ) : (
                    walletInfo.chainName == 'ETH' ? (

                      item.name == 'ETH' ? (
                        <Image style={{ width: 36, height: 36, borderRadius: 36 }} source={require('../assets/img/ic_eth.png')} />
                      ) : (
                        <Image style={{ width: 36, height: 36, borderRadius: 36 }} source={require('../assets/img/ic_eth_nor.png')} />
                      )
                    ) : (
                      item.name == 'BNB' ? (
                        <Image style={{ width: 36, height: 36, borderRadius: 36 }} source={require('../assets/img/ic_bnb.png')} />
                      ) : (
                        <CustomImage uri={'http://www.unionminer.cc:8033/static/image/' + item.contract + '.png'} style={{ width: 36, height: 36, borderRadius: 36 }}
                          errImage={require('../assets/img/ic_bnb_nor.png')} />
                      )
                    ))
                }

                <Text style={{ color: '#222C41', fontSize: 17, fontWeight: 'bold', marginLeft: 12 }}>
                  {item.name}
                </Text>
              </View>

              <Text style={{ color: '#222C41', fontSize: 22 }}>
                {item.num}
              </Text>

            </View>
            <View style={{ backgroundColor: 'rgba(235, 235, 240, 1)', height: 1, flex: 1, marginLeft: 60 }} ></View>
          </View>
        </TouchableWithoutFeedback>
      )
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar
          animated={false} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <View style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
          height: 44, alignContent: 'center', marginTop: 30, paddingLeft: 16, paddingRight: 16
        }}>
          <TouchableWithoutFeedback onPress={this.onShowWalletPopu.bind(this)}>
            <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: -10, marginTop: -5 }}>
              <Image style={{ width: 24, height: 24 }} source={require('../assets/img/ic_more_48px_black.png')} />
            </View>
          </TouchableWithoutFeedback>
          <Text style={{ color: 'rgba(51, 54, 61, 1)', fontSize: 18, fontWeight: 'bold' }}>
            资产
          </Text>
          <TouchableWithoutFeedback onPress={this.onNavCamera.bind(this, 'SaoYiSao')}>
            <Image style={{ width: 24, height: 24, marginLeft: 10 }} source={require('../assets/img/ic_sys_48px_black.png')} />
          </TouchableWithoutFeedback>
        </View>

        {/* 背景 */}
        <BoxShadow setting={shadowOpt}>
          <ImageBackground style={{ height: 172, marginLeft: 16, marginRight: 16 }}
            source={require('../assets/img/ic_home.png')} imageStyle={{ borderRadius: 12 }}>
            {/* 隐藏 钱包 扫一扫 */}
            <View style={{
              marginTop: 8, height: 32, display: 'flex', flexDirection: 'row', alignItems: 'center',
              justifyContent: 'space-between', marginLeft: 24, marginRight: 24
            }}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'PingFangSC-Regular' }}>
                  我的资产
                </Text>
                <TouchableWithoutFeedback onPress={this.onHideWallet.bind(this)}>
                  <Image style={{ width: 17, height: 17, marginLeft: 5 }} source={require('../assets/img/ic_hide_34px.png')} />
                </TouchableWithoutFeedback>
              </View>
              <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, 'WalletDetail')}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 14 }}>
                    详情
                  </Text>
                  <Image style={{ width: 6.5, height: 12, marginLeft: 5 }} source={require('../assets/img/ic_right_white.png')} />
                </View>
              </TouchableWithoutFeedback>
            </View>

            {/* 数量 */}
            <Text style={{
              fontSize: 40, height: 44, fontFamily: 'Ubuntu', fontWeight: 'bold',
              color: '#fff', marginLeft: 24, marginRight: 24
            }}>
              {tokenList[0].num == undefined ? 0 : tokenList[0].num}
            </Text>

            {/* 地址 */}
            <TouchableWithoutFeedback onPress={this.copyString.bind(this, walletInfo.address)}>
              <View style={{
                marginTop: 8, height: 28, display: 'flex', flexDirection: 'row', alignItems: 'center',
                marginLeft: 24, marginRight: 24
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

            {/* 转账 收款 更多 */}
            <View style={{
              display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly',
              alignItems: 'center', height: 44, marginTop: 8,
            }}>
              <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, 'Transfer')} >
                <View style={{
                  display: 'flex', flexDirection: 'row', alignItems: 'center',
                }}>
                  <Image style={{ width: 24, height: 24 }} source={require('../assets/img/ic_transfor_30px.png')} />
                  <Text style={{ marginLeft: 2, fontSize: 16, color: '#fff' }}>
                    转账
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <View style={{ width: 1, height: 24, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}></View>
              <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, 'QRcodePay')}>
                <View style={{
                  display: 'flex', flexDirection: 'row', alignItems: 'center',
                }}>
                  <Image style={{ width: 24, height: 24 }} source={require('../assets/img/ic_pay_30px.png')} />
                  <Text style={{ marginLeft: 2, fontSize: 16, color: '#fff' }}>
                    收款
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </ImageBackground>
        </BoxShadow>

        <View style={{
          height: 40, marginTop: 12, display: 'flex', flexDirection: 'row', alignItems: 'center',
          justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16
        }}>
          <Text style={{ color: '#222C41', fontSize: 17, fontWeight: 'bold' }}>
            资产
          </Text>
          <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, 'AssetsMannager')}>
            <Image style={{ width: 22, height: 22 }} source={require('../assets/img/ic_add_gray_46px.png')} />
          </TouchableWithoutFeedback>
        </View>

        {/* 列表 */}
        <FlatList
          data={tokenList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={tokenListItem}
          showsVerticalScrollIndicator={false}
          onRefresh={this._onRefresh.bind(this)}
          refreshing={this.state.isRefreshing} />

        <CustomAlertDialog
          show={showWalletPopu}
          closeModal={(show) => {
            this.setState({
              showWalletPopu: show
            })
          }}
          seleChain={(item) => {
            console.debug('选择钱包')

            this.setState({
              walletInfo: item,
              showWalletPopu: false
            }, () => {
              NativeModules.ReactNativeUtils.findRealm('ALL', 'findSuccess')
            })

          }}
          navigationTo={(name) => {
            this.setState({
              showWalletPopu: false,
              showCreatPopu: true,
              createWalletType: name
            })
          }}
        />

        <CreatWalletPopu
          show={showCreatPopu}
          closeModal={(show) => {
            this.setState({
              showCreatPopu: show
            })
          }}
          navigationTo={(name) => {
            this.setState({
              showCreatPopu: false
            })
            'ImportWallet'
            this.props.navigation.navigate(name, {
              screen: name,
              params: { name: this.state.createWalletType },
            });
          }}
        />
      </View>
    );
  }
}

let screenWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
})
export default HomeScreen;
