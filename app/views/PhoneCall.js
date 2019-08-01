import React from 'react';
import { View, StyleSheet, Text, Linking } from 'react-native';
import { AuthenticatedComponent } from '../shared/AuthenticatedComponent';
import { ChatterUpLoadingSpinner } from './partial/ChatterUpLoadingSpinner';
import { IncomingCallOverlay } from '../shared/IncomingCallOverlay';
import { initializeCall } from '../services/ChatterUpService';
import { getFormattedPhoneNumber } from '../shared/Constants';

const NOTIFY_USER_TIMEOUT = 3000;
const LoadingStates = {
    HIDING_NUMBER: 'hidingNumber',
    NOTIFYING_USER: 'notifyingUser',
    DIALING: 'dialing',
    NONE: 'none'
};
const timerHandles = [];
export class PhoneCall extends AuthenticatedComponent {
    constructor(props) {
        super(props);
        const otherUsername = this.props.navigation.getParam('username');
        this.state = {
            otherUsername,
            loadingState: LoadingStates.HIDING_NUMBER,
            loadingText: this.getLoadingText(LoadingStates.HIDING_NUMBER)
        };
        
        initializeCall(otherUsername).then(
            virtualNumber => {
                this.setState({ 
                    virtualNumber,
                    loadingState: LoadingStates.NOTIFYING_USER,
                    loadingText: this.getLoadingText(LoadingStates.NOTIFYING_USER)
                });
                const notifyUserTimeout = setTimeout(self => {
                    self.setState({ 
                        loadingState: LoadingStates.DIALING,
                        loadingText: self.getLoadingText(LoadingStates.DIALING)
                    });
                    const dialingTimeout = setTimeout(() => {
                        Linking.openURL('tel:' + virtualNumber).catch(_ => {
                            alert('Problem dialing phone number.');
                        });
                    }, 250);
                    timerHandles.push(dialingTimeout);

                    // TODO: investigate if I can see when phone is in-call and then 
                    //      update UI accordingly :tada:
                    // setTimeout(innerSelf => {
                    //     innerSelf.setState({ 
                    //         loadingState: LoadingStates.NONE,
                    //         loadingText: innerSelf.getLoadingText(LoadingStates.NONE)
                    //     });
                    // }, 2000, self);
                }, NOTIFY_USER_TIMEOUT, this);
                timerHandles.push(notifyUserTimeout);
            },
            errorMessage => {
                alert(errorMessage);
            }
        )
    }

    componentWillUnmount() {
        timerHandles.forEach(handle => {
            clearTimeout(handle);
        });
    }

    getLoadingText = (loadingState) => {
        let loadingText = '';
        switch (loadingState) {
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
        return loadingText;
    }

    getDialingSubtext = () => {
        const formattedNumber = getFormattedPhoneNumber(this.state.virtualNumber);
        return 'You may be prompted to dial the number "' + formattedNumber + '", ' +
            'which will connect you to user "' + this.state.otherUsername + '".';
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.loadingState !== LoadingStates.NONE && 
                    <View style={styles.loadingView}>
                        <Text style={styles.loadingText}>{this.state.loadingText}</Text>
                        {
                            this.state.loadingState === LoadingStates.DIALING && 
                            <Text style={styles.subtext}>{this.getDialingSubtext()}</Text>
                        }
                        <ChatterUpLoadingSpinner></ChatterUpLoadingSpinner>
                    </View>
                }
                {/* TODO: maybe add 'home' button or something, like in report-submitted? */}
                {/* v1.1: on phone call ended, send Pusher-msg from server (/event) to client, and auto-navigate? */}
                {/* TODO: also, add button to open telephone prompt again in case they exit accidentally */}
            
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
    loadingView: {
        alignItems: 'center'
    },
    loadingText: {
        color: '#dedede',
        fontSize: 28,
        marginTop: 10
    },
    subtext: {
        color: '#efefef',
        fontSize: 20,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10
    }
});