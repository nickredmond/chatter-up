import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { ChatterUpText } from '../partial/ChatterUpText';
import { logIn, createUser } from '../../services/AuthService';
import { ChatterUpLoadingSpinner } from './ChatterUpLoadingSpinner';

var  EMAIL_PATTERN = /^\S+@\S+$/;
export class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            isNewUser: false,
            isProcessingAction: false
        };
    }

    setNewUser = (isNewUser) => {
        this.setState({ 
            isNewUser, 
            emailError: null,
            passwordError: null,
            confirmPasswordError: null,
            usernameError: null,
            pageError: null
        });
    }

    setPageError = (errorMessage) => {
        this.setState({ pageError: errorMessage })
    }
    clearPageError = () => {
        this.setState({ pageError: null });
    }
    setProcessingAction = (isProcessingAction) => {
        this.setState({ isProcessingAction });
    }

    doSignUp = () => {
        this.clearPageError();
        if (this.isFormValid()) {
            this.setProcessingAction(true);
            createUser(this.state.username, this.state.password, this.state.email).then(
                (response) => {
                    this.setProcessingAction(false);
                    
                    if (response.isSuccess) {
                        this.props.createdUser();
                    }
                    else if (response.playerAlreadyExists) {
                        this.setPageError('Username is already taken.');
                    }
                    else if (response.isEmailTaken) {
                        this.setPageError('Email is already taken.');
                    }
                    else {
                        this.setPageError('There was a problem creating new user.');
                    }
                },
                () => {
                    this.setProcessingAction(false);
                    this.setPageError('There was a problem creating new user.');
                }
            );
        }
    }

    doLogIn = () => {
        this.clearPageError();
        if (this.isFormValid()) {
            this.setProcessingAction(true);
            logIn(this.state.username, this.state.password).then(
                (response) => {
                    this.setProcessingAction(false);
                    
                    if (response.isSuccess) {
                        this.props.loggedIn(response);
                    }
                    else if (response.playerExists) {
                        this.setPageError('Password is incorrect.');
                    }
                    else {
                        this.setPageError('Could not find user with that username.');
                    }
                },
                () => {
                    this.setProcessingAction(false);
                    this.setPageError('There was a problem logging in.');
                }
            );
        }
    }

    isFormValid = () => {
        var isValid = !(this.state.usernameError || this.state.emailError || 
            this.statepasswordError || this.state.confirmPasswordError);

        if (isValid) {
            isValid = this.state.username || false;
            if (!isValid) {
                this.setState({ usernameError: 'Username is required.' });
            }
        }
        if (isValid) {
            isValid = this.state.password || false;
            if (!isValid) {
                this.setState({ passwordError: 'Password is required.' });
            }
        }

        if (isValid && this.state.isNewUser) {
            isValid = this.state.email || false;
            if (!isValid) {
                this.setState({ emailError: 'Email is required.' });
            }

            if (isValid) {
                isValid = this.state.confirmPassword || false;
                if (!isValid) {
                    this.setState({ confirmPasswordError: 'Confirm password is required.' });
                }
            }
        }

        return isValid;
    }

    // todo: username length limit
    setUsername = (username) => {
        if (username) {
            this.setState({ username, usernameError: null });
        }
        else {
            this.setState({
                usernameError: 'Username is required.'
            }); 
        }
    }

    setEmail = (email) => {
        if (email) {
            const isValidEmail = EMAIL_PATTERN.test(email);
            if (isValidEmail) {
                this.setState({ email, emailError: null });
            }
            else {
                this.setState({
                    emailError: 'Please enter valid email.'
                });
            }
        }
        else {
            this.setState({
                emailError: 'Email is required.'
            });
        }
    }

    setPassword = (password) => {
        if (password) {
            if (this.state.isNewUser) {
                const minPasswordLength = 8;
                if (password.length >= minPasswordLength) {
                    if (/[A-Za-z]/.test(password) && /[0-9]/.test(password)) {
                        this.setState({ password, passwordError: null });
                    }
                    else {
                        this.setState({
                            passwordError: 'Password must contain at least one letter and one number.'
                        })
                    }
                }
                else {
                    this.setState({
                        passwordError: 'Password must be at least ' + minPasswordLength + ' characters.'
                    });
                }
            }
            else {
                this.setState({ password, passwordError: null });
            }
        }
        else {
            this.setState({
                passwordError: 'Password is required.'
            })
        }
    }

    setConfirmPassword = (confirmPassword) => {
        if (this.state.password) {
            if (this.state.password === confirmPassword) {
                this.setState({ confirmPassword, confirmPasswordError: null });
            }
            else {
                this.setState({ confirmPasswordError: 'Password and confirm password do not match.' })
            }
        }
        else {
            this.setState({ confirmPassword, confirmPasswordError: null });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.pageError && 
                    <Text style={styles.pageErrorMessage}>{ this.state.pageError }</Text>
                }

                <View style={styles.formGroup}>
                    <ChatterUpText style={styles.inputLabel} textValue={'username'}></ChatterUpText>
                    <TextInput style={styles.input} onChangeText={(text) => this.setUsername(text)}></TextInput>
                </View>
                {
                    this.state.usernameError && 
                    <Text style={styles.errorMessage}>{ this.state.usernameError }</Text>
                }
                
                {
                    this.state.isNewUser && 
                    <View style={styles.formGroup}>
                        <ChatterUpText style={styles.inputLabel} textValue={'email'}></ChatterUpText>
                        <TextInput style={styles.input} onChangeText={(text) => this.setEmail(text)}></TextInput>
                    </View>
                }
                {
                    (this.state.isNewUser && this.state.emailError) && 
                    <Text style={styles.errorMessage}>{ this.state.emailError }</Text>
                }

                <View style={styles.formGroup}>
                    <ChatterUpText style={styles.inputLabel} textValue={'password'}></ChatterUpText>
                    <TextInput style={styles.input} secureTextEntry={true} onChangeText={(text) => this.setPassword(text)}></TextInput>
                </View>
                {
                    this.state.passwordError && 
                    <Text style={styles.errorMessage}>{ this.state.passwordError }</Text>
                }

                {
                    this.state.isNewUser && 
                    <View style={styles.formGroup}>
                        <ChatterUpText style={styles.inputLabel} textValue={'confirm password'}></ChatterUpText>
                        <TextInput style={styles.input} secureTextEntry={true} onChangeText={(text) => this.setConfirmPassword(text)}></TextInput>
                    </View>
                }
                {
                    (this.state.isNewUser && this.state.confirmPasswordError) && 
                    <Text style={styles.errorMessage}>{ this.state.confirmPasswordError }</Text>
                }

                {
                    this.state.isNewUser && 
                    <View>
                        {
                            !this.state.isProcessingAction && 
                            <TouchableOpacity style={styles.button} onPress={() => this.doSignUp()}>
                                <Text style={styles.buttonText}>sign up</Text>
                            </TouchableOpacity>
                        }
                        {
                            this.state.isProcessingAction && 
                            <ChatterUpLoadingSpinner></ChatterUpLoadingSpinner>
                        }
                        <View style={styles.formFooter}>
                            <ChatterUpText style={styles.footerText} textValue={'Already have an account?'}></ChatterUpText>
                            <TouchableOpacity onPress={() => this.setNewUser(false)}>
                                <ChatterUpText style={styles.link} textValue={'log in'}></ChatterUpText>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                {
                    !this.state.isNewUser && 
                    <View>
                        {
                            !this.state.isProcessingAction && 
                            <TouchableOpacity style={styles.button} onPress={() => this.doLogIn()}>
                                <Text style={styles.buttonText}>log in</Text>
                            </TouchableOpacity>
                        }
                        {
                            this.state.isProcessingAction && 
                            <ChatterUpLoadingSpinner></ChatterUpLoadingSpinner>
                        }
                        <View style={styles.formFooter}>
                            <ChatterUpText style={styles.footerText} textValue={'New kid on the block?'}></ChatterUpText>
                            <TouchableOpacity onPress={() => this.setNewUser(true)}>
                                <ChatterUpText style={styles.link} textValue={'sign up'}></ChatterUpText>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1
    },
    formGroup: {
        flexDirection: 'row',
        marginBottom: 10
    },
    errorMessage: {
        color: '#FFAAAA',
        marginBottom: 5,
        fontSize: 16
    },
    pageErrorMessage: {
        color: '#721c24',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f8d7da',
        borderWidth: 2,
        borderColor: '#f5c6cb',
        borderRadius: 3,
        textAlign: 'center'
    },
    formFooter: {
        marginTop: 10,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    link: {
        textDecorationLine: 'underline',
        marginLeft: 5,
        fontSize: 16
    },
    input: {
        backgroundColor: '#efefef',
        flex: 2,
        marginLeft: 10
    },
    button: {
        backgroundColor: '#88FF88',
        padding: 10,
        marginLeft: '25%',
        width: '50%',
        marginTop: 25
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 24
    },
    inputLabel: {
        fontSize: 18
    },
    footerText: {
        fontSize: 16
    }
});