import React from 'react';
import { View, StyleSheet, FlatList, Text, KeyboardAvoidingView } from 'react-native';
import { Icon } from 'react-native-elements';
import { ChatterUpText } from './partial/ChatterUpText';
import { ChatterUpLoadingSpinner } from './partial/ChatterUpLoadingSpinner';
import { getUserProfileInfo } from '../services/ChatterUpService';
import { TouchableOpacity, TextInput, ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import moment from 'moment';

export class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        
        isEditable = this.props.navigation.getParam('isCurrentUser', false);
        this.state = { 
            isLoading: true,
            isEditable
        };

        const username = this.props.navigation.getParam('username');
        getUserProfileInfo(username).then(
            userInfo => {
                this.setState({ userInfo, isLoading: false });
            },
            errorMessage => { 
                alert(errorMessage);
            }
        );
    }

    getPhoneButtonStyles = (isOnline) => {
        const phoneStyles = [styles.phoneButton];
        const statusStyle = isOnline ? styles.enabledPhoneButton : styles.disabledPhoneButton;
        phoneStyles.push(statusStyle);
        return phoneStyles;
    }

    getCoolPointsText = () => {
        return this.state.userInfo.coolPoints + ' cool points earned.';
    }

    getLastOnlineText = () => {
        return 'last online ' + moment(this.state.userInfo.lastOnline).fromNow();
    }

    phoneButtonPressed = () => {
        // todo: 
        // 0. navigate to phone call page
        // 1. try to connect phone call
        // 2. if user is already in-call (prop?) then show corresponding message
        // 3. show in-call UI with username, phone icon, time in call, etc
    }

    chatButtonPressed = () => {
        const username = this.state.userInfo.username;
        this.props.navigation.navigate('InstantMessage', { username });
    }

    badgePressed = (badge) => {
        this.setState({ selectedBadge: badge });
    }

    editAboutMe = () => {
        this.setState({ 
            isEditingAboutMe: true, 
            updatedAboutMeText: this.state.userInfo.about
        });
    }

    aboutMeCancelPressed = () => {
        this.setState({
            isEditingAboutMe: false,
            updatedAboutMeText: ''
        });
    }

    aboutMeSavePressed = () => {
        const updatedUserInfo = this.state.userInfo;
        updatedUserInfo.about = this.state.updatedAboutMeText;

        this.setState({
            isEditingAboutMe: false,
            updatedAboutMeText: '',
            userInfo: updatedUserInfo
        })
    }

    aboutMeUpdated = (text) => {
        this.setState({ updatedAboutMeText: text });
    }

    dismissBadgeInfo = () => {
        this.setState({ selectedBadge: null });
    }

    getBadgeColor = (badgeName) => {
        alert('eh')
        const isSelectedBadge = this.state.selectedBadge && this.state.selectedBadge.name === badgeName;
        if (isSelectedBadge) {alert('booya')}
        return isSelectedBadge ? '#88ff88' : '#efefef';
    }

    inputSizeChanged = () => {
        setTimeout(function() {
            this.scrollView.scrollToEnd({ animated: false });
        }.bind(this));
    }

    renderBadge = ({ item: badge }) => {
        const iconName = badge.icon;
        
        return (
            <TouchableOpacity onPress={() => this.badgePressed(badge)}>
                <Icon 
                    size={60} 
                    style={styles.badgeIcon} 
                    name={iconName} 
                    type='material' 
                    color={'#efefef'}>
                </Icon>
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
                        {
                            !this.state.isEditable && 
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
                        }
                        
                        {
                            this.state && !this.state.isEditable && 
                            <View style={styles.buttonsContainer}>
                                <View style={styles.buttonWrapper}>
                                    <TouchableOpacity 
                                        style={this.getPhoneButtonStyles(this.state.userInfo.isOnline)}
                                        disabled={!this.state.userInfo.isOnline} 
                                        onPress={() => this.phoneButtonPressed()}
                                        >
                                        <Icon size={48} name='phone' type='font-awesome' color='#efefef' />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.buttonWrapper}>
                                    <TouchableOpacity style={styles.chatButton} onPress={() => this.chatButtonPressed()}>
                                        <Icon size={48} name='comment' type='font-awesome' color='#efefef' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }

                        {
                            !this.state.isEditingAboutMe && 
                            <View style={{flex: 5}}>
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
                            </View>
                        }

                        {
                            this.state && this.state.selectedBadge && 
                            <View style={[styles.subContainer, styles.badgeInfoContainer]}>
                                <View style={styles.badgeInfoNameContainer}>
                                    <Icon 
                                        size={28} 
                                        style={styles.badgeInfoIcon}
                                        name={this.state.selectedBadge.icon} 
                                        type='material' 
                                        color={'#222'}>
                                    </Icon>
                                    <Text style={styles.badgeInfoName}>{this.state.selectedBadge.name}</Text>
                                </View>
                                <Text style={styles.badgeInfoDescription}>{this.state.selectedBadge.description}</Text>
                                <TouchableOpacity style={styles.badgeDismissButton} onPress={() => this.dismissBadgeInfo()}>
                                    <Text style={styles.badgeDismissText}>ok</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {
                            this.state && !this.state.selectedBadge && 
                            <View style={[styles.subContainer, styles.aboutMeContainer]}>
                                <View style={styles.aboutMeTitleContainer}>
                                    <Text style={styles.sectionTitle}>ABOUT ME</Text>
                                    {
                                        this.state && this.state.isEditable && !this.state.isEditingAboutMe &&
                                        <TouchableOpacity style={styles.aboutMeEditButton} onPress={() => this.editAboutMe()}>
                                            <Icon size={24} name='edit' type='font-awesome' color='#efefef'></Icon>
                                        </TouchableOpacity>
                                    }
                                </View>
                                
                                {
                                    this.state && !this.state.isEditable && 
                                    <ScrollView style={{flex: 1}}>
                                        <Text style={styles.aboutMeText}>{ this.state.userInfo.about }</Text>
                                    </ScrollView>
                                }
                                {
                                    this.state && !this.state.isEditingAboutMe && this.state.isEditable && 
                                    <TouchableWithoutFeedback onPress={() => this.editAboutMe()}>
                                        <ScrollView style={{flex: 1}}>
                                            <Text style={[styles.aboutMeText, styles.aboutMeEditableText]}>{ this.state.userInfo.about }</Text>
                                        </ScrollView>
                                    </TouchableWithoutFeedback>
                                }
                                {
                                    this.state && this.state.isEditingAboutMe && 
                                    <View>
                                        <TextInput 
                                            style={styles.aboutMeInput}
                                            value={this.state.updatedAboutMeText} 
                                            multiline={true}
                                            autoFocus={true}
                                            maxHeight={160}
                                            onChangeText={(text) => this.aboutMeUpdated(text)}
                                            >
                                        </TextInput>
                                        <View style={styles.aboutMeActionButtons}>
                                            <TouchableOpacity 
                                                style={[styles.aboutMeActionButton, styles.aboutMeCancelButton]}
                                                onPress={() => this.aboutMeCancelPressed()}
                                                >
                                                <Icon size={24} name='ban' type='font-awesome' color='#efefef'></Icon>    
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                style={[styles.aboutMeActionButton, styles.aboutMeSaveButton]}
                                                onPress={() => this.aboutMeSavePressed()}
                                                >
                                                <Icon size={24} name='check' type='font-awesome' color='#efefef'></Icon>    
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }
                            </View>
                        }
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
        marginRight: 5,
        paddingTop: 10,
        paddingBottom: 5
    },
    enabledPhoneButton: {
        backgroundColor: 'green'
    },
    disabledPhoneButton: {
        backgroundColor: '#555'
    },
    chatButton: {
        marginLeft: 5,
        paddingTop: 5,
        paddingBottom: 10,
        backgroundColor: 'blue'
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
        marginBottom: 10
    },
    aboutMeText: {
        color: '#efefef',
        fontSize: 18, 
        padding: 5
    }, 
    aboutMeEditableText: {
        borderColor: '#ccc', 
        borderRadius: 5, 
        borderWidth: 1
    },
    aboutMeInput: {
        fontSize: 18,
        backgroundColor: '#ddd'
    },
    aboutMeTitleContainer: {
        flexDirection: 'row'
    },
    aboutMeEditButton: {
        backgroundColor: '#222',
        marginLeft: 10,
        marginTop: 5
    },
    aboutMeCancelButton: {
        backgroundColor: '#B70000'
    },
    aboutMeSaveButton: {
        backgroundColor: '#00B706'
    },
    aboutMeActionButton: {
        minWidth: 100,
        paddingTop: 10,
        paddingBottom: 10
    },
    aboutMeActionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 15
    },
    badgeInfoContainer: {
        flex: 4,
        margin: 15,
        paddingLeft: 15,
        paddingRight: 15,
        alignSelf: 'stretch',
        backgroundColor: '#ddd'
    },
    badgeInfoNameContainer: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'center',
        paddingTop: 10
    },
    badgeInfoIcon: {
        paddingTop: 10
    },
    badgeInfoName: {
        color: '#222',
        fontSize: 24,
        marginLeft: 10,
        marginBottom: 5
    },
    badgeInfoDescription: {
        color: '#444',
        fontSize: 18,
        textAlign: 'center'
    },
    badgeDismissButton: {
        backgroundColor: '#555',
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 5,
        paddingBottom: 5,
        marginTop: 10
    },
    badgeDismissText: {
        color: '#efefef',
        fontSize: 22
    }
});