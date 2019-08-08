import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { ChatterUpLoadingSpinner } from './partial/ChatterUpLoadingSpinner';
import { OnlineStatusDot } from './partial/OnlineStatusDot';
import { getMessageLists } from '../services/ChatterUpService';
import moment from 'moment';
import { AuthenticatedComponent } from '../shared/AuthenticatedComponent';
import { IncomingCallOverlay } from '../shared/IncomingCallOverlay';

export class Messages extends AuthenticatedComponent {
    static navigationOptions = {
        title: 'messages'
    };

    constructor(props) {
        super(props);
        this.state = { isLoading: true };

        getMessageLists().then(
            messagePreviews => {
                messagePreviews.sort((a, b) => b.lastMessageDate - a.lastMessageDate);
                this.setState({
                    messagePreviews,
                    isLoading: false
                });
            },
            error => {
                if (error && error.isSuspended) {
                    this.goTo('Suspended');
                }
                else {
                    alert('There was a problem retrieving messages.');   
                }
            }
        )
    }

    messagePreviewPressed = (username, channelId) => {
        this.goTo('InstantMessage', { username, channelId });
    }

    renderList = ({ item: messagePreview }) => {
        const dateSentText = moment(messagePreview.lastMessageDate).fromNow();
        let previewText = messagePreview.lastMessagePreview;
        if (previewText.length >= 30) {
            previewText += '...';
        }
        let truncatedName = messagePreview.username;
        if (truncatedName.length > 16) {
            truncatedName = messagePreview.username.substring(0, 15) + '...';
        }

        return (
            <TouchableOpacity 
                style={styles.messagePreviewBubble} 
                onPress={() => this.messagePreviewPressed(messagePreview.username, messagePreview.channelId)}
                >
                <View style={styles.messagePreviewHeader}>
                    <OnlineStatusDot 
                        containerStyle={styles.statusDot} 
                        isOnline={messagePreview.isOnline}></OnlineStatusDot>
                    <Text style={styles.messagePreviewUsername}>{ truncatedName }</Text>
                    <Text style={styles.dateSentText}>{ dateSentText }</Text>
                </View>
                <Text style={styles.messagePreviewText}>{ previewText }</Text>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state && this.state.isLoading && 
                    <ChatterUpLoadingSpinner></ChatterUpLoadingSpinner>
                }

                {
                    this.state && !this.state.isLoading && 
                    <FlatList 
                        style={{flex: 1, alignSelf: 'stretch'}}
                        data={this.state.messagePreviews} 
                        renderItem={this.renderList}
                        >
                    </FlatList>
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
        backgroundColor: '#222',
        alignItems: 'center'
    },
    messagePreviewBubble: {
        backgroundColor: '#88aaff',
        borderRadius: 5,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        padding: 10
    },
    messagePreviewHeader: {
        flexDirection: 'row'
    },
    messagePreviewUsername: {
        flex: 4,
        marginLeft: 10,
        color: '#222',
        fontSize: 22
    },
    dateSentText: {
        flex: 2,
        color: '#444',
        fontSize: 18
    },
    statusDot: {
        marginTop: 5,
        marginLeft: 5
    },
    messagePreviewText: {
        color: '#333',
        fontSize: 18,
        marginLeft: 10,
        marginTop: 5
    }
});