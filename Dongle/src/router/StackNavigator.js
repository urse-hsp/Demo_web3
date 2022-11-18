import React, { useEffect } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {
  BackHandler,
} from 'react-native'
const Stack = createStackNavigator();
import router from "./pageList"

import { Toast } from 'teaset'

let lastBackPressed = 0 // 初始化安卓返回键功能

/**
 * 把处理安卓返回键方法抽离 函数式组件 提高性能
 */
// 处理安卓返回键
function onBackButtonPressAndroid() {
  if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
    // 最近2秒内按过back键，可以退出应用。
    BackHandler.exitApp()
    return false;
  }
  lastBackPressed = Date.now();
  Toast.message('再按一次退出应用');
  return true;
}

const StackNavigator = (props) => {

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackButtonPressAndroid);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackButtonPressAndroid);
    }
  }, []) 

  //从子导航器获取路由名称
  const getChildTitle = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    return routeName
  }

  return (
    <Stack.Navigator initialRouteName={props.initRouter} screenOptions={{
      animationEnabled: true,
      gestureEnabled: Platform.OS === 'ios' ? true : false,
      ...TransitionPresets.SlideFromRightIOS,
      headerBackTitle: '',
      headerBackTitleVisible: false,
      gestureResponseDistance: {
        horizontal: 30
      },
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0
      }
    }}>
      {
        router.map((item, index) => {
          return (
            <Stack.Screen key={index} name={item.name} component={item.component} options={({ route }) => ({
              title: getChildTitle(route) || item.title,
              headerStyle: {
                backgroundColor: '#fff',
                height: 40
              },
              headerTitleStyle: {
                color: '#000',
                fontSize: 15
              },
              headerShown: false
            })} />
          )
        })
      }
    </Stack.Navigator>
  );
}
export default StackNavigator;