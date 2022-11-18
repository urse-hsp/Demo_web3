import React from 'react';
import {
  View, TouchableWithoutFeedback,
  Text,
  StatusBar,
  Image,
  PermissionsAndroid,
  NativeModules,
  Dimensions,
  Linking,
  ActivityIndicator,
} from 'react-native'
import Ctitle from '../components/title'
import RNFS from 'react-native-fs';
import { Toast, Overlay, Theme } from 'teaset'

let popuKey = undefined;

class inviteScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

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

  hideCustom() {
    Overlay.hide(popuKey)
  }


  //打开网页
  onOpenUrl = () => {
    let url = 'https://centerk.oss-cn-hongkong.aliyuncs.com/app-release.apk'
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.warn('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred'));
  }

  //下载图片
  downLoadImage() {
    this.showCustom()

    let imageName = new Date().getTime() + 'invite_image.jpeg'

    const downloadDest = `${RNFS.DownloadDirectoryPath}/` + imageName;

    const options = {
      fromUrl: 'https://centerk.oss-cn-hongkong.aliyuncs.com/share.png',
      toFile: downloadDest,  //下载后保存的地址
      progressInterval: 500
    };
    const ret = RNFS.downloadFile(options);
    ret.promise.then(res => {
      NativeModules.ReactNativeUtils.upDataImage(downloadDest)
      Toast.message('保存成功，请到下载列表查看')
      this.hideCustom()
    }).catch(err => {

      Toast.message('保存失败，请稍后再试')

      this.hideCustom()
      console.debug('err-------', err)
    });

  }

  //获取权限
  async getStorage() {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ];

      const granteds = await PermissionsAndroid.requestMultiple(permissions);

      if (granteds["android.permission.CAMERA"] === "granted") {

        this.downLoadImage()

      } else {
        Toast.message('授权被拒绝, 无法保存图片')
      }
    } catch (err) {
      Toast.message(err.toString());
    }
  };



  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
        />
        <Ctitle name='邀请好友'></Ctitle>

        <Image style={{ flex: 1 }} resizeMode='contain' source={require('../assets/img/haibao.jpeg')}></Image>

        <View style={{
          height: 70, backgroundColor: '#fff', width: Dimensions.get('window').width,
          alignItems: 'center', justifyContent: 'center', flexDirection: 'row'
        }}>

          <TouchableWithoutFeedback onPress={this.getStorage.bind(this)}>
            <View style={{
              borderColor: '#03B24B', borderWidth: 1, borderRadius: 4, height: 44,
              alignItems: 'center', justifyContent: 'center', width: 130
            }}>
              <Text style={{ color: '#03B24B', fontSize: 17 }}>
                保存到相册
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={this.onOpenUrl.bind(this)}>
            <View style={{
              borderColor: '#03B24B', borderWidth: 1, borderRadius: 4, height: 44,
              alignItems: 'center', justifyContent: 'center', width: 130, marginLeft: 30
            }}>
              <Text style={{ color: '#03B24B', fontSize: 17 }}>
                去下载
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }
}

export default inviteScreen;