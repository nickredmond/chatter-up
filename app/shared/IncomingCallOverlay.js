import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { getSocketReceiveId } from '../services/AuthService';
import { getPusherInstance, getFormattedPhoneNumber } from './Constants';
import { TouchableOpacity } from 'react-native-gesture-handler';

export class IncomingCallOverlay extends React.Component {
    constructor(props) {
        super(props);
        // this.state = { visible: false };
        this.state = {
            visible: true,
            phoneNumber: '19289253113',
            username: 'littlesg54'
        };

        this.beginListenIncomingCalls().catch(_ => {
            alert('Error listening for incoming calls.');
        });
    }

    beginListenIncomingCalls = async () => {
        const socketRecieveId = await getSocketReceiveId();
        const socket = getPusherInstance();
        const channel = socket.subscribe(socketRecieveId);
        
        channel.bind('incoming-call', incomingCallMessage => {
            this.setState({
                visible: true,
                phoneNumber: incomingCallMessage.phoneNumber,
                username: incomingCallMessage.username
            });
        });
    }

    getIncomingCallMessage = () => {
        const formattedNumber = getFormattedPhoneNumber(this.state.phoneNumber);
        return 'You should soon receive a call from ' + formattedNumber + 
            ', which is user "' + this.state.username + '".';
    }

    dismissPressed = () => {
        this.setState({ visible: false });
    }

    getStyle = (visibleStyle) => {
        return this.state.visible ? visibleStyle : { transform: [{scale: 0}] };
    }

    render() {
        if (this.state.visible) {
            return (
                <View style={styles.overlayContainer}>
                    <Text style={styles.title}>{'incoming call'}</Text>
                    <Text style={styles.overlayMessage}>{this.getIncomingCallMessage()}</Text>
                    <TouchableOpacity style={styles.dismissButton} onPress={this.dismissPressed}>
                        <Text style={styles.dismissButtonText}>{'ok'}</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     backgroundColor: '#222',
    //     alignItems: 'center'
    // }
    overlayContainer: {
        position: 'absolute',
        top: 10,
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dedede'
        //height: 100
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },  
    overlayMessage: {
        fontSize: 18
    },
    dismissButton: {
        backgroundColor: '#454545',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 25,
        paddingRight: 25,
        marginTop: 15
    },
    dismissButtonText: {
        color: '#efefef',
        fontSize: 18
    }
});