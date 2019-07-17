import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { ChatterUpText } from './partial/ChatterUpText';
import { ChatterUpLoadingSpinner } from './partial/ChatterUpLoadingSpinner';
import { getUserProfileInfo } from '../services/ChatterUpService';
import { TouchableOpacity } from 'react-native-gesture-handler';

export class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true };

        const username = this.props.navigation.getParam('username');
        getUserProfileInfo(username).then(
            userInfo => {
                this.setState({ userInfo, isLoading: false });
            },
            errorMessage => { // remember: pass errorMessage in all error scenarios from svc
                alert(errorMessage);
            }
        );
    }

    getCoolPointsText = () => {
        return this.state.userInfo.coolPoints + ' cool points earned.';
    }

    getLastOnlineText = () => {
        return null; // todo: use timeAgo w/ lastOnline date prop
    }

    onBadgePress = (badge) => {
        // todo: show modal/overlay with badge info
    }

    renderBadge = ({ item: badge }) => {
        const iconName = badge.icon;
        
        return (
            <TouchableOpacity onPress={() => this.onBadgePress(badge)}>
                <Icon size={60} style={styles.badgeIcon} name={iconName} type='material' color='#efefef'></Icon>
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
                    this.state && !this.state.isLoading && this.state.userInfo && 
                    <View style={styles.subContainer}>
                        <View style={{flex: 1}}>
                            {
                                this.state.userInfo.isOnline &&
                                <View style={styles.userStatusContainer}>
                                    <Icon size={24} name='circle' type='font-awesome' color='#77ff88' />
                                    <ChatterUpText style={styles.onlineStatusText} textValue={'online now'}></ChatterUpText>
                                </View>
                            }
                            {
                                !this.state.userInfo.isOnline &&
                                <View style={styles.userStatusContainer}>
                                    <Icon size={24} name='circle' type='font-awesome' color='#999' />
                                    <ChatterUpText style={styles.onlineStatusText} textValue={this.getLastOnlineText()}></ChatterUpText>
                                </View>
                            }
                        </View>
                        <View style={styles.buttonsContainer}>
                            <View style={styles.buttonWrapper}>
                                <TouchableOpacity style={styles.phoneButton}>
                                    <Icon size={48} name='phone' type='font-awesome' color='#efefef' />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.buttonWrapper}>
                                <TouchableOpacity style={styles.chatButton}>
                                    <Icon size={48} name='comment' type='font-awesome' color='#efefef' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ChatterUpText style={styles.coolPointsText} textValue={this.getCoolPointsText()}></ChatterUpText>
                        <View style={styles.badgesContainer}>
                            <Text style={styles.sectionTitle}>BADGES</Text>
                            <Text style={styles.badgesSubtitle}>(press badge for more info)</Text>
                            <FlatList 
                                data={this.state.userInfo.badges} 
                                numColumns={5}
                                style={styles.badgeList} 
                                renderItem={this.renderBadge}>
                            </FlatList>
                        </View>
                        <View style={[styles.subContainer, styles.aboutMeContainer]}>
                            <Text style={styles.sectionTitle}>ABOUT ME</Text>
                            <Text style={styles.aboutMeText}>{ this.state.userInfo.about }</Text>
                        </View>
                    </View>
                }
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
    subContainer: {
        flex: 1,
        alignItems: 'center'
    },
    userStatusContainer: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10
    },
    onlineStatusText: {
        marginLeft: 5,
        fontSize: 18
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginLeft: 10,
        marginRight: 10
    },
    buttonWrapper: {
        flex: 1
    },
    phoneButton: {
        backgroundColor: 'green',
        marginRight: 5,
        paddingTop: 10,
        paddingBottom: 5
    },
    chatButton: {
        backgroundColor: 'blue',
        marginLeft: 5,
        paddingTop: 5,
        paddingBottom: 10
    },
    coolPointsText: {
        flex: 1,
        fontSize: 20,
        marginTop: 20
    },
    badgesContainer: {
        flex: 4,
        alignItems: 'center'
    }, 
    sectionTitle: {
        color: '#ccc',
        fontSize: 24,
        fontWeight: 'bold'
    },
    badgesSubtitle: {
        color: '#dedede',
        fontSize: 18
    },
    badgeList: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 5
    },
    badgeIcon: {
        padding: 15
    },
    aboutMeContainer: {
        flex: 4,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 15,
        marginBottom: 5
    },
    aboutMeText: {
        color: '#efefef',
        fontSize: 18
    }
});