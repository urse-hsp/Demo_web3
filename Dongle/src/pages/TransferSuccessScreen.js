import React from 'react';
import {
  View, TouchableWithoutFeedback,
  Text, StyleSheet,
  StatusBar,
  Image,
  Linking,
  Dimensions
} from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { Toast } from 'teaset';
import Ctitle from '../components/title'


class TransferSuccessScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gasUse:'',
      transfer: {
        to: '',
        from: '',
        value: '',
        gasLimit: '',
        hash: ''
      },
      walletInfo: {
        name: ''
      },
      chain: {
        name: ''
      }
    }
  }

  componentDidMount() {
    this.setState({
      transfer: this.props.route.params.params.transfer,
      gasUse:this.props.route.params.params.gasUse,
      walletInfo: this.props.route.params.params.walletInfo,
      chain: this.props.route.params.params.chain
    })
  }

  componentWillUnmount() {

  }

  // 复制
  copyString(str) {
    if (!str) return
    Clipboard.setString(str)
    Toast.message('复制成功') 
  }

  onBackFunc = () => {
    this.props.navigation.goBack()
  }

  //跳转浏览器
  toWeb = () => {
    //只有kto
    let walletInfo = this.state.walletInfo
    let name = ''
    if (walletInfo.chainName == 'KTO') {
      name = 'https://www.kortho.io/#/Td20/' + this.state.transfer.hash.Hash
    } else if (walletInfo.chainName == 'ETH') {
      name = 'https://etherscan.io/tx/' + '0xfd3976921c002b76bee8b4d65ca5497f9d11c0fe1bcc0cd6b7dbd9712c841710'
    } else if (walletInfo.chainName == 'BSC') {
      name = 'https://bscscan.com/tx/' + this.state.transfer.hash
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
    let { transfer, walletInfo, chain ,gasUse} = this.state
    return (
      <View style={styles.container}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />

        <Ctitle onBackFunc={this.onBackFunc.bind(this)} name='转账详情'></Ctitle>

        <View style={{
          width: Dimensions.get('window').width, backgroundColor: '#fff'
        }}>
          <View style={{
            marginLeft: 16, marginRight: 16,
            marginTop: 12, height: 48, flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
              转账金额
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, }}>
                {transfer.value} {chain.name}
              </Text>
            </View>
          </View>
          <View style={{ backgroundColor: '#EFEFEF', marginLeft: 15, width: 1000, height: 0.5 }} />
          <View style={{
            marginLeft: 16, marginRight: 16,
            height: 48, flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
              发送方
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, }}>
                {transfer.from.slice(0, 10) + '...' +
                  transfer.from.slice(transfer.from.length - 7, transfer.from.length)}
              </Text>
            </View>
          </View>
          <View style={{ backgroundColor: '#EFEFEF', marginLeft: 15, width: 1000, height: 0.5 }} />
          <View style={{
            marginLeft: 16, marginRight: 16,
            height: 48, flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
              接收方
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, }}>
                {transfer.to.slice(0, 10) + '...' +
                  transfer.to.slice(transfer.to.length - 7, transfer.to.length)}
              </Text>
            </View>
          </View>
          <View style={{ backgroundColor: '#EFEFEF', marginLeft: 15, width: 1000, height: 0.5 }} />

          <View style={{
            marginLeft: 16, marginRight: 16,
            height: 48, flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
              矿工费
            </Text>
            <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, }}>
              {gasUse} {walletInfo.chainName == 'KTO' ? 'KTO' : walletInfo.chainName == 'ETH' ? 'ETH' : walletInfo.chainName == 'BSC' ? 'BNB' : ''}
            </Text>
          </View>
          <View style={{ backgroundColor: '#EFEFEF', marginLeft: 15, width: 1000, height: 0.5 }} />

          <View style={{
            marginLeft: 16, marginRight: 16,
            height: 48, flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
              哈希值
            </Text>
            <TouchableWithoutFeedback onPress={this.copyString.bind(this, transfer.hash)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, }}>
                  {transfer.hash.slice(0, 10) + '...' +
                    transfer.hash.slice(transfer.hash.length - 7, transfer.hash.length)}
                </Text>
                <Image style={{ width: 12, height: 12, marginLeft: 8 }} source={require('../assets/img/ic_copy_black.png')} ></Image>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ backgroundColor: '#EFEFEF', marginLeft: 15, width: 1000, height: 0.5 }} />

        </View>

        <TouchableWithoutFeedback onPress={this.toWeb.bind(this)}>
          <View style={{ alignItems: 'center', height: 36, marginTop: 20 }}>
            <Text style={{ fontSize: 14, color: 'rgba(34, 44, 65, 1)', textDecorationLine: 'underline' }}>
              前往查询详细信息
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7'
  },

})

export default TransferSuccessScreen;
