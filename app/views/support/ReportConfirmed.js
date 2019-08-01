import React from 'react';
import { View, StyleSheet, Text, BackHandler } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IncomingCallOverlay } from '../../shared/IncomingCallOverlay';
import { AuthenticatedComponent } from '../../shared/AuthenticatedComponent';

export class ReportConfirmed extends AuthenticatedComponent {
    static navigationOptions = {
        title: 'report submitted',
        headerLeft: null
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        return true;
    }

    goHome = () => {
        this.goTo('Home');
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.pageHeader}>{'thank you!'}</Text>
                <Text style={styles.pageDescription}>{'We will review your report and investigate the user you\'ve mentioned. TalkItOut would not be able to restrict all unwelcome users without your help, and your effort will not go unnoticed.'}</Text>
                <TouchableOpacity style={styles.homeButton} onPress={this.goHome}>
                    <Text style={styles.homeButtonText}>{'home'}</Text>
                </TouchableOpacity>

                <IncomingCallOverlay 
                    navigation={this.props.navigation}
                    incomingCallChannel={this.getIncomingMessageChannel()}>
                </IncomingCallOverlay>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
        alignItems: 'center'
    },
    pageHeader: {
        color: '#efefef',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 10
    },
    pageDescription: {
        color: '#dedede',
        fontSize: 18,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10
    },
    homeButton: {
        alignSelf: 'stretch',
        backgroundColor: '#ddd',
        borderColor: '#aaa',
        borderRadius: 2,
        borderWidth: 1,
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 25,
        paddingRight: 25,
        marginTop: 20
    },
    homeButtonText: {
        color: '#222',
        fontSize: 24
    }
});