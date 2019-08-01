import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import { ChatterUpLoadingSpinner } from './partial/ChatterUpLoadingSpinner';
import { getUsers } from '../services/ChatterUpService';
import { OnlineStatusDot } from './partial/OnlineStatusDot';
import { AuthenticatedComponent } from '../shared/AuthenticatedComponent';
import { IncomingCallOverlay } from '../shared/IncomingCallOverlay';

export class Chat extends AuthenticatedComponent {
    static navigationOptions = {
        title: 'chat'
    };

    constructor(props) {
        super(props);
        this.state = { isLoading: true };
        
        getUsers().then(
            users => {
                this.setState({ users, isLoading: false });
            },
            errorMessage => {
                alert(errorMessage);
            }
        );
    }

    userSelected = (username) => {
        this.goTo('UserProfile', { username });
    }

    // CREDIT: found at https://stackoverflow.com/questions/10599933
    abbreviateNumber = (value) => {
        let newValue = value;
        if (value >= 1000) {
            const suffixes = ["", "k", "m", "b","t"];
            const suffixNum = Math.floor( (""+value).length/3 );
            let shortValue = '';
            for (var precision = 2; precision >= 1; precision--) {
                shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
                const dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
                if (dotLessShortValue.length <= 2) { break; }
            }
            if (shortValue % 1 != 0)  shortNum = shortValue.toFixed(1);
            newValue = shortValue+suffixes[suffixNum];
        }
        return newValue;
    }

    renderList = ({ item: user }) => {
        const truncatedName = user.username.length > 16 ? user.username.substring(0, 15) + '...' : user.username;
        const coolPoints = user.coolPoints ? this.abbreviateNumber(user.coolPoints) : 0;
        const badges = user.badges ? this.abbreviateNumber(user.badges) : 0;

        return (
            <TouchableOpacity style={styles.userItem} onPress={() => this.userSelected(user.username)}>
                <OnlineStatusDot isOnline={user.isOnline}></OnlineStatusDot>
                {
                    user.canBeCalled && 
                    <View style={styles.phoneIconContainer}>
                        <Icon size={24} name='phone' type='font-awesome' color='green' />
                    </View>
                }

                <Text style={styles.userItemText}>{ truncatedName }</Text>
                <View style={styles.statContainer}>
                    <Icon size={24} name='thumbs-up' type='font-awesome' color='#222' />
                    <Text style={styles.statText}>{ coolPoints }</Text>
                </View>
                <View style={styles.statContainer}>
                    <Icon size={24} name='trophy' type='font-awesome' color='#222' />
                    <Text style={styles.statText}>{ badges }</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state && this.state.isLoading && 
                    <ChatterUpLoadingSpinner></ChatterUpLoadingSpinner>
                }

                {
                    this.state && !this.state.isLoading && this.state.users && 
                    <View style={styles.usersList}>
                        <FlatList data={this.state.users} renderItem={this.renderList}></FlatList>
                    </View>
                }

                <IncomingCallOverlay 
                    navigation={this.props.navigation}
                    incomingCallChannel={this.getIncomingMessageChannel()}>
                </IncomingCallOverlay>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222'
    },
    usersList: {
        marginTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
    },
    userItem: {
        flexDirection: 'row',
        backgroundColor: '#88aaff',
        paddingLeft: 10,
        paddingRight: 5,
        paddingTop: 15,
        paddingBottom: 15,
        margin: 5
    },
    userItemText: {
        flex: 1,
        fontSize: 20,
        color: '#222',
        marginLeft: 10
    },
    statContainer: {
        flexDirection: 'row',
        marginRight: 10
    },
    statText: {
        fontSize: 20,
        marginLeft: 5
    },
    phoneIconContainer: {
        marginLeft: 10
    }
});