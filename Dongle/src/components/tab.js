
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
/**
 * 方式1：ES6
 */
export default class TabComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
        }
    }

    componentDidMount() {
        
    }

    ontabPress = (index) => {
        this.props.onTabRes(index);
    }

    // 边框标签Tab
    renderOutline = (item, index) => {
        let obj = {}
        if (index == 1) {
            obj.borderTopRightRadius = px2dp(8),
                obj.borderBottomRightRadius = px2dp(8)
            obj.borderTopLeftRadius = px2dp(0)
            obj.borderBottomLeftRadius = px2dp(0)
        }

        return (
            <TouchableOpacity style={this.props.activeItem == index ? [styles.tabItem_outline_active, obj] : [styles.tabItem_outline, obj]} key={index} onPress={this.ontabPress.bind(this, index)}>
                <Text style={this.props.activeItem == index ? styles.tabText_outline_active : styles.tabText_outline}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    // 实心标签Tab
    renderSolid = (item, index) => {
        return (
            <TouchableOpacity style={styles.tabItem_solid} key={index} onPress={this.ontabPress.bind(this, index)}>
                <Text style={this.props.activeItem == index ? styles.tabText_solid_active : styles.tabText_solid}>{item.title}</Text>
                {
                    this.props.activeItem == index &&
                    <View style={this.props.arrData.length - 1 != index ? styles.tinyLogoArea_padd : styles.tinyLogoArea}>
                        <Image style={styles.tinyLogo} source={require('../assets/img/1.png')} />
                    </View>
                }
                {
                    index != this.props.arrData.length - 1 &&
                    <View style={styles.line}></View>
                }
            </TouchableOpacity>
        )
    }

    // 实心圆角标签Tab
    renderSolidRound = (item, index) => {
        return (
            <TouchableOpacity style={this.props.activeItem == index ? styles.tabItem_solidround_active : styles.tabItem_solidround} key={index} onPress={this.ontabPress.bind(this, index)}>
                <Text style={this.props.activeItem == index ? styles.tabSolidRoundText_active : styles.tabSolidRoundText}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    // 正常下划标签Tab
    renderNormal = (item, index) => {
        return (
            <TouchableOpacity style={styles.tabItem} key={index} onPress={this.ontabPress.bind(this, index)}>
                <Text style={this.props.activeItem == index ? styles.tabText_active : styles.tabText}>{item.title}</Text>
                {
                    this.props.activeItem == index &&
                    <View style={styles.underline}>
                        <View style={styles.underline_wrap}></View>
                    </View>
                }
            </TouchableOpacity>
        )
    }

    render() {
        let obj = {}
        let heightProp = this.props.height
        if (heightProp) {
            obj.height =  heightProp
        }

        return (
            <View style={[styles.tabWrap, obj]}>
                {
                    this.props.mode == 'Solid' &&
                    this.props.arrData.map((item, index) => {
                        return this.renderSolid(item, index)
                    })
                }
                {
                    this.props.mode == 'SolidRound' &&
                    this.props.arrData.map((item, index) => {
                        return this.renderSolidRound(item, index)
                    })
                }
                {
                    this.props.mode == 'Normal' &&
                    this.props.arrData.map((item, index) => {
                        return this.renderNormal(item, index)
                    })
                }
                {
                    this.props.mode == 'Outline' &&
                    this.props.arrData.map((item, index) => {
                        return this.renderOutline(item, index)
                    })
                }
            </View>
        )
    }
}

TabComponent.defaultProps = {
    mode: 'Normal',
    activeItem: 0,
    height: 88
}

const styles = StyleSheet.create({
    tinyLogo: {
        width: px2dp(17.8),
        height: px2dp(8.78),
    },
    tabItem_outline_active: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: px2dp(56),
        borderTopLeftRadius: px2dp(8),
        borderBottomLeftRadius: px2dp(8),
        borderStyle: 'solid',
        borderWidth: px2dp(2),
        borderColor: gColorVar.theme,

    },
    tabItem_outline: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: px2dp(56),
        borderTopLeftRadius: px2dp(8),
        borderBottomLeftRadius: px2dp(8),
        borderStyle: 'solid',
        borderWidth: px2dp(2),
        borderColor: '#CCC'
    },
    tabText_outline: {
        color: '#999'

    },
    tabText_outline_active: {
        color: gColorVar.theme
    },
    tabSolidRoundText: {
        fontSize: FONT_SIZE(14),
        fontWeight: '500',
        color: '#666',
        backgroundColor: '#f7f7f7',
        borderRadius: px2dp(28),
        paddingHorizontal: px2dp(28),
        paddingVertical: px2dp(11)
    },
    tabSolidRoundText_active: {
        fontSize: FONT_SIZE(14),
        color: '#fff',
        fontWeight: 'bold',
        backgroundColor: gColorVar.theme,
        borderRadius: px2dp(28),
        paddingHorizontal: px2dp(37),
        paddingVertical: px2dp(11)
    },
    tabItem_solidround: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    tabItem_solidround_active: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    underline: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 4,
        alignItems: 'center'
    },
    underline_wrap: {
        width: 24   ,
        height: '100%',
        borderRadius: 8,
        backgroundColor: '#6BD1B1',
    },
    line: {
        width: px2dp(1),
        height: px2dp(24),
        backgroundColor: '#333',
        marginLeft: px2dp(24),
        opacity: 0.2
    },
    tabWrap: {
        height: px2dp(88),
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    tabItem_solid: {
        marginRight: px2dp(24),
        flexDirection: 'row',
        alignItems: 'center',
        color: '#333',
        position: 'relative'
    },
    tinyLogoArea: {
        position: 'absolute',
        bottom: px2dp(-8),
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        width: '100%'
    },
    tinyLogoArea_padd: {
        position: 'absolute',
        bottom: px2dp(-8),
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        width: '100%',
        paddingRight: px2dp(24)
    },
    tabItem: {
        flex: 1,
        marginLeft:22,
        marginRight:22,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    tabText: {
        color: '#6D788B',
        fontSize: FONT_SIZE(15),
        fontWeight: '500'
    },
    tabText_active: {
        color: '#222C41',
        fontSize: FONT_SIZE(15),
        fontWeight: 'bold'
    },
    tabText_solid: {
        color: '#333',
        fontSize: FONT_SIZE(16),
        fontWeight: '500'
    },
    tabText_solid_active: {
        color: '#fff',
        fontSize: FONT_SIZE(16),
        fontWeight: '800',
        paddingHorizontal: px2dp(10),
        paddingVertical: px2dp(5),
        borderRadius: px2dp(8),
        backgroundColor: gColorVar.theme2
    }
});


