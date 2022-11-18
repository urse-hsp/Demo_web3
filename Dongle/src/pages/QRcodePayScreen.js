import React from 'react';
import {
  View,
  Text, StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import { Toast } from 'teaset';
import QRCode from 'react-native-qrcode-svg'
import Clipboard from '@react-native-community/clipboard'

class QRcodePayScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      walletInfo: {},
      chain: {}
    }
  }

  componentDidMount() {
    this.setState({
      walletInfo: this.props.route.params.params.walletInfo,
      chain: this.props.route.params.params.chain
    })

    console.debug(this.props.route.params.params.walletInfo)
    console.debug(this.props.route.params.params.chain)
  }


  // 返回
  onBack = () => {
    this.props.navigation.goBack()
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

  render() {
    let { walletInfo, chain } = this.state;
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
          borderTopColor: 'transparent',
        }}>
          <View style={styles.titleWrap} >
            <TouchableOpacity style={[styles.backIcon, { width: px2dp(80), height: px2dp(80), padding: 0, alignItems: 'center', justifyContent: 'center' }]}
              activeOpacity={1} onPress={this.onBack.bind(this)}>
              <Image style={styles.backIcon} source={require('../assets/img/ic_back_white.png')} />
            </TouchableOpacity>
            <Text style={styles.tabName} >收款</Text>
            <View style={[styles.backIcon, { width: px2dp(88), height: px2dp(80), alignItems: 'center', justifyContent: 'center' }]}></View>
          </View>
        </View>

        <View style={{
          marginTop: 18, marginLeft: 16, marginRight: 16, borderRadius: 16,
          display: 'flex', flexDirection: 'column',
          backgroundColor: 'rgba(255, 255, 255, 1)',
        }}>

          <View style={{
            height: 56, backgroundColor: 'rgba(247, 248, 250, 1)', alignItems: 'center',
            borderTopLeftRadius: 16, borderTopRightRadius: 16, justifyContent: 'center'
          }}>
            <Text style={{ fontSize: 17, color: 'rgba(34, 44, 65, 1)' }}>
              {chain.name}收款地址
            </Text>
          </View>

          <View style={{ alignItems: 'center', marginTop: 34 }}>
            <QRCode
              value={
                walletInfo.chainName == 'KTO' ? (
                  'Kto0' + walletInfo.address.slice(2)
                ) : (
                  walletInfo.address
                )}
              size={178}
            />
          </View>

          <View style={{ alignItems: 'center', marginTop: 12 }}>
            <View style={{
              backgroundColor: 'rgba(233, 237, 245, 1)', borderRadius: 6, width: 262, height: 62,
              alignItems: 'center', justifyContent: 'center'
            }}>
              <Text style={{ marginLeft: 12, marginRight: 12 }}>
                {
                  walletInfo.chainName == 'KTO' ? (
                    'Kto0' + walletInfo.address.slice(2)
                  ) : (
                    walletInfo.address
                  )
                }
              </Text>
            </View>
          </View>

          <TouchableWithoutFeedback onPress={this.copyString.bind(this, walletInfo.address)}>
            <View style={{ alignItems: 'center', justifyContent: 'center', height: 48, marginTop: 20, marginBottom: 24 }}>
              <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 17 }}>
                复制地址
              </Text>
            </View>
          </TouchableWithoutFeedback>

        </View>

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(3, 178, 75, 1)'
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

export default QRcodePayScreen;
