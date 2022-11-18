import React, { Component } from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TouchableWithoutFeedback,
} from 'react-native';
const { width } = Dimensions.get('window');
export default class GasPopu extends React.Component {

    state = {
        isVisible: this.props.show,
        transfer: this.props.transfer,
        chainName: this.props.chainName
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    static getDerivedStateFromProps(props, state) {
        return {
            isVisible: props.show,
            transfer: props.transfer,
            chainName: props.chainName
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
        this.props.navigationTo();
    }

    renderDialog() {
        let { transfer, chainName } = this.state
        return (
            <View style={styles.modalStyle}>
                <View style={{
                    height: 48, alignItems: 'center', justifyContent: 'space-between',
                    display: 'flex', flexDirection: 'row'
                }}>
                    <View style={{ marginLeft: 10, width: 24, height: 24 }}></View>
                    <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 17, fontWeight: 'bold' }}>
                        交易详情
                    </Text>
                    <TouchableWithoutFeedback onPress={this.closeModal.bind(this, 'ImportWallet')}>
                        <Image style={{ width: 24, height: 24, marginRight: 10 }} source={require('../../assets/img/ic_close_gray.png')}></Image>
                    </TouchableWithoutFeedback>
                </View>

                <View style={{ height: 1, backgroundColor: '#EBEBF0' }}></View>

                <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                        {transfer.value} {transfer.chainName}
                    </Text>
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', flex: 1, }}>
                    <Text style={{ marginLeft: 16, color: 'rgba(34, 44, 65, 1)' }}>
                        发送方
                    </Text>
                    <Text style={{ fontSize: 15, marginLeft: 30, marginRight: 70 }} numberOfLines={2} >
                        {transfer.from}
                    </Text>
                </View>

                <View style={{ height: 1, backgroundColor: '#EBEBF0', marginTop: 20 }}></View>

                <View style={{ display: 'flex', flexDirection: 'row', flex: 1, marginTop: 20 }}>
                    <Text style={{ marginLeft: 16, color: 'rgba(34, 44, 65, 1)' }}>
                        接收方
                    </Text>
                    <Text style={{ fontSize: 15, marginLeft: 30, marginRight: 70 }} numberOfLines={2} >
                        {transfer.to}
                    </Text>
                </View>

                <View style={{ height: 1, backgroundColor: '#EBEBF0', marginTop: 20 }}></View>

                <View style={{ display: 'flex', flexDirection: 'row', flex: 1, marginTop: 20 }}>
                    <Text style={{ marginLeft: 16, color: 'rgba(34, 44, 65, 1)' }}>
                        矿工费
                    </Text>
                    <Text style={{ fontSize: 15, marginLeft: 30, marginRight: 70 }} numberOfLines={2} >
                        {transfer.gasUse} {chainName == 'KTO' ? 'KTO' : chainName == 'ETH' ? 'ETH' : chainName == 'BSC' ? 'BNB' : ''}
                    </Text>
                </View>

                <View style={{ height: 1, backgroundColor: '#EBEBF0', marginTop: 20 }}></View>

                <TouchableWithoutFeedback style={{ height: 48 }} onPress={this.onNavPage.bind(this)}>
                    <View style={{
                        height: 48, alignItems: 'center', justifyContent: 'center',
                        backgroundColor: 'rgba(3, 178, 75, 1)', marginTop: 30, marginBottom: 20,
                        marginLeft: 16, marginRight: 16, borderRadius: 6
                    }}>
                        <Text style={{ color: '#fff', fontSize: 17 }}>
                            确认转账
                        </Text>
                    </View>
                </TouchableWithoutFeedback>

            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Modal
                    transparent={true}
                    visible={this.state.isVisible}
                    animationType={'fade'}
                    onRequestClose={() => this.closeModal()}>
                    <TouchableOpacity style={styles.container} activeOpacity={1}>
                        {this.renderDialog()}
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
        flexDirection: "column",
        backgroundColor: '#ffffff',
        borderTopStartRadius: 16,
        borderTopRightRadius: 16,
    },

});