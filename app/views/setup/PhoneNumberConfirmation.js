import React from 'react';
import { View, StyleSheet, Text, TextInput, BackHandler } from 'react-native';
import { AuthenticatedComponent } from '../../shared/AuthenticatedComponent';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { submitPhoneNumber, submitConfirmationCode } from '../../services/ChatterUpService';
import { ChatterUpLoadingSpinner } from '../partial/ChatterUpLoadingSpinner';

export class PhoneNumberConfirmation extends AuthenticatedComponent {
    static navigationOptions = {
        title: 'confirm phone number',
        headerLeft: null
    };

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

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        return true;
    }

    getPhoneNumberSubtext = () => {
        return 'We will never share your number with anyone else, and your number will be ' +
            'hidden from other TalkItOut users. We only use it to connect your private calls ' + 
            'and to minimize "bot" users.';
    }

    getConfirmText = (index) => {
        const confirmTexts = [
            'Please feel free to start connecting with other users right away. TalkItOut is meant ' + 
                'to be a platform where users can freely express themselves anonymously in a welcoming ' + 
                'environment, so if you believe another user is acting unfriendly in harmful ways then don\'t ' +
                'hesitate to block or report the user through the "support" menu.',
            'If you have any questions then refer to the "faq" section of the "support" menu, or contact TalkItOut ' + 
                'directly via the "contact" form if you don\'t see your question in the faq.',
            'If you want users to possibly reach out to you via phone then enable incoming phone calls via "profile".',
            'Welcome to TalkItOut, and have fun!'
        ];
        return confirmTexts[index];
    }

    phoneNumberChanged = (text) => {
        this.setState({ 
            phoneNumber: text,
            isNumberTaken: false,
            invalidNumber: false
        });
    }

    phoneNumberSubmitted = () => {
        if (this.state.phoneNumber) {
            let formattedNumber = this.state.phoneNumber.replace(/\D/g, '');
            if (formattedNumber.length === 10) {
                formattedNumber = '1' + formattedNumber;
                this.setState({
                    isNumberTaken: false,
                    loading: true
                });
                submitPhoneNumber(formattedNumber).then(
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
                            alert('There was a problem saving your phone number.');
                        }
                    }
                );
            }
            else {
                this.setState({
                    invalidNumber: true
                });
            }
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
        this.props.navigation.navigate('Home', { isAuthenticated: true });
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.enteringNumber && 
                    <View style={styles.subContainer}>
                        <Text style={styles.title}>{'enter your phone #'}</Text>
                        <Text style={styles.subtext}>{this.getPhoneNumberSubtext()}</Text>
                        <TextInput 
                            style={styles.input} 
                            value={this.state.phoneNumber} 
                            placeholder={'ex: 123-456-7890'}
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
                        {
                            this.state.invalidNumber && 
                            <Text style={styles.errorMessage}>{'Please enter number in 10-digit format, including area code.'}</Text>
                        }
                    </View>
                }
                
                {
                    this.state.confirmingNumber && 
                    <View style={styles.subContainer}>
                        <Text style={styles.title}>{'enter confirmation code'}</Text>
                        <Text style={styles.subtext}>{'A confirmation code has been sent to your phone via SMS/text.'}</Text>
                        <TextInput 
                            style={styles.input} 
                            value={this.state.confirmationCode} 
                            placeholder={'confirmation code'}
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
                        <Text style={styles.confirmText}>{this.getConfirmText(0)}</Text>
                        <View style={styles.confirmTextSpacer}></View>
                        <Text style={styles.confirmText}>{this.getConfirmText(1)}</Text>
                        <View style={styles.confirmTextSpacer}></View>
                        <Text style={styles.confirmText}>{this.getConfirmText(2)}</Text>
                        <View style={styles.confirmTextSpacer}></View>
                        <Text style={styles.confirmText}>{this.getConfirmText(3)}</Text>
                        <View style={styles.confirmTextSpacer}></View>
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
        marginBottom: 10
    },
    subtext: {
        color: '#dedede',
        fontSize: 16,
        marginBottom: 15,
        marginLeft: 10,
        marginRight: 10
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
    },
    confirmText: {
        color: '#dedede',
        fontSize: 18,
        marginLeft: 10,
        marginRight: 10
    }, 
    confirmTextSpacer: {
        minHeight: 15
    }
});