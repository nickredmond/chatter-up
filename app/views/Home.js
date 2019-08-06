import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MainMenu } from './partial/MainMenu';
import { Login } from './partial/Login';
import { authenticate, getSocketReceiveId } from '../services/AuthService';
import { IncomingCallOverlay } from '../shared/IncomingCallOverlay';
import { getPusherInstance } from '../shared/Constants';

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

        authenticate().then(
            response => {
                if (response.isValid) {
                    this.authenticated().catch(err => {
                        alert('There was a problem listening for incoming calls. ' + err);
                    });
                    if (!response.isPhoneNumberConfirmed) {
                        const phoneNumberExists = response.phoneNumberExists;
                        this.goTo('PhoneNumberConfirmation', { phoneNumberExists });
                    }
                }
                else {
                    this.setState({ isLoading: false });
                }
            },
            _ => {
                this.setState({ isLoading: false });
            });
    }

    componentWillUnmount() {
        const socket = this.state.socket;
        const socketRecieveId = this.state.socketRecieveId;
        if (socket && socketRecieveId) {
            socket.unsubscribe(socketRecieveId);
        }
    }

    authenticated = async () => {
        const socketRecieveId = await getSocketReceiveId();
        const socket = getPusherInstance(); 
        const incomingMessageChannel = socket.subscribe(socketRecieveId);

        this.setState({ 
            isAuthenticated: true, 
            isLoading: false,
            socket, 
            socketRecieveId,
            incomingMessageChannel
        });
    }

    loggedIn = (response) => {
        this.authenticated().catch(err => {
            alert('There was a problem listening for incoming calls. ' + err);
        });

        if (!(response.phoneNumberExists && response.phoneNumberVerified)) {
            this.goTo('PhoneNumberConfirmation', {
                phoneNumberExists: response.phoneNumberExists
            });
        }
    }
    
    loggedOut = () => {
        this.setState({ isAuthenticated: false });
    }

    createdUser = () => {
        this.authenticated().catch(_ => {
            alert('There was a problem listening for incoming calls.');
        });
        this.goTo('AboutMe');
    }

    goTo = (viewName, navigationParams) => {
        const { navigate } = this.props.navigation;
        const params = navigationParams || {};
        params.incomingMessageChannel = this.state.incomingMessageChannel;

        navigate(viewName, params);
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

                {
                    this.state.isAuthenticated && 
                    <IncomingCallOverlay 
                        navigation={this.props.navigation}
                        incomingCallChannel={this.state.incomingMessageChannel}
                        isEntryPoint={true}>
                    </IncomingCallOverlay>
                }
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