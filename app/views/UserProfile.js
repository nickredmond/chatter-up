import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ChatterUpText } from './partial/ChatterUpText';
import { ChatterUpLoadingSpinner } from './partial/ChatterUpLoadingSpinner';
import { getUserProfileInfo } from '../services/ChatterUpService';

export class UserProfileComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true };

        // todo: implement this.props.username, pass as navigation param
        // todo: use this component for Profile "page"? pass this.props.isCurrentUser = true
        getUserProfileInfo(this.props.username).then(
            userInfo => {
                this.setState({ userInfo });
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

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state && this.state.isLoading && 
                    <ChatterUpLoadingSpinner></ChatterUpLoadingSpinner>
                    
                }

                {
                    this.state && !this.state.isLoading && this.state.userInfo && 
                    <View>
                        <View>
                            {
                                user.isOnline &&
                                <View>
                                    <Icon size={24} name='circle' type='font-awesome' color='#77ff88' />
                                    <ChatterUpText style={styles.onlineStatusText} textValue={'online now'}></ChatterUpText>
                                </View>
                            }
                            {
                                !user.isOnline &&
                                <View>
                                    <Icon size={24} name='circle' type='font-awesome' color='#999' />
                                    <ChatterUpText style={styles.onlineStatusText} textValue={this.getLastOnlineText()}></ChatterUpText>
                                </View>
                            }
                        </View>
                        <ChatterUpText textValue={this.getCoolPointsText()}></ChatterUpText>
                        {/* todo: design badges area */}
                        {/* todo: design "about me", maybe put "about me" title on its own line? */}
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    }
});