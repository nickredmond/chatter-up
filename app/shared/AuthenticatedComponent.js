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
                                    alert('There was a problem authenticating your account.');
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
}