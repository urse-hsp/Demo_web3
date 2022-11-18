import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  DeviceEventEmitter,
  NativeModules,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  FlatList
} from 'react-native'
import Ctitle from '../components/title'
import { Toast, ActionSheet } from 'teaset';

class AddressListScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: false,
      walletInfo: {
      },
      addressList: [
        // {
        //   address: '',
        //   addressName: ''
        // }
      ]
    }

    this.subscription = null
  }

  componentDidMount() {
    this.setState({
      walletInfo: this.props.route.params.params.walletInfo,
      type: this.props.route.params.params.type
    }, () => {
      NativeModules.ReactNativeUtils.findAddressRealm(this.state.walletInfo.chainName)
    })

    if (Platform.OS === 'android') {
      this.subscription = DeviceEventEmitter.addListener('addressSuccess', (res) => {
        let data = JSON.parse(res.mapBean)
        this.setState({
          addressList: data
        })
      });
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
  }

  //页面跳转
  onNavPage = (item) => {
    this.props.navigation.push(item, {
      screen: item,
      params: {
        walletInfo: this.state.walletInfo,
        returnTag: () => {
          NativeModules.ReactNativeUtils.findAddressRealm(this.state.walletInfo.chainName)
        },
      },
    });
  }

  onItemClick = (item) => {
    if (this.state.type) {
      this.props.navigation.push('EditAddress', {
        screen: 'EditAddress',
        params: {
          addressBean: item,
        },
      });
    } else {
      this.props.route.params.params.returnTag(item);
      this.props.navigation.goBack();
    }
  }


  render() {
    let { addressList } = this.state

    let tokenListItem = ({ item, index }) => {
      return (
        <TouchableWithoutFeedback onPress={this.onItemClick.bind(this, item)}>
          <View style={{
            backgroundColor: '#fff', display: 'flex', flexDirection: 'column', height: 68
          }}>
            <View style={{
              backgroundColor: '#fff', display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
              height: 67, alignItems: 'center', marginLeft: 16, marginRight: 16
            }}>
              <View style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Image style={{ width: 30, height: 30 }} source={
                  item.chainName == 'KTO' ? require('../assets/img/ic_kto.png') : require('../assets/img/ic_eth.png')
                } />

                <View style={{ flexDirection: 'column', marginLeft: 12, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 17, lineHeight: 24 }}>
                    {item.addressName}
                  </Text>
                  <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14, lineHeight: 20 }}>
                    {item.address.length > 11 ?
                      (item.address.slice(0, 10) + '...' + item.address.slice(item.address.length - 7, item.address.length))
                      : item.address}
                  </Text>
                </View>
              </View>

              <Image style={{ width: 22, height: 22 }} source={require('../assets/img/ic_right_gray.png')} />

            </View>
            <View style={{ backgroundColor: 'rgba(235, 237, 240, 1)', height: 1, flex: 1, marginLeft: 58 }} ></View>
          </View>
        </TouchableWithoutFeedback>
      )
    }


    return (
      <View style={styles.container}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <Ctitle addIcon={true} onRightFunc={this.onNavPage.bind(this, 'AddAddress')} name='地址本'></Ctitle>

        {
          addressList.length > 0 ? (
            <FlatList
              data={addressList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={tokenListItem}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 90 }}>
              <Image style={{ width: 200, height: 200 }} source={require('../assets/img/ic_address_none.png')}></Image>
              <Text style={{ color: 'rgba(183, 191, 204, 1)', fontSize: 14, marginTop: -20 }}>
                暂无地址本，快去添加吧~
              </Text>
              <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, 'AddAddress')}>
                <View style={{
                  width: 200, height: 48, backgroundColor: 'rgba(3, 178, 75, 1)',
                  borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginTop: 20
                }}>
                  <Text style={{ color: '#fff', fontSize: 17 }}>
                    新建地址
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )
        }


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

export default AddressListScreen;
