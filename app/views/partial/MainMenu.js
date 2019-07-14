import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
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
                <View style={{flex: 1}}>
                    <View style={[styles.buttonRow, styles.topButtonRow]}>
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity style={[styles.button, styles.menuButtonLeft, styles.chatButton]}>
                                <Icon size={72} name='phone' type='font-awesome' color='#efefef' />
                                <ChatterUpText style={styles.buttonText} textValue={'chat'}></ChatterUpText>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity style={[styles.button, styles.menuButtonRight, styles.profileButton]}>
                                <Icon size={72} name='user' type='font-awesome' color='#efefef' />
                                <ChatterUpText style={styles.buttonText} textValue={'profile'}></ChatterUpText>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.buttonRow}>
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity style={[styles.button, styles.menuButtonLeft, styles.supportButton]}>
                                <Icon size={72} name='question' type='font-awesome' color='#efefef' />
                                <ChatterUpText style={styles.buttonText} textValue={'support'}></ChatterUpText>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity style={[styles.button, styles.menuButtonRight, styles.logOutButton]}>
                                <Icon size={72} name='arrow-right' type='font-awesome' color='#efefef' />
                                <ChatterUpText style={styles.buttonText} textValue={'log out'}></ChatterUpText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    title: {
        fontSize: 28
    },
    buttonRow: {
       width: '100%',
        flexDirection: 'row'
    },
    topButtonRow: {
        marginBottom: 10
    },  
    buttonWrapper: {
        flex: 1
    },
    buttonText: {
        fontSize: 32
    },
    button: {
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center'
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
        backgroundColor: 'green'
    },
    profileButton: {
        backgroundColor: 'blue'
    },
    supportButton: {
        backgroundColor: 'purple'
    },
    logOutButton: {
        backgroundColor: '#555'
    }
});