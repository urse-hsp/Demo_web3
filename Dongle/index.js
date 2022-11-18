

// // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// // It also ensures that whether you load the app in Expo Go or in a native build,
// // the environment is set up appropriately
// 
/**
 * @format
 */
import { registerRootComponent } from 'expo';
import './src/utils/Global'
import App from './App';

console.ignoredYellowBox = ['Warning: BackAndroid is deprecated. Please use BackHandler instead.', 'source.uri should not be an empty string', 'Invalid props.style key'];
console.disableYellowBox = true // 关闭全部黄色警告

registerRootComponent(App); 