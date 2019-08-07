import React from 'react';
import { View, StyleSheet, Text, Linking } from 'react-native';
import { AuthenticatedComponent } from '../shared/AuthenticatedComponent';
import { ChatterUpLoadingSpinner } from './partial/ChatterUpLoadingSpinner';
import { IncomingCallOverlay } from '../shared/IncomingCallOverlay';
import { initializeCall, submitCallRating } from '../services/ChatterUpService';
import { getFormattedPhoneNumber, getPusherInstance } from '../shared/Constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import { getSocketReceiveId } from '../services/AuthService';

const NOTIFY_USER_TIMEOUT = 3000;
const LoadingStates = {
    HIDING_NUMBER: 'hidingNumber',
    NOTIFYING_USER: 'notifyingUser',
    DIALING: 'dialing',
    CALL_BEGAN: 'callEnded',
    NONE: 'none'
};
const timerHandles = [];
let incomingMessageChannel = null;
export class PhoneCall extends AuthenticatedComponent {
    constructor(props) {
        super(props);
        const otherUsername = this.props.navigation.getParam('username');
        this.state = {
            otherUsername,
            loadingState: LoadingStates.HIDING_NUMBER,
            loadingText: this.getLoadingText(LoadingStates.HIDING_NUMBER),

            ratingButtonStyle_ok: styles.unselectedRatingButton,
            ratingTextStyle_ok: styles.unselectedRatingText,
            iconColor_ok: '#efefef',
            ratingButtonStyle_good: styles.unselectedRatingButton,
            ratingTextStyle_good: styles.unselectedRatingText,
            iconColor_good: '#efefef',
            ratingButtonStyle_great: styles.unselectedRatingButton,
            ratingTextStyle_great: styles.unselectedRatingText,
            iconColor_great: '#efefef',
        };

        this.props.navigation.addListener(
            'didBlur',
            _ => {
              this.state.callSocket.disconnect();
            }
        );
        
        initializeCall(otherUsername).then(
            virtualNumber => {
                this.setState({ 
                    virtualNumber,
                    loadingState: LoadingStates.NOTIFYING_USER,
                    loadingText: this.getLoadingText(LoadingStates.NOTIFYING_USER)
                });
                const notifyUserTimeout = setTimeout(self => {
                    self.beginListenForCallConnected().catch(_ => {
                        alert('There was a problem getting call information.');
                    });
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
        );
    }

    componentWillUnmount() {
        if (incomingMessageChannel) {
            incomingMessageChannel.unbind('call-begin');
        }
        timerHandles.forEach(handle => {
            clearTimeout(handle);
        });
    }

    beginListenForCallConnected = async () => {
        const socketRecieveId = await getSocketReceiveId();
        const socket = getPusherInstance(); 
        this.setState({ callSocket: socket });

        const incomingMessageChannel = socket.subscribe(socketRecieveId);
        incomingMessageChannel.bind('call-begin', event => {
            this.setState({
                loadingState: LoadingStates.CALL_BEGAN,
                callId: event.callId
            });
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

    ratingPressed = (selectedRating) => {
        const updatedState = this.state;
        const possibleRatings = ['ok', 'good', 'great'];
        possibleRatings.forEach(rating => {
            updatedState['ratingButtonStyle_' + rating] = styles.unselectedRatingButton;
            updatedState['ratingTextStyle_' + rating] = styles.unselectedRatingText;
            updatedState['iconColor_' + rating] = '#efefef';
        })

        updatedState['ratingButtonStyle_' + selectedRating] = styles.selectedRatingButton;
        updatedState['ratingTextStyle_' + selectedRating] = styles.selectedRatingText;
        updatedState['iconColor_' + selectedRating] = '#222';
        updatedState.selectedRating = selectedRating;

        this.setState(updatedState);
    }

    submitRating = () => {
        submitCallRating(this.state.callId, this.state.selectedRating).then(
            _ => {
                this.goTo('Home');
            },
            _ => {
                alert('There was a problem submitting your rating.');
            }
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.loadingState !== LoadingStates.CALL_BEGAN && 
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

                {
                    this.state.loadingState === LoadingStates.CALL_BEGAN && 
                    <View style={styles.loadingView}>
                        <Text style={styles.loadingText}>{'call connected'}</Text>
                        <Text style={styles.subtext}>{'How do you rate the person you talked with?'}</Text>
                        <View style={styles.ratingContainer}>
                            <TouchableOpacity 
                                style={[styles.ratingButton, this.state.ratingButtonStyle_ok]}
                                onPress={() => this.ratingPressed('ok')}
                                >
                                <Icon size={36} name='emoticon-neutral-outline' type='material-community' color={this.state.iconColor_ok} />
                                <Text style={[styles.ratingText, this.state.ratingTextStyle_ok]}>{'ok'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.ratingButton, this.state.ratingButtonStyle_good]}
                                onPress={() => this.ratingPressed('good')}
                                >
                                <Icon size={36} name='emoticon-happy-outline' type='material-community' color={this.state.iconColor_good} />
                                <Text style={[styles.ratingText, this.state.ratingTextStyle_good]}>{'good'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.ratingButton, this.state.ratingButtonStyle_great]}
                                onPress={() => this.ratingPressed('great')}
                                >
                                <Icon size={36} name='emoticon-excited-outline' type='material-community' color={this.state.iconColor_great} />
                                <Text style={[styles.ratingText, this.state.ratingTextStyle_great]}>{'great'}</Text>
                            </TouchableOpacity>
                        </View>

                        {
                            this.state.selectedRating && 
                            <TouchableOpacity 
                                style={[styles.button, styles.submitRatingButton]}
                                onPress={this.submitRating}
                                >
                                <Text style={styles.submitRatingButtonText}>{'submit rating'}</Text>
                            </TouchableOpacity>
                        }
                    </View>
                }

                <TouchableOpacity 
                    style={[styles.button, styles.homeButton]}
                    onPress={() => this.goTo('Home')}
                    >
                    <Icon size={28} name='home' type='font-awesome' color='#222' />
                    <Text style={[styles.buttonText, styles.homeButtonText]}>{'home'}</Text>
                </TouchableOpacity>

                {/* TODO: event: call started, Pusher to change to in-call view (v1.1?) */}
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
        marginTop: 20,
        backgroundColor: '#ddd',
        borderColor: '#aaa',
        borderRadius: 2,
        borderWidth: 1
    },
    callButton: {
        marginTop: 20,
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
    },
    ratingContainer: {
        flexDirection: 'row'
    },
    ratingButton: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 25,
        paddingRight: 25,
        margin: 10,
        alignItems: 'center'
    },
    unselectedRatingButton: {
        backgroundColor: '#444'
    },
    selectedRatingButton: {
        backgroundColor: '#dedede'
    },
    ratingText: {
        fontSize: 18
    },
    unselectedRatingText: {
        color: '#efefef'
    },
    selectedRatingText: {
        color: '#222'
    },
    submitRatingButton: {
        marginTop: 20,
        backgroundColor: 'blue'
    },
    submitRatingButtonText: {
        fontSize: 24,
        color: '#efefef'
    }
});