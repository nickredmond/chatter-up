import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';

export class Support extends React.Component {
    static navigationOptions = {
        title: 'support'
    };

    constructor(props) {
        super(props);
    }

    goTo = (viewName) => {
        this.props.navigation.navigate(viewName);
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.supportButton} onPress={() => this.goTo('Faq')}>
                        <Icon size={48} name='question' type='font-awesome' color='#efefef'></Icon>
                        <Text style={styles.supportButtonText}>{'faq'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.supportButton} onPress={() => this.goTo('Report')}>
                        <Icon size={48} name='exclamation' type='font-awesome' color='#efefef'></Icon>
                        <Text style={styles.supportButtonText}>{'report'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.supportButton} onPress={() => this.goTo('Contact')}>
                        <Icon size={48} name='headphones' type='font-awesome' color='#efefef'></Icon>
                        <Text style={styles.supportButtonText}>{'contact'}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
        alignItems: 'stretch'
    },
    supportButton: {
        backgroundColor: 'purple',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center'
    },
    supportButtonText: {
        color: '#efefef',
        fontSize: 24
    }
});