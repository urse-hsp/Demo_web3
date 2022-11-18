import React from 'react';
import {
  Dimensions,
  Image,
  View,
  TouchableWithoutFeedback,
  Text,
  TextInput,
  StyleSheet,
  NativeModules,
  DeviceEventEmitter,
  ActivityIndicator,
  StatusBar,
  FlatList
} from 'react-native'
import Ctitle from '../components/title'
import CustomImage from '../components/CustomImage'

class ChoosePayChainScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      walletInfo: [],
      chain: {},
      tokenList: [
        {
          // name: 'KTO',
          // contract: '0',
          // img: require('../assets/img/' + 1 + '.png'),
        },
      ],
    }
    this.subscription = null
  }

  componentDidMount() {
    this.setState({
      walletInfo: this.props.route.params.params.walletInfo,
      tokenList: this.props.route.params.params.walletInfo.chainList
    })

  }

  componentWillUnmount() {

  }

  //页面跳转
  onItemNavPage = (item) => {
    this.props.route.params.params.returnTag(item);
    this.props.navigation.goBack();
  }

  render() {
    let { tokenList, walletInfo } = this.state

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
                      <Image style={{ width: 36, height: 36, borderRadius: 36 }}
                        source={{ uri: 'http://165.154.42.138:8033/static/image/' + item.contract + '.png' }} />
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
      <View style={styles.container}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'#fff'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <Ctitle name='选择币种'></Ctitle>

        {
          tokenList.length > 0 ? (
            <FlatList
              style={{ flex: 1 }}
              data={tokenList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={tokenListItem}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>
                暂无币种
              </Text>
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
    backgroundColor: 'rgba(247, 248, 250, 1)'
  },

})

export default ChoosePayChainScreen;
