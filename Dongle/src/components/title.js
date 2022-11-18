import React, { Component } from 'react';
import { withNavigation } from '@react-navigation/compat';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Image, TouchableWithoutFeedback, NativeModules, StatusBar } from 'react-native';

/**
 * 方式1：ES6
 */
@withNavigation
class TitleComponent extends Component {

	constructor(props) {
		super(props)
	}

	componentDidMount() {
	}


	onBack = () => {
		let { onBackFunc, navigation } = this.props
		if (onBackFunc) {
			onBackFunc()
			return
		}

		if (navigation.canGoBack()) {
			this.props.navigation.goBack()
		} else {
			// NativeModules.ReactNativeUtils.goBack()
		}
	}

	onRight = () => {
		this.props.onRightFunc();
	}

	// 渲染右侧
	renderRight() {
		let { rightTxtStyle = {}, rightIcon, addIcon, rightTxt, saoYiSaoIcon } = this.props
		if (rightIcon) {
			return (
				<TouchableWithoutFeedback style={styles.rightIcon} activeOpacity={.5} onPress={this.onRight.bind(this)}>
					<Image style={styles.backIcon} source={require('../assets/img/ic_history.png')} />
				</TouchableWithoutFeedback>
			)
		} else if (addIcon) {
			return (
				<TouchableWithoutFeedback style={styles.rightIcon} activeOpacity={.5} onPress={this.onRight.bind(this)}>
					<Image style={styles.backIcon} source={require('../assets/img/ic_add_black.png')} />
				</TouchableWithoutFeedback>
			)
		} else if (saoYiSaoIcon) {
			return (
				<TouchableWithoutFeedback style={styles.rightIcon} activeOpacity={.5} onPress={this.onRight.bind(this)}>
					<Image style={[styles.backIcon,{marginRight:16}]} source={require('../assets/img/ic_sys_48px_black.png')} />
				</TouchableWithoutFeedback>
			)
		} else if (rightTxt) {
			return (
				<TouchableOpacity style={styles.rightTxt} activeOpacity={.5} onPress={this.onRight.bind(this)}>
					<Text style={[styles.rightTxt_val, rightTxtStyle]}>{rightTxt}</Text>
				</TouchableOpacity>
			)
		}
		return <View />
	}

	renderTitle() {
		let { name } = this.props
		return (<Text style={styles.tabName} numberOfLines={1}>{name}</Text>)
	}

	render() {
		let { bgColor, saoYiSaoIcon } = this.props
		return (
			<View style={[styles.titleContainer, { backgroundColor: bgColor || '#fff' }]}>
				<View style={[styles.titleWrap, this.props.pos ? styles.pos : {}]}>
					<TouchableOpacity style={[styles.backIcon, { width: px2dp(80), height: px2dp(80), padding: 0, alignItems: 'center', justifyContent: 'center' }]} activeOpacity={1} onPress={this.onBack.bind(this)}>
						<Image style={styles.backIcon} source={require('../assets/img/ic_back.png')} />
					</TouchableOpacity>
					{
						this.props.children &&
						<View>{this.props.children}</View>
					}
					{
						this.renderTitle()
					}
					{
						this.renderRight()
					}
					<View style={[{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', display: saoYiSaoIcon ? 'none' : 'flex' }]}></View>
				</View>
			</View >
		)
	}
}

const styles = StyleSheet.create({
	pos: {
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: 99
	},
	tabName: {
		color: '#000',
		fontWeight: 'bold',
		fontSize: FONT_SIZE(18),
		width: px2dp(500),
		textAlign: 'center',
		flex: 1,
		// maxWidth: px2dp(80),

	},
	rightIcon: {
		position: 'absolute',
		right: 25,
		top: 0,
		width: 24,
		height: 24,
		paddingTop: px2dp(26),
		paddingLeft: px2dp(26),
	},
	rightTxt: {
		position: 'absolute',
		right: px2dp(0),
		top: px2dp(0),
		zIndex: 10,
		paddingTop: px2dp(16),
		paddingLeft: px2dp(32),
		paddingRight: px2dp(32),
	},
	rightTxt_val: {
		color: gColorVar.theme,
		fontWeight: '500',
		fontSize: FONT_SIZE(16),
		padding: px2dp(10),
		paddingRight: 0,
	},
	backIcon: {
		width: 24,
		height: 24,
		paddingLeft: 16
	},


	titleWrap: {
		height: px2dp(88),
		width: px2dp(750),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	titleContainer: {
		// paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
		borderTopColor: '#fff',
		// borderTopColor: 'red',
		borderTopWidth: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
	}
});

export default TitleComponent