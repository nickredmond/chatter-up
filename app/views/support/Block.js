import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthenticatedComponent } from '../../shared/AuthenticatedComponent';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { UsernameCheck } from '../partial/UsernameCheck';
import { IncomingCallOverlay } from '../../shared/IncomingCallOverlay';
import { blockUser } from '../../services/ChatterUpService';
import { ChatterUpLoadingSpinner } from '../partial/ChatterUpLoadingSpinner';

export class Block extends AuthenticatedComponent {
    static navigationOptions = {
        title: 'block user'
    };

    constructor(props) {
        super(props);
        this.state = {
            username: ''
        };
    }

    usernameValueChanged = (username) => {
        this.setState({ username, usernameRequired: false });
    }

    submitButtonPressed = () => {
        const usernameRequired = !this.state.username;
        this.setState({ 
            usernameRequired,
            isFormSubmitted: !usernameRequired
        });

        if (!usernameRequired) {
            blockUser(this.state.username).then(
                _ => {
                    this.goTo('BlockConfirmed');
                },
                _ => {
                    alert('There was a problem sending your request to block user.');
                }
            )
        }
    }

    getDisclaimerText = () => {
        return 'Once you block this user, they will no longer be able to call or message ' + 
            'you, and they will not see any past messages between the two of you. Likewise, ' + 
            'you will not be able to call or message any users you have blocked.';
    }

    render() {
        return (
            <View style={styles.container}>
                <UsernameCheck 
                    username={this.state.username} 
                    inputLabelText={'username being blocked'}
                    usernameChanged={this.usernameValueChanged}
                    usernameRequired={this.state.usernameRequired}
                    >
                </UsernameCheck>   
                <View style={styles.disclaimer}>
                    <Text style={styles.boldText}>{'NOTE: This action cannot be undone.'}</Text>
                    <Text style={styles.disclaimerText}>{this.getDisclaimerText()}</Text>
                </View>

                {
                    !this.state.isFormSubmitted && 
                    <TouchableOpacity style={styles.confirmButton} onPress={this.submitButtonPressed}>
                        <Text style={styles.confirmButtonText}>{'block user'}</Text>
                    </TouchableOpacity>
                }
                {
                    this.state.isFormSubmitted && 
                    <ChatterUpLoadingSpinner></ChatterUpLoadingSpinner>
                }

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
    disclaimer: {
        flex: 2,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10
    },
    boldText: {
        color: '#efefef',
        fontWeight: 'bold',
        fontSize: 22
    },
    disclaimerText: {
        color: '#ddd',
        fontSize: 18
    },
    confirmButton: {
        flexDirection: 'row',
        backgroundColor: '#ddd',
        borderColor: '#aaa',
        borderRadius: 2,
        borderWidth: 1,
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20
    },
    confirmButtonText: {
        fontSize: 32,
        marginLeft: 10,
        marginRight: 10,
        color: '#222'
    }
});