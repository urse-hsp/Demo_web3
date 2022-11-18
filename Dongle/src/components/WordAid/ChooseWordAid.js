import React, { Component } from 'react';
import {
    View, Text, Image, StyleSheet,
    TouchableWithoutFeedback,
} from 'react-native'

export default class ChooseWordAid extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {
    }

    //删除
    ontabPress = (index) => {
        this.props.onWordRes(index);
    }

    render() {
        let { ClassifyList, isEnable } = this.props
        return (
            <View style={{
                display: 'flex', flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'
            }}>
                {
                    ClassifyList.map((item, index) => {
                        return (
                            item.isRight == 'true' ? (
                                <View key={index} style={{
                                    marginTop: 3, width: '30%', height: 40,
                                    display: 'flex', justifyContent: 'flex-end'
                                }} >
                                    <Text style={styles.classifyiItem}>
                                        {item.name}
                                    </Text>
                                </View>
                            ) : (
                                <TouchableWithoutFeedback key={index} onPress={this.ontabPress.bind(this, index)}>
                                    < View style={{ marginTop: 3, width: '30%', height: 40, display: 'flex', alignItems: 'flex-end' }}  >
                                        <Image style={{ marginBottom: -11, zIndex: 1, width: 16, height: 16 }}
                                            source={require('../../assets/img/ic_del_32px.png')} />
                                        <Text style={styles.classifyiItem}>
                                            {item.name}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        )
                    })
                }
            </View >
        )
    }
}

const styles = StyleSheet.create({
    classifyiItem: {
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 85,
        marginRight: 6,
        height: 35,
        fontSize: 15,
        color: '#1E1E1E',
        borderRadius: 5,
        backgroundColor: '#fff'
    }
})

