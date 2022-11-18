import { Toast } from 'teaset';
import React from 'react';
import {
  Dimensions,
  Image,
  View, TouchableWithoutFeedback,
  Text, StyleSheet,
  StatusBar
} from 'react-native'
import Ctitle from '../components/title'


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

class ChooseWalletNetScreen extends React.Component {

  componentDidMount() {
    this.getWallet()
  }

  //判断当前有无钱包
  async getWallet() {

  }

  //页面跳转
  onNavPage = (item, name) => {

    this.props.navigation.navigate(item, {
      screen: item,
      params: { name: name },
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'#fff'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <Ctitle name='选择网络'></Ctitle>
        <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, 'CreatWallet', 'ALL')}>
          <View style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
            height: 60, alignItems: 'center', paddingLeft: 16, paddingRight: 16,
            backgroundColor: '#fff'
          }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Image style={{ width: 30, height: 30 }} source={require('../assets/img/ic_choose_net.png')}></Image>
              <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 17, marginLeft: 12 }}>身份钱包</Text>
            </View>
            <Image style={{ width: 24, height: 24 }} source={require('../assets/img/ic_right_gray.png')} />
          </View>
        </TouchableWithoutFeedback>
        <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14, marginTop: 12, marginBottom: 12, marginLeft: 16 }}>
          单网络钱包
        </Text>
        <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, 'CreatWallet', 'KTO')}>
          <View style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
            height: 60, alignItems: 'center', paddingLeft: 16, paddingRight: 16,
            backgroundColor: '#fff'
          }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Image style={{ width: 30, height: 30 }} source={require('../assets/img/ic_kto.png')}></Image>
              <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 17, marginLeft: 12 }}>KTO</Text>
            </View>
            <Image style={{ width: 24, height: 24 }} source={require('../assets/img/ic_right_gray.png')} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, 'CreatWallet', 'ETH')}>
          <View style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
            height: 60, alignItems: 'center', paddingLeft: 16, paddingRight: 16,
            backgroundColor: '#fff', marginTop: 1
          }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Image style={{ width: 30, height: 30 }} source={require('../assets/img/ic_eth.png')}></Image>
              <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 17, marginLeft: 12 }}>ETH</Text>
            </View>
            <Image style={{ width: 24, height: 24 }} source={require('../assets/img/ic_right_gray.png')} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, 'CreatWallet', 'BSC')}>
          <View style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
            height: 60, alignItems: 'center', paddingLeft: 16, paddingRight: 16,
            backgroundColor: '#fff', marginTop: 1
          }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Image style={{ width: 30, height: 30, borderRadius: 30 }} source={require('../assets/img/ic_bnb.png')}></Image>
              <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 17, marginLeft: 12 }}>BSC</Text>
            </View>
            <Image style={{ width: 24, height: 24 }} source={require('../assets/img/ic_right_gray.png')} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(235, 236, 237, 1)'
  },

})

export default ChooseWalletNetScreen;
