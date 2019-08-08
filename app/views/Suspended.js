import React from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { logOut } from '../services/AuthService';

export class Suspended extends React.Component {
    static navigationOptions = {
        title: 'suspended',
        headerLeft: null
    };

    constructor(props) {
        super(props);
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

    getDescription = () => {
        return 'TalkItOut has determined your behavior violated our community guidelines and may ' + 
            'threaten the ability of other users to make use of our platform in a safe and effective way. ' + 
            'Your account has been suspended as a result, and you will not be able to use the app until ' + 
            'further notice. You should receive an email from support@togethertalking.com that explains ' + 
            'why your account was suspended in more detail. Refer to https://togethertalking.com/community-guidelines ' +
            'for more info on expected behavior whilst using TalkItOut.';
    }

    logOut = () => {
        logOut().then(isSuccess => {
            if (isSuccess) {
                this.props.navigation.navigate('Home', { loggedOut: true });
            }
            else {
                alert('There was an issue logging out.');
            }
        }, () => { alert('There was an issue logging out.'); });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{'account suspended'}</Text>
                <Text style={styles.description}>{this.getDescription()}</Text>
                <TouchableOpacity style={styles.logOutButton} onPress={() => this.logOut()}>
                    <Icon size={36} name='arrow-right' type='font-awesome' color='#222' />
                    <Text style={styles.logOutButtonText}>{'log out'}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
        alignItems: 'center'
    },
    title: {
        marginTop: 15,
        fontSize: 36,
        color: '#efefef'
    },
    description: {
        marginTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 20,
        color: '#ddd'
    },
    logOutButton: {
        flexDirection: 'row',
        backgroundColor: '#ddd',
        borderColor: '#aaa',
        borderRadius: 2,
        borderWidth: 1,
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20
    },
    logOutButtonText: {
        fontSize: 32,
        marginLeft: 10,
        color: '#222'
    }
});