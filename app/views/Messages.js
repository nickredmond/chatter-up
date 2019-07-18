import React from 'react';
import { View, StyleSheet } from 'react-native';

export class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true };
    }

    render() {
        return (
            <View style={styles.container}>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
        alignItems: 'center'
    }
});