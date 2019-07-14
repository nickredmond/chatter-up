import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { logOut } from '../../services/AuthService';
import { ChatterUpText } from './ChatterUpText';

export class MainMenu extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    // goToTables = () => {
    //     this.props.goToTables();
    // }

    logOut = () => {
        logOut().then(isSuccess => {
            if (isSuccess) {
                this.props.loggedOut();
            }
            else {
                alert('There was an issue logging out.');
            }
        }, () => { alert('There was an issue logging out.'); });
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.menuButtonLeft, styles.chatButton]}>
                            <ChatterUpText textValue={'chat'}></ChatterUpText>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menuButtonRight, styles.profileButton]}>
                            <ChatterUpText textValue={'profile'}></ChatterUpText>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.menuButtonLeft, styles.supportButton]}>
                            <ChatterUpText textValue={'support'}></ChatterUpText>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menuButtonRight, styles.logOutButton]}>
                            <ChatterUpText textValue={'log out'}></ChatterUpText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    title: {
        fontSize: 24
    },
    buttonRow: {
        flexDirection: 'row'
    },
    menuButtonLeft: {
      marginLeft: 10,  
      marginRight: 5
    },
    menuButtonRight: {
        marginLeft: 5,
        marginRight: 10
    },
    chatButton: {

    },
    profileButton: {

    },
    supportButton: {

    },
    logOutButton: {

    }
});