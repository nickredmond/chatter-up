import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ChatterUpText } from './ChatterUpText';

export class ChatterUpLoadingSpinner extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            loadingMessage: this.props.loadingMessage,
            indicatorColor: this.props.color || '#efefef'
        };
    }

    render() {
        return (
            <View style={styles.loadingView}>
                <ActivityIndicator size='large' color={this.state.indicatorColor} />
                {
                    this.state && this.state.loadingMessage && 
                    <ChatterUpText style={styles.loadingText} textValue={this.state.loadingMessage}></ChatterUpText>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loadingView: {
        marginTop: 25,
        marginBottom: 25,
        padding: 10,
        alignItems: 'center'
    },
    loadingText: {
        fontSize: 18
    },
})