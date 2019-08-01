import React from 'react';
import { getUserToken, getLastLogin, authenticate } from '../services/AuthService';

export class AuthenticatedComponent extends React.Component {
    constructor(props) {
        super(props);
        const { navigate } = this.props.navigation;

        getUserToken().then(token => {
            if (token) {
                getLastLogin().then(
                    lastLogin => {
                        let isAuthRefreshNeeded = true;
                        if (lastLogin) {
                            const now = new Date();
                            const millisSinceLogin = now - lastLogin;
                            const minutesSinceLogin = Math.round(((millisSinceLogin % 86400000) % 3600000) / 60000);
                            if (minutesSinceLogin <= 10) {
                                isAuthRefreshNeeded = false;
                            }
                        }                        
                        
                        if (isAuthRefreshNeeded) {
                            authenticate().then(
                                isSuccess => {
                                    if (!isSuccess) {
                                        navigate('Login');
                                    }
                                },
                                () => {
                                    navigate('Login');
                                }
                            )
                        }
                    },
                    () => {
                        alert('There was a problem reading app storage from device.');
                    }
                )
            }
            else {
                navigate('Login');
            }
        })
    }

    getIncomingMessageChannel = () => {
        return this.props.navigation.getParam('incomingMessageChannel');
    }

    /** Go to the given view name with optional navigation params. Will add incomingMessageChannel prop
     * as param so incoming messages through socket may be handled on any authenticated page.
     */
    goTo = (viewName, navigationParams) => {
        const { navigate } = this.props.navigation;
        const params = navigationParams || {};
        params.incomingMessageChannel = this.getIncomingMessageChannel();

        navigate(viewName, params);
    }
}