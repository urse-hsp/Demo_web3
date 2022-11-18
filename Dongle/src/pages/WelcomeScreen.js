import React from 'react';
import {
  Dimensions,
  TouchableOpacity,
  View, 
  Image,
  NativeModules,
  Text, 
  StyleSheet,
  StatusBar,
  Button
} from 'react-native'

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

class WelcomeScreen extends React.Component {

  componentDidMount() {

  }

  onNavPage = (item) => {
    this.props.navigation.push(item);
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
        <Image style={{ marginTop: 105, width: 334, height: 334 }} source={require('../assets/img/bg_welcome.png')} />
        <Text style={{ fontSize: FONT_SIZE(30), textAlign: 'center' }}>
          创建一个免费账户
        </Text>
        <View style={{ marginTop: 80, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={this.onNavPage.bind(this, 'ChooseWalletNet')} style={[styles.boardContent_item, { backgroundColor: "rgba(3, 178, 75, 1)" }]}>
            <Text style={styles.bc_Text}>创建钱包</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onNavPage.bind(this, 'ImportWallet')} style={[styles.boardContent_item, { borderColor: 'rgba(216, 220, 229, 1)', backgroundColor: "#fff", borderWidth: 1, marginTop: 15 }]}>
            <Text style={[styles.bc_Text, { color: 'rgba(34, 44, 65, 1)' }]}>导入钱包</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  bc_Text: {
    fontSize: FONT_SIZE(17),
    fontWeight: 'bold',
    color: '#fff',
  },
  boardContent_item: {
    width: 295,
    height: 48,
    backgroundColor: '#0BB27E',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
})

export default WelcomeScreen;
