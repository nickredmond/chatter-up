import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MainMenu } from './partial/MainMenu';
import { Login } from './partial/Login';
import { authenticate } from '../services/AuthService';

export class Home extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isAuthenticated: false
        };

        authenticate().then(response => {
            this.setState({
                isAuthenticated: response.isValid,
                isLoading: false
            });

            if (response.isValid && !response.isPhoneNumberConfirmed) {
                const phoneNumberExists = response.phoneNumberExists;
                this.props.navigation.navigate('PhoneNumberConfirmation', { phoneNumberExists });
            }
        });
    }

    loggedIn = (response) => {
        this.setState({ isAuthenticated: true });

        if (!(response.phoneNumberExists && response.phoneNumberVerified)) {
            this.props.navigation.navigate('PhoneNumberConfirmation', {
                phoneNumberExists: response.phoneNumberExists
            });
        }
    }
    
    loggedOut = () => {
        this.setState({ isAuthenticated: false });
    }

    createdUser = () => {
        this.setState({ isAuthenticated: true });
        this.props.navigation.navigate('AboutMe');
    }

    goTo = (viewName, navigationParams) => {
        const { navigate } = this.props.navigation;
        if (navigationParams) {
            navigate(viewName, navigationParams);
        }
        else {
            navigate(viewName);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>talk it out</Text>

                <View style={styles.homePageContent}>
                    {
                        this.state.isLoading && 
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading...</Text>
                        </View>
                    }

                    {
                        this.state.isAuthenticated && 
                        <MainMenu 
                            goTo={this.goTo}
                            loggedOut={this.loggedOut}>
                        </MainMenu>
                    }

                    {
                        !(this.state.isLoading || this.state.isAuthenticated) && 
                        <Login 
                            createdUser={this.createdUser}
                            loggedIn={(response) => this.loggedIn(response)}>
                        </Login>
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: '#222'
    },
    loadingContainer: {
        alignItems: 'center'
    },
    loadingText: {
        fontSize: 24,
        color: '#efefef'
    },
    title: {
        fontSize: 48,
        color: '#efefef'
    },
    homePageContent: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20
    },
    donationSuccessMessage: {
        color: '#3c763d',
        fontSize: 18,
        margin: 10,
        padding: 5,
        backgroundColor: '#dff0d8',
        borderWidth: 2,
        borderColor: '#d0e9c6',
        borderRadius: 3,
        textAlign: 'center'
    }
});