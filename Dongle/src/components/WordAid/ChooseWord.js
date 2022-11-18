import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'

export default class ChooseWord extends Component {
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

    render() {
        let { ClassifyList } = this.props
        return (
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>

                {
                    ClassifyList.map((item, index) => {
                        return (
                            item.sele ? (
                                <Text key={index} style={ styles.sele}>
                                    {item.name}
                                </Text>
                            ) : (
                                <Text key={index} style={styles.classifyiItem} onPress={this.ontabPress.bind(this, index)}>
                                    {item.name}
                                </Text>
                            )
                        )
                    })
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    classifyiItem: {
        textAlign: 'center',
        textAlignVertical: 'center',
        borderColor: '#E0E6EB',
        borderWidth: 1,
        marginBottom: 8,
        width: '30%',
        height: 35,
        fontSize: 15,
        color: '#1E1E1E',
        borderRadius: 5,
        backgroundColor: '#fff'
    },

    sele:{
        backgroundColor:'#F8FAFC',
        textAlign: 'center',
        textAlignVertical: 'center',
        color:'#D7D7D7',  marginBottom: 8,
        width: '30%',
        height: 35,
        borderRadius: 5,
        fontSize: 15,
    }
})

