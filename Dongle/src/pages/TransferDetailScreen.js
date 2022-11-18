import React from 'react';
import {
  View,
  Linking,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Dimensions
} from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { Toast, Theme } from 'teaset';
import QRCode from 'react-native-qrcode-svg'


class TransferDetailScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      walletInfo: {
        chainName: ''
      },
      chain: {
        name: ''
      },
      transferDetail: {
        FromAddr: '',
        ToAddr: '',
        Hash: '',
      }
    }
  }

  componentDidMount() {
    this.setState({
      chain: this.props.route.params.params.chain,
      transferDetail: this.props.route.params.params.transferDetail,
      walletInfo: this.props.route.params.params.walletInfo,
    }, () => {
      console.debug(this.state.transferDetail)
      console.debug(this.state.chain)
      console.debug(this.state.walletInfo)
    })
  }

  componentWillUnmount() {

  }

  // 返回
  onBack = () => {
    this.props.navigation.goBack()
  }

  //页面跳转
  onNavPage = (item) => {

  }

  // 复制
  copyString(str) {
    if (!str) return
    Clipboard.setString(str)
    Toast.message('复制成功')
  }

  //跳转浏览器
  toWeb = () => {
    let name
    if (this.state.walletInfo.chainName == 'KTO') {
      name = 'https://www.kortho.io/#/Td20/' + this.state.transferDetail.Hash
    } else if (this.state.walletInfo.chainName == 'BSC') {
      name = 'https://www.bscscan.com/tx/' + this.state.transferDetail.Hash
    }

    Linking.canOpenURL(name).then(supported => {
      if (!supported) {
        console.warn('Can\'t handle url: ' + name);
      } else {
        return Linking.openURL(name);
      }
    }).catch(err => console.error('An error occurred', baiduURL));
  }

  render() {
    let { chain, transferDetail, walletInfo } = this.state;

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
              <TouchableOpacity style={[styles.backIcon, { width: px2dp(80), height: px2dp(80), padding: 0, alignItems: 'center', justifyContent: 'center' }]}
                activeOpacity={1} onPress={this.onBack.bind(this)}>
                <Image style={styles.backIcon} source={require('../assets/img/ic_back_white.png')} />
              </TouchableOpacity>
              <Text style={styles.tabName} >
                转账详情
              </Text>
              <View style={[styles.backIcon, { width: px2dp(88), height: px2dp(80), alignItems: 'center', justifyContent: 'center' }]}></View>
            </View>
          </View>

          <View style={{
            marginTop: 10, display: 'flex', flexDirection: 'row',
            justifyContent: 'center', height: 44, alignItems: 'center'
          }}>
            <Text style={{ color: '#fff', fontSize: 40, fontWeight: 'bold' }}>
              {transferDetail.tabActiveIndex == 0 ? '+' : '-'}{parseFloat(parseFloat(transferDetail.Value).toFixed(6)).toString()}
            </Text>
            <Text style={{ color: '#fff', fontSize: 14, marginTop: 20, fontWeight: 'bold', marginLeft: 2 }}>
              {chain.name}
            </Text>
          </View>
        </ImageBackground>

        <View style={{
          flex: 1, marginTop: -90, borderTopRightRadius: 16,
          borderTopLeftRadius: 16, backgroundColor: '#fff',
          paddingLeft: 16, paddingRight: 16, paddingTop: 26
        }}>
          <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 17, fontWeight: 'bold' }}>
            转账进度
          </Text>

          <View style={{ height: 24, marginTop: 18, justifyContent: 'center', display: 'flex' }}>
            <Image style={{
              width: 24, height: 24, position: 'absolute', zIndex: 100, right: 0
            }} source={require('../assets/img/ic_round_green_detail.png')} />

            <View style={{
              backgroundColor: 'rgba(3, 178, 75, 0.3)', height: 4,
              width: Dimensions.get('window').width - 32, position: 'absolute'
            }}></View>

            {
              transferDetail.Status == 1 && (
                <View style={{
                  backgroundColor: 'rgba(3, 178, 75, 1)', height: 4, zIndex: 50,
                  width: (Dimensions.get('window').width - 32), position: 'absolute'
                }} />
              )
            }

          </View>

          <View style={{
            marginTop: 4, justifyContent: 'space-between',
            alignItems: 'center', height: 28, flexDirection: 'row'
          }}>
            <Text style={{ color: transferDetail.Status == 1 ? 'rgba(34, 44, 65, 1)' : 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
              发起转账
            </Text>
            <Text style={{ color: transferDetail.Status == 1 ? 'rgba(34, 44, 65, 1)' : 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
              {transferDetail.Status == 1 ? '转账成功' : '等待中'}
            </Text>
          </View>

          <View style={{
            marginTop: 34, height: 36, flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
              发送方
            </Text>
            <TouchableWithoutFeedback onPress={this.copyString.bind(this, transferDetail.FromAddr)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, }}>
                  {transferDetail.FromAddr.slice(0, 10) + '...' +
                    transferDetail.FromAddr.slice(transferDetail.FromAddr.length - 7, transferDetail.FromAddr.length)}
                </Text>
                <Image style={{ width: 12, height: 12, marginLeft: 8 }} source={require('../assets/img/ic_copy_black.png')} ></Image>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={{
            height: 36, flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
              接收方
            </Text>
            <TouchableWithoutFeedback onPress={this.copyString.bind(this, transferDetail.ToAddr)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, }}>
                  {transferDetail.ToAddr.slice(0, 10) + '...' +
                    transferDetail.ToAddr.slice(transferDetail.ToAddr.length - 7, transferDetail.ToAddr.length)}
                </Text>
                <Image style={{ width: 12, height: 12, marginLeft: 8 }} source={require('../assets/img/ic_copy_black.png')} ></Image>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={{
            height: 36, flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
              矿工费
            </Text>
            <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, }}>
              {transferDetail.Fee} {walletInfo.chainName == 'KTO' ? 'KTO' : walletInfo.chainName == 'BSC' ? 'BNB' : walletInfo.chainName == 'ETH' ? 'ETH' : ''}
            </Text>
          </View>

          <View style={{
            height: 36, flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
              备注
            </Text>
            <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, }}>
              转账
            </Text>
          </View>

          <View style={{ backgroundColor: 'rgba(235, 235, 240, 1)', height: 1, marginBottom: 12, marginTop: 12 }}></View>

          <View style={{
            height: 36, flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
              哈希值
            </Text>
            <TouchableWithoutFeedback onPress={this.copyString.bind(this, transferDetail.Hash)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, }}>
                  {transferDetail.Hash.slice(0, 10) + '...' +
                    transferDetail.Hash.slice(transferDetail.Hash.length - 7, transferDetail.Hash.length)}
                </Text>
                <Image style={{ width: 12, height: 12, marginLeft: 8 }} source={require('../assets/img/ic_copy_black.png')} ></Image>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={{
            height: 36, flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
              区块高度
            </Text>
            <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, }}>
              {transferDetail.BlockNum}
            </Text>
          </View>

          <View style={{
            height: 36, flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
              交易时间
            </Text>
            <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, }}>
              {transferDetail.CreateTime}
            </Text>
          </View>

          <View style={{ alignItems: 'flex-end', marginTop: 12 }}>
            <QRCode
              value={walletInfo.chainName == 'KTO' ? 'https://www.kortho.io/#/Td20/' + transferDetail.Hash :
                walletInfo.chainName == 'ETH' ? 'https://etherscan.io/tx/' + transferDetail.Hash :
                  walletInfo.chainName == 'BSC' ? 'https://www.bscscan.com/tx/' + transferDetail.Hash : '0'}
              size={72}
            />
            <TouchableWithoutFeedback onPress={this.toWeb.bind(this)}>
              <View style={{ height: 24, alignItems: 'center', marginTop: 4 }}>
                <Text style={{ color: 'rgba(54, 76, 128, 1)', fontSize: 12 }}>
                  查询链接 🔗
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={{ marginTop: 16, backgroundColor: 'rgba(235, 235, 240, 1)', height: 1 }}></View>
          <TouchableWithoutFeedback onPress={this.toWeb.bind(this)}>
            <View style={{ alignItems: 'center', height: 36, marginTop: 8 }}>
              <Text style={{ fontSize: 14, color: 'rgba(34, 44, 65, 1)', textDecorationLine: 'underline' }}>
                前往查询详细信息
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View >
      </View >
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

export default TransferDetailScreen;
