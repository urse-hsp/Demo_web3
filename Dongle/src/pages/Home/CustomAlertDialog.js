import React, { Component } from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    NativeModules,
    View,
    Image,
    FlatList,
    TouchableWithoutFeedback,
    DeviceEventEmitter,
} from 'react-native';
import { Toast } from 'teaset';
import Clipboard from '@react-native-community/clipboard'

const { width } = Dimensions.get('window');
export default class CustomAlertDialog extends React.Component {

    state = {
        isVisible: this.props.show,
        name: 'KTO',
        leftList: [
            {
                name: 'KTO',
                sele: true,
                img: require('../../assets/img/ic_kto.png'),
                imgNor: require('../../assets/img/ic_kto_nor.png')
            }, {
                name: 'ETH',
                sele: false,
                img: require('../../assets/img/ic_eth.png'),
                imgNor: require('../../assets/img/ic_eth_nor.png')
            }, {
                name: 'BSC',
                sele: false,
                img: require('../../assets/img/ic_bnb.png'),
                imgNor: require('../../assets/img/ic_bnb_nor.png')
            },
        ],
        list: [],
    }

    constructor(props) {
        super(props);
        this.subscription = null
    }

    componentDidMount() {

        if (Platform.OS === 'android') {
            this.subscription = DeviceEventEmitter.addListener('popu', (res) => {
                let data = JSON.parse(res.mapBean)
                this.setState({
                    list: data
                })
            });

            DeviceEventEmitter.addListener('deleteRealm', (res) => {
                let data = JSON.parse(res.mapBean)
                if (data) {
                    //删除成功
                    NativeModules.ReactNativeUtils.findRealm('KTO', 'popu')
                } else {

                }
            });
        }

        NativeModules.ReactNativeUtils.findRealm('KTO', 'popu')
    }

    componentWillUnmount() {
        if (this.subscription) {
            this.subscription.remove()
        }
    }

    static getDerivedStateFromProps(props, state) {
        return {
            isVisible: props.show
        }
    }

    closeModal() {
        this.setState({
            isVisible: false
        });
        this.props.closeModal(false);
    }

    //页面跳转
    onNavPage = () => {
        this.props.navigationTo(this.state.name);
    }

    onLetfSele = (id) => {
        NativeModules.ReactNativeUtils.findRealm(id, 'popu')
        let list = this.state.leftList
        for (const listData of list) {
            listData.sele = false
        }
        for (let x = 0; x < list.length; x++) {
            if (list[x].name == id) {
                list[x].sele = true
            }
        }
        this.setState({
            leftList: list,
            name: id
        })
    }

    //选择钱包
    onSeleChain = (item) => {
        NativeModules.ReactNativeUtils.chooseWallet(item.key)
        NativeModules.ReactNativeUtils.findRealm(item.chainName, 'popu')
        this.props.seleChain(item);
    }

    // 复制
    copyString(str) {
        if (!str) return
        if (this.state.name == 'KTO') {
            Clipboard.setString('Kto0' + str.slice(2))
        } else {
            Clipboard.setString(str)
        }

        Toast.show('复制成功')
    }


    letfSeletcter = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={() => this.onLetfSele(item.name)}>
                <View style={{
                    height: 62, width: 62, alignItems: 'center', justifyContent: 'center',
                    backgroundColor: item.sele ? '#fff' : '#F2F4F7'
                }}>
                    <Image style={{ width: 30, height: 30 }} source={item.sele ? item.img : item.imgNor}></Image>
                </View>
            </TouchableWithoutFeedback>
        )
    }


    rightSeletcter = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={() => this.onSeleChain(item)}>
                <View style={[{
                    borderRadius: 8, height: 72,
                    marginLeft: 16, marginRight: 16, marginBottom: 12,
                    display: 'flex', flexDirection: 'row', padding: 12,
                    alignItems: 'center'
                }, this.state.name == 'KTO' ? { backgroundColor: '#4463F1' } : { backgroundColor: '#5F658C' }]}>
                    <View style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 17, color: '#fff' }}>
                            {item.walletName}
                        </Text>
                        <TouchableWithoutFeedback onPress={this.copyString.bind(this, item.address)}>
                            <View pointerEvents="box-none" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 14, marginTop: 4 }}>
                                    {
                                        this.state.name == 'KTO' ? (
                                            'Kto0' + item.address.slice(2, 7) + '...' +
                                            item.address.slice(item.address.length - 5, item.address.length)
                                        ) : (
                                            item.address.slice(0, 7) + '...' +
                                            item.address.slice(item.address.length - 5, item.address.length)

                                        )
                                    }
                                </Text>
                                <Image style={{ width: 12, height: 12, marginLeft: 8, marginTop: 4 }} source={require('../../assets/img/ic_copy_gray_12px.png')}></Image>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    {
                        item.choose && (
                            <Image style={{ width: 24, height: 24 }} source={require('../../assets/img/ic_choose_24px.png')}></Image>
                        )
                    }

                </View>
            </TouchableWithoutFeedback>
        )
    }

    renderDialog(leftList) {
        let that = this;
        return (
            <View style={styles.modalStyle}>
                <View style={{ height: 56, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, color: '#222C41' }}>
                        钱包列表
                    </Text>
                    <TouchableOpacity style={{ position: 'absolute', right: 24, padding: 10 }} onPress={this.closeModal.bind(this)}>
                        <Image style={{ width: 20, height: 20, }} source={require('../../assets/img/ic_close_16px.png')}></Image>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 1, backgroundColor: '#EBEBF0' }}></View>
                <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                    <View style={{ width: 62, backgroundColor: '#F2F4F7' }}>
                        <FlatList
                            data={leftList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.letfSeletcter}
                            showsVerticalScrollIndicator={false}
                        />

                    </View>
                    <View style={{ flex: 1, backgroundColor: '#fff' }}>
                        <View style={{
                            height: 40, margin: 16, display: 'flex', flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Text style={{ color: '#222C41', fontSize: 17, fontWeight: 'bold' }}>
                                {this.state.name}
                            </Text>
                            <TouchableWithoutFeedback onPress={this.onNavPage.bind(this)}>
                                <Image style={{ width: 22, height: 22 }} source={require('../../assets/img/ic_add_gray_46px.png')} />
                            </TouchableWithoutFeedback>
                        </View>

                        {
                            this.state.list.length ?
                                (
                                    <FlatList
                                        data={that.state.list}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={this.rightSeletcter}
                                        showsVerticalScrollIndicator={false}
                                    />
                                ) : (
                                    <TouchableWithoutFeedback onPress={this.onNavPage.bind(this)}>
                                        <View style={{
                                            height: 40, backgroundColor: 'rgba(3, 178, 75, 0.1)', display: 'flex',
                                            flexDirection: 'row', borderRadius: 4, marginLeft: 16, marginRight: 16,
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Image style={{ width: 14, height: 14 }} source={require('../../assets/img/ic_add_green_14px.png')}></Image>
                                            <Text style={{ marginLeft: 5, fontSize: 17, color: 'rgba(3, 178, 75, 1)' }}>
                                                添加钱包
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                )

                        }
                    </View>
                </View>
            </View>
        )
    }

    render() {
        let { leftList } = this.state

        return (

            <View style={{ flex: 1 }}>
                <Modal
                    transparent={true}
                    visible={this.state.isVisible}
                    animationType={'fade'}
                    onRequestClose={() => this.closeModal()}>
                    <TouchableOpacity style={styles.container} activeOpacity={1}>
                        {this.renderDialog(leftList)}
                    </TouchableOpacity>
                </Modal>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalStyle: {
        position: "absolute",
        left: 0,
        bottom: 0,
        width: width,
        flex: 1,
        height: 434,
        flexDirection: "column",
        backgroundColor: '#ffffff',
        borderTopStartRadius: 16,
        borderTopRightRadius: 16
    },

});