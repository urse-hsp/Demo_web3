import React from 'react';
import {
  View,
  Dimensions,
  Text, StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
} from 'react-native'
import { Camera } from 'expo-camera';
import Ctitle from '../components/title'
import { Toast, Overlay, Theme } from 'teaset';
import storage from '../utils/storageUtil'
import GasPopu from './Transfer/GasPopu';
import Clipboard from '@react-native-community/clipboard'
import CustomImage from '../components/CustomImage'

const erc20abi = require("../utils/erc20.json")
const { ethers, Wallet } = require("ethers");

let WALLET = undefined;
let contractWithSigner = false;
let popuKey = undefined
let provider = undefined

class TransferScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      walletInfo: {},
      chain: {},
      transfer: {
        to: '',
        from: '',
        value: '',
        gasLimit: ''
      },
      blockChain: {},
      showPopu: false,
      toAddress: '',
      value: '',
      market: '',
      numValue: '',
      pwd: ''
    }
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

  // 复制
  copyString(str) {
    if (!str) return
    Clipboard.setString(str)
    Toast.message('复制成功')
  }

  componentDidMount() {
    this.setState({
      walletInfo: this.props.route.params.params.walletInfo,
      chain: this.props.route.params.params.chain,
      toAddress: this.props.route.params.params.address ? this.props.route.params.params.address : ''
    }, () => {
      this.getChain()
    })
  }

  componentWillUnmount() {
    contractWithSigner = undefined
  }

  async getChain() {
    let blockChain
    let chain = this.state.walletInfo
    if (chain.chainName == 'KTO') {
      blockChain = await storage.get(global.KTORpc)
    } else if (chain.chainName == 'BSC') {
      blockChain = await storage.get(global.BSCRpc)
    } else if (chain.chainName == 'ETH') {
      blockChain = await storage.get(global.ETHRpc)
    }

    console.debug('block', blockChain)
    this.setState({
      blockChain: blockChain.value
    }, () => {
      console.debug('初始化')
      while (!contractWithSigner) {
        console.debug(contractWithSigner)
        provider = new ethers.providers.JsonRpcProvider(this.state.blockChain.rpcUrl)
        WALLET = new ethers.Wallet(this.state.walletInfo.privateKey, provider)

        let contract = new ethers.Contract(this.state.chain.contract, erc20abi, provider);
        contractWithSigner = contract.connect(WALLET);
        console.debug('链接钱包成功')
      }
    })
  }

  //获取gas费
  async getGasLimit() {
    if (!contractWithSigner) {
      Toast.message('当前节点可能较为缓慢，请切换节点或稍后再试')
      this.popuHidden()
      return
    }

    let walletInfo = this.state.walletInfo
    let chain = this.state.chain
    let toAddress = this.state.toAddress

    let gasLimit = 0
    let gasUse = 0

    if (toAddress.indexOf('Kto0') != -1) {
      toAddress = toAddress.replace('Kto0', "0x");
    }

    let tx = {
      to: toAddress,
      value: ethers.utils.parseEther(this.state.value),
    }


    let gasPrcie = await provider.getGasPrice()

    try {
      if (walletInfo.chainName == 'KTO') {
        //KTO
        gasLimit = (21000 / 1e9).toString()

        gasUse = 21000 * 100 / 1e9
        // if (chain.contract == '0xE388eb6aaBA54412c979564d6aC0537A8AB37f6D') {
        //   let gasHex = await WALLET.estimateGas(tx);
        //   if (chain.decimal != undefined || chain.decimal != '') {
        //     gasLimit = ethers.utils.formatUnits(gasHex, chain.decimal)
        //   } else {
        //     gasLimit = ethers.utils.formatEther(gasHex)
        //   }
        // } else {
        //   console.debug('子币')
        //   let gasHex = await contractWithSigner
        //     .estimateGas.transfer(toAddress, ethers.utils.parseUnits(this.state.value, chain.decimal))

        //   gasLimit = ethers.utils.formatUnits(gasHex, global.decimal)
        //   console.debug('gasLimit', gasLimit)
        // }
      } else if (walletInfo.chainName == 'ETH') {
        console.debug('decimal ----- ', global.ethDecimal)
        //ETH
        if (chain.contract == '0xeefba1e63905ef1d7acba5a8513c70307c1ce441') {

          let gasHex = await WALLET.estimateGas(tx);
          gasUse = gasHex * (gasPrcie / 1e9) / 1e9
          gasLimit = ethers.utils.formatEther(gasHex)

        } else {
          console.debug('子币')
          let gasHex = await contractWithSigner.estimateGas
            .transfer(toAddress, ethers.utils.parseUnits(this.state.value, chain.decimal))
          gasUse = gasHex * (gasPrcie / 1e9) / 1e9
          gasLimit = ethers.utils.formatUnits(gasHex, 18)
        }
      } else if (walletInfo.chainName == 'BSC') {

        console.debug('decimal ----- ', global.bscDecimal)
        //BSC
        if (chain.contract == '0xB8c77482e45F1F44dE1745F52C74426C631bDD52') {

          let gasHex = await WALLET.estimateGas(tx);
          gasUse = gasHex * (gasPrcie / 1e9) / 1e9
          gasLimit = ethers.utils.formatEther(gasHex)
        } else {
          console.debug('子币')

          let gasHex = await contractWithSigner.estimateGas
            .transfer(toAddress, ethers.utils.parseUnits(this.state.value, chain.decimal))
          gasUse = gasHex * (gasPrcie / 1e9) / 1e9
          gasLimit = ethers.utils.formatUnits(gasHex, 18)
        }
      }
    } catch (error) {
      this.popuHidden()
      Toast.message('Gas获取失败，请稍后再试')
      console.debug('error', error)
      return
    }

    let txRes = {
      from: this.state.walletInfo.address,
      to: toAddress,
      value: this.state.value,
      gasLimit: gasLimit,
      chainName: this.state.chain.name,
      gasUse: gasUse
    };

    this.setState({
      transfer: txRes,
      showPopu: true,
    }, () => {
      this.popuHidden()
    })
  }

  // 转账
  async goPay() {
    let walletInfo = this.state.walletInfo
    let chain = this.state.chain
    let transfer = this.state.transfer

    console.debug(chain)

    if (transfer.to.indexOf('Kto0') != -1) {
      transfer.to = transfer.to.replace('Kto0', "0x");
    }

    let tx = {
      to: transfer.to,
      from: transfer.from,
      value: ethers.utils.parseEther(transfer.value),
      gasLimit: ethers.utils.parseUnits(transfer.gasLimit, chain.decimal)
    }

    console.debug('tx', tx)

    let that = this

    try {
      if (walletInfo.chainName == 'KTO') {
        //KTO
        if (chain.contract == '0xE388eb6aaBA54412c979564d6aC0537A8AB37f6D') {
          let txRes = await WALLET.sendTransaction(tx);
          console.debug('txRes', txRes)
          that.shouSuccessPoup(txRes)
        } else {
          let txRes = await contractWithSigner.transfer(tx.to, ethers.utils.parseUnits(transfer.value, chain.decimal))
          console.debug('txRes', txRes)
          that.shouSuccessPoup(txRes)
        }
      } else if (walletInfo.chainName == 'TEH') {
        //ETH
        if (chain.contract == '0xeefba1e63905ef1d7acba5a8513c70307c1ce441') {

          let txRes = await WALLET.sendTransaction(tx);
          console.debug(txRes)
          that.shouSuccessPoup(txRes)

        } else {
          let txRes = await contractWithSigner.transfer(tx.to, ethers.utils.parseUnits(transfer.value, chain.decimal))
          console.debug('txRes', txRes)
          that.shouSuccessPoup(txRes)
        }
      } else if (walletInfo.chainName == 'BSC') {
        //BSC
        if (chain.contract == '0xB8c77482e45F1F44dE1745F52C74426C631bDD52') {

          let txRes = await WALLET.sendTransaction(tx);
          console.debug(txRes)
          that.shouSuccessPoup(txRes)

        } else {
          let txRes = await contractWithSigner.transfer(tx.to, ethers.utils.parseUnits(transfer.value, chain.decimal))
          console.debug(txRes)
          that.shouSuccessPoup(txRes)
        }
      }

      this.setState({
        toAddress: '',
        numValue: ''
      }, () => {
        Toast.message('转账中，请稍后查看转账列表')
      })
    } catch (error) {

      console.debug('err------', error)

      this.setState({
        toAddress: '',
        numValue: ''
      }, () => {
        Toast.message('转账中，请稍后查看转账列表')
        that.shouErrorPoup(error)
      })
    }


    this.popuHidden()
  }

  //转账信息弹窗
  shouSuccessPoup = (tx) => {
    console.debug(tx);
    this.popuHidden()
    this.transferView(tx);
  }

  //转账信息错误
  shouErrorPoup = (error) => {
    this.popuHidden()
    if (error.returnedHash) {
      console.debug('returnedHash=', error.returnedHash)
      this.transferView({ hash: error.returnedHash });
    } else {
      this.transferView({ hash: '' });
    }
  }

  transferView = (tx) => {
    let transfer = this.state.transfer
    transfer.hash = tx.hash

    this.props.navigation.replace('TransferSuccess', {
      screen: 'TransferSuccess',
      params: {
        transfer: transfer,
        gasUse: this.state.transfer.gasUse,
        walletInfo: this.state.walletInfo,
        chain: this.state.chain
      },
    });
  }

  pwdView = (
    <Overlay.PopView
      modal={true}
      style={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <View style={{
        backgroundColor: '#fff', minWidth: 320, minHeight: 174,
        borderRadius: 20, alignItems: 'center', justifyContent: 'flex-end'
      }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 16, marginTop: 24, fontWeight: 'bold' }}>
            请输入密码
          </Text>
          <View style={{
            backgroundColor: 'rgba(247, 248, 250, 1)', borderWidth: 1, marginTop: 16,
            borderColor: 'rgba(235, 238, 245, 1)', width: 250, height: 38, borderRadius: 4
          }}>
            <TextInput style={{ flex: 1, marginLeft: 16, marginRight: 16, justifyContent: 'center' }}
              placeholder='输入钱包密码' onChangeText={(text) => this.setPwd({ text })} secureTextEntry={true}></TextInput>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: 'rgba(237, 237, 237, 1)', width: 320 }}></View>
        <View style={{ height: 48, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <TouchableWithoutFeedback onPress={this.popuHidden.bind(this)}>
            <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 16, flex: 1, textAlign: 'center' }}>
              取消
            </Text>
          </TouchableWithoutFeedback>
          <View style={{ backgroundColor: 'rgba(237, 237, 237, 1)', width: 1, height: 45 }}></View>
          <TouchableWithoutFeedback onPress={this.editComfire.bind(this)}>
            <Text style={{ color: 'rgba(3, 178, 75, 1)', fontSize: 16, flex: 1, textAlign: 'center' }}>
              确认
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Overlay.PopView>
  );

  setPwd = (text) => {
    if (text != '') {
      this.setState({
        pwd: text.text
      })
    }
  }

  popuHidden() {
    Overlay.hide(popuKey)
  }

  //确认密码
  editComfire() {
    console.debug(this.state.walletInfo.password)
    console.debug(this.state.pwd)
    if (this.state.walletInfo.password == this.state.pwd) {
      Overlay.hide(popuKey)
      this.showCustom()
      this.goPay()
    } else {
      Toast.message('密码错误，请重试')
    }
  }

  //确认交易
  onTransfer = () => {
    this.setState({
      showPopu: false
    })

    popuKey = Overlay.show(this.pwdView);
  }

  //页面跳转
  onNavPage = (item) => {
    if (item == 'ChoosePayChain') {
      this.props.navigation.push(item, {
        screen: item,
        params: {
          walletInfo: this.state.walletInfo,
          returnTag: (tag) => {
            this.setState({
              chain: tag
            }, () => {
              contractWithSigner = false
              this.getChain()
            });
          },
        },
      });
      return
    } else if (item == 'AddressList') {
      this.props.navigation.push(item, {
        screen: item,
        params: {
          chain: this.state.chain,
          walletInfo: this.state.walletInfo,
          returnTag: (address) => {
            this.setState({ toAddress: address.address });
          },
        },
      });
      return
    } else if (item == 'SaoYiSao') {
      this.onNavCamera(item)
      return
    }

    if (this.state.toAddress == '') {
      Toast.message('请输入转账地址')
      return
    }

    if (this.state.value == '') {
      Toast.message('请输入数量')
      return
    }

    this.showCustom()
    this.getGasLimit();

  }

  //扫一扫
  async onNavCamera(item) {
    let { status } = await Camera.requestCameraPermissionsAsync();

    if (status === 'granted') {
      this.props.navigation.push(item, {
        screen: item,
        params: {
          returnTag: (address) => {
            this.setState({
              toAddress: address
            });
          },
        },
      });
    } else {
      Toast.message('没有相机权限,无法打开相机')
    }
  }

  //设置地址
  setToAddress = (text) => {
    if (text != '')
      this.setState({
        toAddress: text.text
      })
  }

  //设置数量
  setValue = (text) => {
    if (text != '')
      if (parseFloat(text.text) > parseFloat(this.state.chain.num)) {
        this.setState({
          value: this.state.chain.num,
          numValue: this.state.chain.num
        })
      } else {
        this.setState({
          value: text.text,
          numValue: text.text
        })
      }
  }

  //设置备注
  setMarket = (text) => {
    if (text != '')
      this.setState({
        market: text.text
      })
  }

  //全部
  onAllNum() {
    this.setState({
      numValue: this.state.chain.num,
      value: this.state.chain.num
    })
  }

  render() {
    let { walletInfo, chain, showPopu, transfer, toAddress, numValue } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <Ctitle onRightFunc={this.onNavPage.bind(this, '')} rightIcon={false} name='转账'></Ctitle>
        <ScrollView>
          <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, 'ChoosePayChain')}>
            <View style={{
              marginTop: 12, marginLeft: 16, marginRight: 16, backgroundColor: 'rgba(247, 248, 250, 1)',
              height: 48, borderWidth: 1, borderColor: 'rgba(235, 238, 245, 1)', borderRadius: 4,
              display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
              paddingLeft: 16, paddingRight: 16
            }}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {
                  walletInfo.chainName == 'KTO' ? (
                    chain.name == 'KTO' ? (
                      <Image style={{ width: 36, height: 36, borderRadius: 36 }} source={require('../assets/img/ic_kto.png')} />
                    ) : (
                      <Image style={{ width: 36, height: 36, borderRadius: 36 }}
                        source={{ uri: 'http://165.154.42.138:8033/static/image/' + chain.contract + '.png' }} />
                    )
                  ) : (
                    walletInfo.chainName == 'ETH' ? (

                      chain.name == 'ETH' ? (
                        <Image style={{ width: 36, height: 36, borderRadius: 36 }} source={require('../assets/img/ic_eth.png')} />
                      ) : (
                        <Image style={{ width: 36, height: 36, borderRadius: 36 }} source={require('../assets/img/ic_eth_nor.png')} />
                      )
                    ) : (
                      chain.name == 'BNB' ? (
                        <Image style={{ width: 36, height: 36, borderRadius: 36 }} source={require('../assets/img/ic_bnb.png')} />
                      ) : (
                        <CustomImage uri={'http://www.unionminer.cc:8033/static/image/' + chain.contract + '.png'} style={{ width: 36, height: 36, borderRadius: 36 }}
                        errImage={require('../assets/img/ic_bnb_nor.png')} />
                      )
                    ))
                }

                <Text style={{ marginLeft: 12, fontSize: 17, color: 'rgba(34, 44, 65, 1)', fontWeight: 'bold' }}>
                  {chain.name}
                </Text>
              </View>

              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: 'rgba(183, 191, 204, 1)' }}>
                  选择币种
                </Text>
                <Image style={{ width: 24, height: 24, marginLeft: -8 }} source={require('../assets/img/ic_right_gray.png')} />
              </View>
            </View>
          </TouchableWithoutFeedback>

          <Text style={{ marginLeft: 16, marginTop: 24 }}>
            收款地址
          </Text>
          <View style={{
            height: 48, marginLeft: 16, marginRight: 16, display: 'flex',
            flexDirection: 'row', alignItems: 'center'
          }}>
            <TextInput placeholder='输入或长按粘贴地址' onChangeText={(text) => this.setToAddress({ text })}
              style={{ fontSize: 17, flex: 1, marginRight: 14 }} value={toAddress} />
            <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, 'SaoYiSao')}>
              <Image style={{ width: 20, height: 20, padding: 10, marginRight: 14 }}
                source={require('../assets/img/ic_sys_48px_black.png')} />
            </TouchableWithoutFeedback>
            <View style={{ backgroundColor: 'rgba(235, 237, 240, 1)', height: 16, width: 1 }}></View>

            <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, 'AddressList')}>
              <Image style={{ width: 24, height: 24, padding: 10, marginLeft: 14 }}
                source={require('../assets/img/ic_address_black.png')} />
            </TouchableWithoutFeedback>
          </View>
          <View style={{ marginLeft: 16, marginRight: 16, height: 1, backgroundColor: 'rgba(235, 237, 240, 1)' }}></View>

          <Text style={{ marginLeft: 16, marginTop: 24 }}>
            转账金额
          </Text>
          <View style={{
            height: 48, marginLeft: 16, marginRight: 16, display: 'flex',
            flexDirection: 'row', alignItems: 'center'
          }}>
            <TextInput placeholder='输入数量' onChangeText={(text) => this.setValue({ text })}
              style={{ fontSize: 17, flex: 1, marginRight: 14 }} keyboardType='numeric' value={numValue} />
            < TouchableWithoutFeedback onPress={this.onAllNum.bind(this)}>
              <Text style={{ fontSize: 17, color: 'rgba(34, 44, 65, 1)', fontWeight: 'bold' }}>
                全部
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ marginLeft: 16, marginRight: 16, height: 1, backgroundColor: 'rgba(235, 237, 240, 1)' }}></View>
          <View style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            marginLeft: 16, marginRight: 16, marginTop: 4
          }}>
            <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14 }}>
              可用 {chain.num} {chain.name}
            </Text>

            <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 14 }}>

            </Text>
          </View>

          <Text style={{ marginLeft: 16, marginTop: 24 }}>
            备注
          </Text>
          <View style={{
            height: 48, marginLeft: 16, marginRight: 16, display: 'flex',
            flexDirection: 'row', alignItems: 'center'
          }}>
            <TextInput placeholder='输入备注' onChangeText={(text) => this.setMarket({ text })}
              style={{ fontSize: 17, flex: 1, marginRight: 14 }} />
          </View>
          <View style={{ marginLeft: 16, marginRight: 16, height: 1, backgroundColor: 'rgba(235, 237, 240, 1)' }}></View>

          <View style={{ marginTop: 170, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'column' }}>
            <TouchableOpacity onPress={this.onNavPage.bind(this, '')}
              style={{
                height: 48, width: 343, backgroundColor: 'rgba(3, 178, 75, 1)',
                marginBottom: 60, borderRadius: 4, alignItems: 'center', justifyContent: 'center'
              }}>
              <Text style={{ fontSize: 17, color: '#fff' }}>
                确认
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <GasPopu
          show={showPopu}
          transfer={transfer}
          chainName={walletInfo.chainName}
          closeModal={(show) => {
            this.setState({
              showPopu: show
            })
          }}
          navigationTo={this.onTransfer.bind(this)} />
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

export default TransferScreen;
