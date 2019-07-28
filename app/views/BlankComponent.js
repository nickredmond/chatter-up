import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthenticatedComponent } from '../shared/AuthenticatedComponent';

export class BlankComponent extends AuthenticatedComponent {
    constructor(props) {
        super(props);
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