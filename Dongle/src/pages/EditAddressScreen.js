import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  DeviceEventEmitter,
  NativeModules,
} from 'react-native'
import Ctitle from '../components/title'
import { Toast, ActionSheet } from 'teaset';

class EditAddressScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addressBean: {

      },
      addressChain: '', //钱包网络
      address: '',       //地址
      addressName: '',    //地址名称
    }

    this.subscription = null
  }

  componentDidMount() {
    this.setState({
      addressBean: this.props.route.params.params.addressBean
    }, () => {

    })

    if (Platform.OS === 'android') {
      this.subscription = DeviceEventEmitter.addListener('operateAddressRealm', (res) => {
        let data = JSON.parse(res.mapBean)
        console.debug(data)
        if (data) {
          Toast.message('操作成功')
          this.props.route.params.params.returnTag();
          this.props.navigation.goBack();
        } else {
          Toast.message('操作失败，请重试')
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
  }

  //页面跳转
  onNavPage = () => {
    if (this.state.address == '') {
      Toast.message('请输入地址')
      return
    }

    if (this.state.addressName == '') {
      Toast.message('请输入地址名称')
      return
    }

    let name = this.state.walletInfo.chainName
    let json = {
      address: this.state.address,
      addressName: this.state.addressName,
      chainName: this.state.addressChain
    }

    NativeModules.ReactNativeUtils.operateAddress(name, JSON.stringify(json))
  }

  setName = (name) => {
    this.setState({
      addressChain: name
    })
  }

  //设置地址
  setToAddress = (text) => {
    if (text != '')
      this.setState({
        address: text.text
      })
  }

  //设置地址名称
  setAddressName = (text) => {
    if (text != '')
      this.setState({
        addressName: text.text
      })
  }

  //显示钱包网络
  onShowPopu = () => {
    let items = [
      {
        title: 'KTO', onPress: () => this.setName('KTO'), disabled: false
      },
      {
        title: 'ETH', onPress: () => this.setName('ETH'), disabled: false
      },
    ];
    let cancelItem = { title: '取消' };
    ActionSheet.show(items, cancelItem);
  }

  render() {
    let { addressBean } = this.state
    return (
      <View style={styles.container}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <Ctitle name='编辑地址'></Ctitle>
        <ScrollView>

          <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, marginTop: 12, marginLeft: 16 }}>
            名称
          </Text>

          <View style={{
            height: 48, marginLeft: 16, marginRight: 16, display: 'flex',
            flexDirection: 'row', alignItems: 'center'
          }}>
            <TextInput placeholder='输入或长按粘贴地址' onChangeText={(text) => this.setToAddress({ text })}
              style={{ fontSize: 17, flex: 1, marginRight: 14 }} />

            <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, '')}>
              <Image style={{ width: 20, height: 20, padding: 10, marginRight: 14 }}
                source={require('../assets/img/ic_sys_48px_black.png')} />
            </TouchableWithoutFeedback>
          </View>
          <View style={{ marginLeft: 16, marginRight: 16, height: 1, backgroundColor: 'rgba(235, 237, 240, 1)' }}></View>


          <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 14, marginTop: 24, marginLeft: 16 }}>
            名称
          </Text>

          <View style={{
            height: 48, marginLeft: 16, marginRight: 16, display: 'flex',
            flexDirection: 'row', alignItems: 'center'
          }}>
            <TextInput placeholder='请输入名称' onChangeText={(text) => this.setAddressName({ text })}
              style={{ fontSize: 17, flex: 1, marginRight: 14 }} />
          </View>
          <View style={{ marginLeft: 16, marginRight: 16, height: 1, backgroundColor: 'rgba(235, 237, 240, 1)' }}></View>

          <View style={{ marginTop: 350, flex: 1, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'column' }}>
            <TouchableOpacity onPress={this.onNavPage.bind(this)}
              style={{
                height: 48, width: 343, backgroundColor: 'rgba(3, 178, 75, 1)',
                marginBottom: 60, borderRadius: 4, alignItems: 'center', justifyContent: 'center'
              }}>
              <Text style={{ fontSize: 17, color: '#fff' }}>
                保存
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    );
  }
}
let screenWidth = Dimensions.get('window').screenWidth

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

})

export default EditAddressScreen;
