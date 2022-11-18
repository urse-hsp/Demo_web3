import React, { Component } from 'react';
import {
    Image
} from 'react-native';
import PropTypes from 'prop-types'; 

export default class CustomImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 0,//0,正常加载，1加载错误，
        }
    }
    static propTypes = {
        uri: PropTypes.string.isRequired,//
        errImage: PropTypes.number,//
    }
    static defaultProps = {
        errImage: require('../assets/img/ic_logo.png'),
    }
    render() {
        const { uri, errImage, style } = this.props;
        let source = { uri: uri }; 
        if (this.state.type === 1) {
            source = errImage;
        }
        return (
            <Image
                source={source}
                style={[{ width: 100, height: 100, backgroundColor: '#ccc' }, style]}
                onError={(error) => {
                    this.setState({
                        type: 1,
                    })
                }}
            />
        );
    }
}