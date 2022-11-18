import React from 'react';
import { Dimensions, Platform, PixelRatio } from 'react-native';


const { width } = Dimensions.get('window');

// const basePx = Platform.OS === 'ios' ? 750 : 720;
const basePx = 750;

export const Px2Dp = function px2dp(px) {
  const layoutSize = (px / basePx) * width;

  return PixelRatio.roundToNearestPixel(layoutSize);
};

export const getNetInfoStatus = (netInfo) => {
  const type = netInfo.type;
  return {
    isConnect: type.toUpperCase() === 'WIFI' || type.toUpperCase() === 'CELLULAR',
    isWifi: type.toUpperCase() === 'WIFI',
    isCellular: type.toUpperCase() === 'CELLULAR'
  };
};