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

        authenticate().then(isValid => {
            this.setState({
                isAuthenticated: isValid,
                isLoading: false
            });
        });
    }

    loggedIn = () => {
        this.setState({ isAuthenticated: true });
    }
    loggedOut = () => {
        this.setState({ isAuthenticated: false });
    }

    // goToTables = () => {
    //     const { navigate } = this.props.navigation;
    //     navigate('TablesList');
    // }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>chatter up</Text>

                <View style={styles.homePageContent}>
                    {
                        this.state.isDonationProcessed && 
                        <Text style={styles.donationSuccessMessage}>Your donation has successfully been submitted.</Text>
                    }

                    {
                        this.state.isLoading && 
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading...</Text>
                        </View>
                    }

                    {
                        this.state.isAuthenticated && 
                        <MainMenu 
                            // goToTables={this.goToTables} 
                            loggedOut={this.loggedOut}>
                        </MainMenu>
                    }

                    {
                        !(this.state.isLoading || this.state.isAuthenticated) && 
                        <Login loggedIn={this.loggedIn}></Login>
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
        marginTop: 25
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