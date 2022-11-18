import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Image,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native'
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner'
import Ctitle from '../components/title'

const { width, height } = Dimensions.get('window')


class SaoYiSaoScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: Camera.Constants.Type.back,       //照相机类型
      scanned: true, //是否扫描 

    }
    this.subscription = null
  }

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  qrCodeResult = (qrCode) => {
    this.setState({
      scanned: false
    }, () => {
      if (this.props.route.params.params.type) {

        //转账 
        this.props.navigation.replace('Transfer', {
          screen: 'Transfer',
          params: {
            chain: this.props.route.params.params.chain,
            walletInfo: this.props.route.params.params.walletInfo,
            address: qrCode.data
          },
        });

      } else {
        this.props.route.params.params.returnTag(qrCode.data);
        this.props.navigation.goBack();
      }

    })
  }

  //页面跳转
  onNavPage = (item) => {

  }


  render() {
    let { scanned } = this.state
    return (
      <View style={styles.container}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <Ctitle name='扫一扫'></Ctitle>

        <BarCodeScanner
          barCodeTypes={BarCodeScanner.Constants.BarCodeType.qr}
          onBarCodeScanned={scanned ? this.qrCodeResult.bind(this) : undefined}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}>



        </BarCodeScanner>

      </View >
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

})

export default SaoYiSaoScreen;
