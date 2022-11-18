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
import { contractQueryApi, getTokenSymbolList } from "../api/api";
import { Toast, Theme, Overlay } from 'teaset';
import LazyImage from 'animated-lazy-image';

let popuKey = null;

class AssetsMannagerScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      key: '',
      searchList: [],
      tokenList: [
        // {
        //   ContractAddr: '',
        //   Total: 0,
        //   Name: '',
        //   Symbol: 'a',
        //   Deci: 6
        // }
      ],
    }
    this.subscription = null
    this.subscription1 = null
  }

  componentDidMount() {

    if (Platform.OS === 'android') {
      this.subscription1 = DeviceEventEmitter.addListener('addEvent', (res) => {
        let data = JSON.parse(res.mapBean)
        if (data) {
          Toast.message('操作成功')
          this.props.route.params.params.returnTag();
        } else {
          Toast.message('操作失败，请重试')
        }
      });

      this.subscription = DeviceEventEmitter.addListener('realmSuccess', (res) => {
        let data = JSON.parse(res.mapBean)
        let list = []
        let chainList = this.state.searchList
        for (const item of data) {
          if (item.choose) {
            list = item.chainList
          }
        }

        for (const myChain of list) {
          for (let i = 0; i < chainList.length; i++) {
            if (myChain.contract == chainList[i].ContractAddr) {
              chainList[i].select = true
            }
          }
        }

        this.setState({
          tokenList: chainList,
          searchList: chainList
        })

        this.hideCustom()
      });
    }

    console.debug(this.props.route.params.params.name)

    if (this.props.route.params.params.name == 'KTO') {
      this.showCustom()
      this.getContractList()
    } else if (this.props.route.params.params.name == 'BSC') {
      this.showCustom()
      this.getBSCContractList()
    }

    this.setState({
      key: this.props.route.params.params.key
    })
  }

  overlayCustomView = (
    <Overlay.View
      style={{ alignItems: 'center', justifyContent: 'center' }}
      modal={true}
      overlayOpacity={0.1}
    >
      <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center' }}>
        <ActivityIndicator size='large' color={Theme.toastIconTintColor} />
        <Text>
          请稍后
        </Text>
      </View>
    </Overlay.View>
  );

  showCustom() {
    popuKey = Overlay.show(this.overlayCustomView);
  }

  hideCustom() {
    Overlay.hide(popuKey)
  }

  async getBSCContractList() {
    if (this.isRequesting) return
    this.isRequesting = true
    try {
      let formData = new FormData();
      formData.append("netWork", 'BSC');
      let res = await getTokenSymbolList(formData)
      console.debug(res)
      if (res.errCode == 0) {
        this.setState({
          searchList: res.data
        }, () => {
          this.isRequesting = false
          NativeModules.ReactNativeUtils.findRealm('ALL', 'realmSuccess')
        })
      } else {
        this.isRequesting = false
      }
    } catch (error) {
      this.isRequesting = false
    }
  }

  async getContractList() {
    if (this.isRequesting) return
    this.isRequesting = true
    try {
      let res = await contractQueryApi()
      console.debug(res)
      if (res.errCode == 0) {
        this.setState({
          searchList: res.data
        }, () => {
          this.isRequesting = false
          NativeModules.ReactNativeUtils.findRealm('ALL', 'realmSuccess')
        })
      } else {
        this.isRequesting = false
      }
    } catch (error) {
      this.isRequesting = false
    }

  }


  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
    if (this.subscription1) {
      this.subscription1.remove()
    }
  }


  //搜索
  onSearch = (text) => {
    let listData = this.state.searchList

    if (text.text == '') {
      console.debug('无内容')
      this.setState({
        tokenList: listData
      })
      return
    }

    let list = this.state.searchList
    let data = []

    for (const item of list) {
      if (item.ContractAddr.includes(text.text)) {
        data.push(item)
      }

      if (item.Name.includes(text.text) && data.indexOf(item) == -1) {
        data.push(item)
      }
    }

    this.setState({
      tokenList: data
    })
  }

  //添加token
  onSeleToken = (item, index) => {
    let newList = this.state.tokenList

    if (!item.select) {
      newList[index].select = true
    } else {
      newList[index].select = false
    }

    console.debug(newList[index])

    this.setState({
      tokenList: newList,
      searchList: newList
    })

    let chain = {
      contract: item.ContractAddr,
      name: item.Symbol,
      decimal: item.Deci,
      num: '0'
    }

    NativeModules.ReactNativeUtils.operateChain(this.state.key, JSON.stringify(chain), item.select);
  }

  //页面跳转
  onNavPage = (item) => {
    if (item == '') {
      Toast.message('暂未开放')
      return
    }
    if (item == 'AddChain') {
      this.props.navigation.navigate(item, {
        screen: item,
        params: {
          key: this.state.key
        },
      });

      return
    }

    this.props.navigation.push(item);
  }


  render() {

    let { tokenList } = this.state

    let tokenListItem = ({ item, index }) => {
      return (
        <View style={{
          backgroundColor: '#fff', display: 'flex', flexDirection: 'column', height: 68
        }}>
          <View style={{
            backgroundColor: '#fff', display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
            height: 67, alignItems: 'center', marginLeft: 16, marginRight: 16
          }}>
            <View style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

              <Image style={{ width: 40, height: 40, borderRadius: 40 }}
                source={{ uri: "http://www.unionminer.cc:8033/static/image/" + item.ContractAddr + '.png' }} />

              <View style={{ display: 'flex', flexDirection: 'column', marginLeft: 12 }}> 
                <Text style={{ color: '#222C41', fontSize: 17, fontWeight: 'bold' }}>
                  {item.Symbol}
                </Text> 
                <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
                  {item.ContractAddr.slice(0, 10) + '****' +
                    item.ContractAddr.slice(item.ContractAddr.length - 7, item.ContractAddr.length)}
                </Text>
              </View>
            </View>

            <TouchableWithoutFeedback onPress={this.onSeleToken.bind(this, item, index)}>
              <Image style={{ width: 22, height: 22 }} source={
                item.select ? require('../assets/img/ic_add_22_select.png') : require('../assets/img/ic_add_22_normal.png')
              } />
            </TouchableWithoutFeedback>

          </View>
          <View style={{ backgroundColor: 'rgba(235, 235, 240, 1)', height: 1, flex: 1, marginLeft: 68 }} ></View>
        </View>
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
        <Ctitle name='资产管理'></Ctitle>
        <View style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center',
          height: 32, marginLeft: 16, marginRight: 16, marginTop: 8, marginBottom: 8,
          backgroundColor: 'rgba(18, 16, 69, 0.03)', borderRadius: 22
        }}>
          <Image style={{ marginLeft: 16, width: 16, height: 16 }} source={require('../assets/img/search_30px_gray.png')} />
          <TextInput placeholder='输入 Token 名称或合约地址' style={{ marginLeft: 8, fontSize: 14, flex: 1, }}
            placeholderTextColor={'rgba(183, 191, 204, 1)'} onChangeText={(text) => this.onSearch({ text })} />
        </View>

        <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, 'AddChain')}>
          <View style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
            height: 48, marginLeft: 16, marginRight: 16, alignItems: 'center'
          }}>
            <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 17, }}>
              自定义添加
            </Text>
            <Image style={{ width: 24, height: 24 }} source={require('../assets/img/ic_right_gray.png')} />
          </View>
        </TouchableWithoutFeedback>

        <View style={{ backgroundColor: 'rgba(237, 240, 245, 1)', height: 8 }}></View>

        {
          tokenList.length > 0 ? (
            <FlatList
              data={tokenList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={tokenListItem}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>
                暂无收录
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
    backgroundColor: '#fff'
  },

})

export default AssetsMannagerScreen;
