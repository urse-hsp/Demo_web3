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
export default class CreatWalletPopu extends React.Component {

    state = {
        isVisible: this.props.show,
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

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
    onNavPage = (name) => {
        this.props.navigationTo(name);
    }

    renderDialog() {
        let that = this;
        return (
            <View style={styles.modalStyle}>
                <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, 'CreatWallet')}>
                    <View style={{ height: 48, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 17 }}>
                            创建钱包
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{height:1,backgroundColor:'#EBEBF0'}}></View>
                <TouchableWithoutFeedback style={{ height: 48 }} onPress={this.onNavPage.bind(this, 'ImportWallet')}>
                    <View style={{ height: 48, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'rgba(34, 44, 65, 1)', fontSize: 17 }}>
                            导入钱包
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{ backgroundColor: '#EDF0F5', height: 8 }}></View>
                <TouchableWithoutFeedback style={{ height: 48 }} onPress={this.closeModal.bind(this)}>
                    <View style={{ height: 48, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'rgba(109, 120, 139, 1)', fontSize: 17 }}>
                            取消
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
        height: 152,
        flexDirection: "column",
        backgroundColor: '#ffffff',
        borderTopStartRadius: 16,
        borderTopRightRadius: 16,
    },

});