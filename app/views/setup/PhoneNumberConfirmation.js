import React from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { AuthenticatedComponent } from '../../shared/AuthenticatedComponent';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { submitPhoneNumber, submitConfirmationCode } from '../../services/ChatterUpService';
import { ChatterUpLoadingSpinner } from '../partial/ChatterUpLoadingSpinner';

export class PhoneNumberConfirmation extends AuthenticatedComponent {
    constructor(props) {
        super(props);

        const phoneNumberExists = this.props.navigation.getParam('phoneNumberExists', false);
        this.state = {
            phoneNumber: '',
            confirmationCode: '',
            enteringNumber: !phoneNumberExists,
            confirmingNumber: phoneNumberExists
        };
    }

    phoneNumberChanged = (text) => {
        this.setState({ phoneNumber: text });
    }

    phoneNumberSubmitted = () => {
        if (this.state.phoneNumber) {
            this.setState({
                isNumberTaken: false,
                loading: true
            });
            submitPhoneNumber(this.state.phoneNumber).then(
                _ => {
                    this.setState({
                        loading: false,
                        enteringNumber: false,
                        confirmingNumber: true
                    });
                },
                error => {
                    if (error.isNumberTaken) {
                        this.setState({ 
                            loading: false,
                            isNumberTaken: true 
                        });
                    }
                    else {
                        alert(error);
                    }
                }
            )
        }
    }

    confirmationCodeChanged = (text) => {
        this.setState({ confirmationCode: text });
    }

    confirmationCodeSubmitted = () => {
        if (this.state.confirmationCode) {
            this.setState({
                invalidCode: false,
                loading: true
            });
            submitConfirmationCode(this.state.confirmationCode).then(
                _ => {
                    this.setState({
                        loading: false,
                        confirmingNumber: false,
                        numberConfirmed: true
                    });
                },
                error => {
                    if (error.invalidCode) {
                        this.setState({ 
                            loading: false,
                            invalidCode: true 
                        });
                    }
                }
            )
        }
    }

    goHome = () => {
        this.props.navigation.navigate('Home');
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.enteringNumber && 
                    <View style={styles.subContainer}>
                        <Text style={styles.title}>{'enter your phone #'}</Text>
                        <TextInput 
                            style={styles.input} 
                            value={this.state.phoneNumber} 
                            onChangeText={(text) => this.phoneNumberChanged(text)}>
                        </TextInput>
                        {
                            !this.state.loading && 
                            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={this.phoneNumberSubmitted}>
                                <Text style={styles.buttonText}>{'submit'}</Text>
                            </TouchableOpacity>
                        }
                        {
                            this.state.loading && 
                            <ChatterUpLoadingSpinner></ChatterUpLoadingSpinner>
                        }
                        {
                            this.state.isNumberTaken && 
                            <Text style={styles.errorMessage}>{'That number is already in use.'}</Text>
                        }
                    </View>
                }
                
                {
                    this.state.confirmingNumber && 
                    <View style={styles.subContainer}>
                        <Text style={styles.title}>{'enter confirmation code'}</Text>
                        <TextInput 
                            style={styles.input} 
                            value={this.state.confirmationCode} 
                            onChangeText={(text) => this.confirmationCodeChanged(text)}>
                        </TextInput>
                        {
                            !this.state.loading && 
                            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={this.confirmationCodeSubmitted}>
                                <Text style={styles.buttonText}>{'submit'}</Text>
                            </TouchableOpacity>
                        }
                        {
                            this.state.loading && 
                            <ChatterUpLoadingSpinner></ChatterUpLoadingSpinner>
                        }
                        {
                            this.state.invalidCode && 
                            <Text style={styles.errorMessage}>{'Confirmation code not recognized.'}</Text>
                        }
                    </View>
                }

                {   
                    this.state.numberConfirmed && 
                    <View style={styles.subContainer}>
                        <Text style={styles.title}>you're all set!</Text>
                        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={this.goHome}>
                            <Text style={styles.confirmbuttonText}>home</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222'
    },
    subContainer: {
        flex: 1,
        alignItems: 'center'
    },
    title: {
        fontSize: 36,
        color: '#efefef',
        marginBottom: 15
    },
    input: {
        alignSelf: 'stretch',
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#ddd'
    },
    errorMessage: {
        color: '#ffaaaa',
        fontSize: 18,
        marginTop: 5
    },
    button: {
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        alignSelf: 'stretch',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        paddingLeft: 25,
        paddingRight: 25
    },
    submitButton: {
        backgroundColor: '#ddd',
        borderColor: '#aaa',
        borderRadius: 2,
        borderWidth: 1
    },
    confirmButton: {
        backgroundColor: 'green'
    },
    buttonText: {
        color: '#222',
        fontSize: 24
    },
    confirmbuttonText: {
        color: '#efefef',
        fontWeight: 'bold',
        fontSize: 24
    }
});