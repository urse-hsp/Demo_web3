/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler'
import React from 'react';
import {
  Text
} from 'react-native'
import { Provider } from 'react-redux';
import { Provider as ProviderAntd } from '@ant-design/react-native'
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from "react-native-safe-area-context";

import store from './src/store'
import StackNavigator from './src/router/StackNavigator'


import { useLoadedAssets } from "./src/hooks/useLoadedAssets";

//字体不随系统字体变化
// TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {defaultProps: false})
Text.defaultProps = Object.assign({}, Text.defaultProps, { allowFontScaling: false })

const App: () => React$Node = (props) => {

  let initRouter = 'Splash'
  // let initRouter = 'ChooseWalletNet'
  if (props.routerName) {
    initRouter = props.routerName
  }

  const { isLoadingComplete } = useLoadedAssets();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ProviderAntd>
          <Provider store={store}>
            <NavigationContainer>
              <StackNavigator initRouter={initRouter} />
            </NavigationContainer>
          </Provider>
        </ProviderAntd>
      </SafeAreaProvider>
    )
  }
}
export default App;
