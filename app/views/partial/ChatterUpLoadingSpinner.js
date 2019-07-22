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
            indicatorColor: this.props.color || '#efefef',
            indicatorSize: this.props.size || 'large'
        };
    }

    getViewStyle = () => {
        const style = {
            padding: 10,
            alignItems: 'center'
        };
        if (!this.props.withoutMargin) {
            style.marginTop = 25;
            style.marginBottom = 25;
        }

        return style;
    }

    render() {
        return (
            <View style={this.getViewStyle()}>
                <ActivityIndicator size={this.state.indicatorSize} color={this.state.indicatorColor} />
                {
                    this.state && this.state.loadingMessage && 
                    <ChatterUpText style={styles.loadingText} textValue={this.state.loadingMessage}></ChatterUpText>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loadingText: {
        fontSize: 18
    },
})