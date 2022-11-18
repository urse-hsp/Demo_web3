import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'

export default class WordAid extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        let { ClassifyList } = this.props
        return (
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>

                {
                    ClassifyList.map((item, index) => {
                        return (
                            // <ClassifyiItem key={index} data={item} />
                            <View key={index} style={styles.classifyiItem}>
                                <Text>{item}</Text>
                            </View>
                        )
                    })
                }

            </View>
        )
    }
}


const styles = StyleSheet.create({
    classifyiItem: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        width: '30%',
        height: 35,
        fontSize: 15,
        color: '#1E1E1E',
        borderRadius: 5,
        backgroundColor: '#fff'
    }
})

