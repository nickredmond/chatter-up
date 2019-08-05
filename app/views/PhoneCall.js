import React from 'react';
import { View, StyleSheet, Text, Linking } from 'react-native';
import { AuthenticatedComponent } from '../shared/AuthenticatedComponent';
import { ChatterUpLoadingSpinner } from './partial/ChatterUpLoadingSpinner';
import { IncomingCallOverlay } from '../shared/IncomingCallOverlay';
import { initializeCall } from '../services/ChatterUpService';
import { getFormattedPhoneNumber } from '../shared/Constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';

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
                loadingText = 'ready to call!';
                break;
            default: 
                loadingText = 'loading...';
                break;
        }
        return loadingText;
    }

    getDialingSubtext = () => {
        const formattedNumber = getFormattedPhoneNumber(this.state.virtualNumber);
        return 'Press "dial" to open your device\'s phone app for phone number "' + formattedNumber + '". ' +
            'Calling this private number will connect you to user "' + this.state.otherUsername + '".';
    }

    getNumberText = () => {
        const formattedNumber = getFormattedPhoneNumber(this.state.virtualNumber);
        return 'number: ' + formattedNumber;
    }

    getUserText = () => {
        return 'user: ' + this.state.otherUsername;
    }

    dialNumber = () => {
        Linking.openURL('tel:' + this.state.virtualNumber).catch(_ => {
            alert('Problem dialing phone number.');
        });
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.loadingState !== LoadingStates.NONE && 
                    <View style={styles.loadingView}>
                        <Text style={styles.loadingText}>{this.state.loadingText}</Text>
                        {
                            this.state.loadingState !== LoadingStates.DIALING && 
                            <ChatterUpLoadingSpinner></ChatterUpLoadingSpinner>
                        }
                        {
                            this.state.loadingState === LoadingStates.DIALING && 
                            <View>
                                <Text style={styles.subtext}>{this.getNumberText()}</Text>
                                <Text style={styles.subtext}>{this.getUserText()}</Text>
                            </View>
                        }

                        <TouchableOpacity 
                            style={[styles.button, styles.homeButton]}
                            onPress={() => this.goTo('Home')}
                            >
                            <Icon size={28} name='home' type='font-awesome' color='#222' />
                            <Text style={[styles.buttonText, styles.homeButtonText]}>{'home'}</Text>
                        </TouchableOpacity>
                        {
                            this.state.loadingState === LoadingStates.DIALING && 
                            <TouchableOpacity 
                                style={[styles.button, styles.callButton]}
                                onPress={this.dialNumber}
                                >
                                <Icon size={28} name='phone' type='font-awesome' color='#efefef' />
                                <Text style={[styles.buttonText, styles.callButtonText]}>{'dial'}</Text>
                            </TouchableOpacity>
                        }
                    </View>
                }
                {/* event: call started, Pusher to change to in-call view */}
                {/* event: call ended, Pusher to change to after-call view  
                    call ended
                    time in call: 52 min
                    how would you rate the person you talked with?
                    (smileys)
                    [ submit rating ]
                */}
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
        alignItems: 'center',
        alignSelf: 'stretch'
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
        fontSize: 24,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10
    },
    button: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 25,
        paddingRight: 25,
        marginLeft: 50,
        marginRight: 50,
        marginBottom: 20,
        minWidth: 100
    },
    homeButton: {
        marginTop: 25,
        backgroundColor: '#ddd',
        borderColor: '#aaa',
        borderRadius: 2,
        borderWidth: 1
    },
    callButton: {
        backgroundColor: '#00B706'
    },
    buttonText: {
        fontSize: 24,
        marginLeft: 10
    },
    homeButtonText: {
        color: '#222'
    },
    callButtonText: {
        color: '#efefef'
    }
});