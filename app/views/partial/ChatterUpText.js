import React from 'react';
import { Text, StyleSheet } from 'react-native';

export class ChatterUpText extends React.Component {
    static navigationOptions = {
        header: null
    }

    render() {
        return (
            <Text style={[this.props.style, styles.text]}>{ this.props.textValue }</Text>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        color: '#efefef'
    }
})