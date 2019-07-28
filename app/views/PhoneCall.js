import React from 'react';
import { View, StyleSheet, Text, Linking } from 'react-native';
import { AuthenticatedComponent } from '../shared/AuthenticatedComponent';
import { ChatterUpLoadingSpinner } from './partial/ChatterUpLoadingSpinner';
import { initializeCall } from '../services/ChatterUpService';
import { call } from 'react-native-phone-call';

const NOTIFY_USER_TIMEOUT = 5000;
const LoadingStates = {
    HIDING_NUMBER: 'hidingNumber',
    NOTIFYING_USER: 'notifyingUser',
    DIALING: 'dialing',
    NONE: 'none'
};
export class PhoneCall extends AuthenticatedComponent {
    constructor(props) {
        super(props);
        this.state = {
            loadingState: LoadingStates.HIDING_NUMBER
        };
        const otherUsername = this.props.navigation.getParam('username');
        initializeCall(otherUsername).then(
            virtualNumber => {
                this.setState({ loadingState: LoadingStates.NOTIFYING_USER });
                setTimeout(self => {
                    self.setState({ loadingState: LoadingStates.DIALING });
                    Linking.openURL('tel:' + virtualNumber).catch(_ => {
                        alert('Problem dialing phone number.');
                    });

                    setTimeout(innerSelf => {
                        innerSelf.setState({ loadingState: LoadingStates.NONE });
                    }, 2000, self);
                }, NOTIFY_USER_TIMEOUT, this);
            },
            errorMessage => {
                alert(errorMessage);
            }
        )
    }

    setLoadingText = () => {
        const loadingText;
        switch (this.state.loadingState) {
            case LoadingStates.HIDING_NUMBER: 
                loadingText = 'hiding your number...';
                break;
            case LoadingStates.NOTIFYING_USER: 
                loadingText = 'notifying user...';
                break;
            case LoadingStates.DIALING: 
                loadingText = 'dialing...';
                break;
            default: 
                loadingText = 'loading...';
                break;
        }
        this.setState({ loadingText });
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.loadingState !== LoadingStates.NONE && 
                    <View style={styles.loadingView}>
                        <Text style={styles.loadingText}>{this.state.loadingText}</Text>
                        <ChatterUpLoadingSpinner></ChatterUpLoadingSpinner>
                    </View>
                }
                {/* TODO: maybe add 'home' button or something, like in report-submitted? */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgrounColor: '#222',
        alignItems: 'center'
    },
    loadingView: {
        alignItems: 'center'
    },
    loadingText: {
        color: '#efefef',
        fontSize: 24
    }
});