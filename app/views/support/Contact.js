import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthenticatedComponent } from '../../shared/AuthenticatedComponent';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { ChatterUpLoadingSpinner } from '../partial/ChatterUpLoadingSpinner';
import { IncomingCallOverlay } from '../../shared/IncomingCallOverlay';
import { sendSupportRequest } from '../../services/ChatterUpService';
import { Icon } from 'react-native-elements';

export class Contact extends AuthenticatedComponent {
    static navigationOptions = {
        title: 'contact'
    };

    constructor(props) {
        super(props);
        this.state = {
            description: '',
            submitting: false,
            submitted: false
        };
    }

    getPageDescription = () => {
        return 'Thanks for reaching out! We\'re happy to help, and keep in mind our support staff is limited, ' +
            'so it may take some time for us to get in touch with you. We will review your request ' + 
            'as soon as possible, and we appreciate your patience and understanding.';
    }

    descriptionChanged = (description) => {
        this.setState({ description, descriptionRequired: false });
    }

    submitPressed = () => {
        if (this.state.description) {
            this.setState({ submitting: true });
            sendSupportRequest(this.state.description).then(
                _ => {
                    this.setState({ submitting: false, submitted: true });
                },
                error => {
                    if (error && error.isSuspended) {
                        this.goTo('Suspended');
                    }
                    else {
                        alert('There was a problem submitting your request.');
                    }
                }
            )
        }
        else {
            this.setState({ descriptionRequired: true });
        }
    }

    render() {
        if (this.state.submitting) {
            return (
                <View style={styles.container}>
                    <ChatterUpLoadingSpinner></ChatterUpLoadingSpinner>

                    <IncomingCallOverlay 
                        navigation={this.props.navigation}
                        incomingCallChannel={this.getIncomingMessageChannel()}>
                    </IncomingCallOverlay>
                </View>
            )
        }
        else if (this.state.submitted) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>{'thank you!'}</Text>
                    <Text style={styles.subtext}>{'We received your information, and we look forward to assisting you.'}</Text>
                    <TouchableOpacity 
                        style={[styles.button, styles.homeButton]}
                        onPress={() => this.goTo('Home')}
                        >
                        <Icon size={28} name='home' type='font-awesome' color='#222' />
                        <Text style={[styles.buttonText, styles.homeButtonText]}>{'home'}</Text>
                    </TouchableOpacity>

                    <IncomingCallOverlay 
                        navigation={this.props.navigation}
                        incomingCallChannel={this.getIncomingMessageChannel()}>
                    </IncomingCallOverlay>
                </View>
            );
        }
        else {
            return (
                <View style={styles.container}>
                    <Text style={styles.subtext}>{this.getPageDescription()}</Text>
                    <Text style={styles.descriptionLabel}>{'description'}</Text>
                    <TextInput 
                        style={styles.descriptionInput} 
                        onChangeText={(value) => this.descriptionChanged(value)} 
                        multiline={true} 
                        textAlignVertical='top'>
                    </TextInput>
                    {
                        this.state.descriptionRequired && 
                        <Text style={styles.validationMessage}>{'Description is required.'}</Text>
                    }
                    <TouchableOpacity 
                        style={[styles.button, styles.submitButton]}
                        onPress={this.submitPressed}
                        >
                        <Text style={[styles.buttonText, styles.submitButtonText]}>{'submit'}</Text>
                    </TouchableOpacity>

                    <IncomingCallOverlay 
                        navigation={this.props.navigation}
                        incomingCallChannel={this.getIncomingMessageChannel()}>
                    </IncomingCallOverlay>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
        alignItems: 'center'
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
        marginTop: 20,
        marginBottom: 20,
        minWidth: 100
    },
    homeButton: {
        backgroundColor: '#ddd',
        borderColor: '#aaa',
        borderRadius: 2,
        borderWidth: 1
    },
    submitButton: {
        backgroundColor: 'green'
    },
    buttonText: {
        fontSize: 24,
        marginLeft: 10
    },
    homeButtonText: {
        color: '#222'
    },
    submitButtonText: {
        color: '#efefef'
    },
    title: {
        fontSize: 36,
        color: '#efefef'
    },
    subtext: {
        fontSize: 18,
        color: '#dedede',
        padding: 10
    },
    descriptionLabel: {
        fontSize: 24,
        color: '#efefef',
        fontWeight: 'bold',
        marginTop: 20
    },
    descriptionInput: {
        flex: 1,
        backgroundColor: '#ddd',
        alignSelf: 'stretch',
        marginRight: 10,
        marginLeft: 10
    },
    validationMessage: {
        color: '#efcccc',
        alignSelf: 'flex-start',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        fontSize: 16
    }
});