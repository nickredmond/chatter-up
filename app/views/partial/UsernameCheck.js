import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import { ChatterUpLoadingSpinner } from '../partial/ChatterUpLoadingSpinner';
import { doesUsernameExist } from '../../services/ChatterUpService';

export class UsernameCheck extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: this.props.username || '',
            usernameFound: null,
            inputLabelText: this.props.inputLabelText || 'username'
        };
    }

    componentWillReceiveProps(props) {
        if (props.usernameRequired !== this.state.usernameRequired) {
            this.setState({ usernameRequired: props.usernameRequired });
        }
    }

    getUsernameNotFoundMessage = () => {
        return 'We couldn\'t find that username. If you can\'t remember it then we will try our best ' + 
            'to find a match, and will let you know either way.';
    }

    usernameValueChanged = (username) => {
        this.setState({ 
            username, 
            usernameRequired: false,
            usernameFound: null 
        });
        this.props.usernameChanged(username);
    }

    checkUsernameValue = () => {
        const username = this.state.username;
        if (username) {
            this.setState({ searchingUsername: true });
            doesUsernameExist(username).then(
                wasUsernameFound => {
                    this.setState({ 
                        usernameFound: wasUsernameFound,
                        searchingUsername: false
                    });
                },
                error => {
                    if (error && error.isSuspended) {
                        alert('Your account has been suspended.');
                    }
                    else {
                        alert('There was a problem checking username value.');   
                    }
                }
            );
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={[styles.inputLabel, styles.usernameInputLabel]}>{this.state.inputLabelText}</Text>
                <View style={styles.usernameInputGroup}>
                    <TextInput 
                        value={this.state.username}
                        style={[styles.input, styles.usernameInput]}
                        onChangeText={this.usernameValueChanged}
                        placeholder={'Enter username...'}
                        placeholderTextColor={'#888'}>
                    </TextInput>
                    {
                        !this.state.searchingUsername && this.state.usernameFound === null &&
                        <TouchableOpacity 
                            style={[styles.usernameCheckButton, styles.enabledCheckButton]}
                            onPress={this.checkUsernameValue} 
                            >
                            <Text style={styles.usernameCheckButtonText}>{'check'}</Text>
                        </TouchableOpacity>
                    }
                    {
                        !this.state.searchingUsername && this.state.usernameFound === false && 
                        <TouchableOpacity disabled style={[styles.usernameCheckButton, styles.disabledCheckButton]}>
                            <Text style={styles.usernameCheckButtonText}>{'check'}</Text>
                        </TouchableOpacity>
                    }
                    {
                        !this.state.searchingUsername && this.state.usernameFound === true && 
                        <TouchableOpacity disabled style={[styles.usernameCheckButton, styles.foundCheckButton]}>
                            <Icon size={24} name='check' style='font-awesome'></Icon>
                        </TouchableOpacity>
                    }
                    {
                        this.state.searchingUsername && 
                        <TouchableOpacity disabled style={[styles.usernameCheckButton, styles.disabledCheckButton]}>
                            <ChatterUpLoadingSpinner size={'small'} withoutMargin={true}></ChatterUpLoadingSpinner>
                        </TouchableOpacity>
                    }
                </View>
                {
                    (this.state.usernameFound === false) && 
                    <Text style={styles.validationMessage}>{this.getUsernameNotFoundMessage()}</Text>
                }
                {
                    (this.state.usernameFound === true) && 
                    <Text style={styles.usernameFoundMessage}>{'Username found.'}</Text>
                }
                {
                    this.state.usernameRequired && 
                    <Text style={styles.validationMessage}>{'Username is required.'}</Text>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center'
    },
    inputLabel: {
        color: '#efefef',
        fontSize: 18
    },
    usernameInputLabel: {
        marginTop: 20
    },
    input: {
        backgroundColor: '#ddd'
    },
    usernameInputGroup: {
        flexDirection: 'row',
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    usernameInput: {
        flex: 1,
        paddingLeft: 5,
        fontSize: 18
    },  
    usernameCheckButton: {
        padding: 5
    },
    enabledCheckButton: {
        backgroundColor: 'blue'
    },
    disabledCheckButton: {
        backgroundColor: '#444'
    },
    foundCheckButton: {
        backgroundColor: '#aaddaa'
    },
    usernameCheckButtonText: {
        color: '#efefef',
        fontSize: 20
    },
    usernameFoundMessage: {
        color: '#ccefcc',
        alignSelf: 'flex-start',
        paddingLeft: 10,
        paddingTop: 5
    },
    validationMessage: {
        color: '#efcccc',
        alignSelf: 'flex-start',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5
    }
});