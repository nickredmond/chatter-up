import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { logOut } from '../../services/AuthService';
import { ChatterUpText } from './ChatterUpText';
import { getRandomQuote } from '../../services/ChatterUpService';

export class MainMenu extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        getRandomQuote().then(
            quote => {
                this.setState({ quote });
            },
            errorMessage => {
                alert(errorMessage);
            }
        );
    }

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
                <View style={styles.buttonsContainer}>
                    <View style={[styles.buttonRow, styles.topButtonRow]}>
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity style={[styles.button, styles.menuButtonLeft, styles.chatButton]} 
                                onPress={() => this.props.goTo('Chat')}>
                                <Icon size={72} name='phone' type='font-awesome' color='#efefef' />
                                <ChatterUpText style={styles.buttonText} textValue={'chat'}></ChatterUpText>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity style={[styles.button, styles.menuButtonRight, styles.messagesButton]}>
                                <Icon size={72} name='comment' type='font-awesome' color='#efefef' />
                                <ChatterUpText style={styles.buttonText} textValue={'messages'}></ChatterUpText>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.buttonRow}>
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity style={[styles.button, styles.menuButtonLeft, styles.profileButton]}>
                                <Icon size={72} name='user' type='font-awesome' color='#efefef' />
                                <ChatterUpText style={styles.buttonText} textValue={'profile'}></ChatterUpText>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity style={[styles.button, styles.menuButtonRight, styles.supportButton]}>
                                <Icon size={72} name='question' type='font-awesome' color='#efefef' />
                                <ChatterUpText style={styles.buttonText} textValue={'support'}></ChatterUpText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {
                    this.state && this.state.quote &&
                    <View style={styles.quoteContainer}>
                        <Text style={styles.quote}>{'"' + this.state.quote.text + '"' }</Text>
                        <Text style={styles.quoteAuthor}>{ '-- ' + this.state.quote.author }</Text>
                    </View>
                }
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.logOutButton} onPress={() => this.logOut()}>
                        <Icon size={36} name='arrow-right' type='font-awesome' color='#efefef' />
                        <ChatterUpText style={[styles.buttonText, styles.logOutButtonText]} textValue={'log out'}></ChatterUpText>
                    </TouchableOpacity>
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
    buttonsContainer: {
        flex: 1,
        paddingBottom: 10
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
    messagesButton: {
        backgroundColor: 'blue'
    },
    profileButton: {
        backgroundColor: '#D80058'
    },
    supportButton: {
        backgroundColor: 'purple'
    },
    quoteContainer: {
        flex: 1,
        marginTop: 50,
        paddingTop: 10
    },  
    quote: {
        color: '#efefef',
        fontSize: 24,
        marginTop: 20,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 5,
        fontStyle: 'italic'
    },
    quoteAuthor: {
        color: '#efefef',
        fontSize: 20,
        marginLeft: 10,
        marginRight: 10,
        textAlign: 'right'
    },
    logOutButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#555',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20
    },
    logOutButtonText: {
        marginLeft: 10
    }
});