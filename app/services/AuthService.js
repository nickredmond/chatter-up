import { AsyncStorage } from 'react-native';
import { getApiUrl } from '../shared/Constants';

// todo: refresh token periodically
export const authenticate = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('user-token', (err, token) => {
            if (err) {
                reject('Error reading values from device.');
            }
            else if (token) {
                fetch(getApiUrl() + '/authenticate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token })
                }).then(
                    response => {
                        if (response.ok) {
                            response.json().then(responseBody => {
                                AsyncStorage.setItem('user-token', responseBody.refreshedToken, (err) => {
                                    if (err) {
                                        reject('Error using device storage.');
                                    }
                                    else {
                                        setLastLogin().then(
                                            () => { 
                                                resolve({
                                                    isValid: true,
                                                    isPhoneNumberConfirmed: responseBody.isPhoneNumberConfirmed || false,
                                                    phoneNumberExists: responseBody.phoneNumberExists || false
                                                }); 
                                            },
                                            () => { reject('Error using device storage.') }
                                        )
                                    }
                                });
                            });
                        }
                        else if (response.status === 400 || response.status === 401) {
                            resolve({ isValid: false });
                        }
                        else {
                            reject('Error while authenticating.');
                        }
                    }
                );
            }
            else {
                resolve({ isValid: false });
            }
        })
    });
}

export const saveAuthResponseData = (username, response, resolve, reject) => {
    AsyncStorage.setItem('username', username, (err) => {
        if (err) {
            reject('Error saving to device storage.');
        }
        else {
            AsyncStorage.setItem('user-token', response.token, (err) => {
                if (err) {
                    reject('Error saving to device storage.');
                }
                else {
                    AsyncStorage.setItem('socket-receive-id', response.socketReceiveId, (err) => {
                        if (err) {
                            reject('Error saving to device storage.');
                        }
                        else {
                            setLastLogin().then(
                                () => { 
                                    resolve({ 
                                        isSuccess: true,
                                        phoneNumberExists: response.phoneNumberExists,
                                        phoneNumberVerified: response.phoneNumberVerified
                                    }); 
                                },
                                () => { reject('Error using device storage.') }
                            );
                        }
                    });
                }
            });
        }
    })
}

export const createUser = (username, password, email) => {
    return new Promise((resolve, reject) => {
        fetch(getApiUrl() + '/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, email })
        }).then(
            response => {
                if (response.ok) {
                    response.json().then(responseBody => {
                        saveAuthResponseData(username, responseBody, resolve, reject);
                    });
                }
                else if (response.status === 400 || response.status === 401) {
                    response.json().then(err => {
                        resolve({ 
                            isSuccess: false, 
                            playerAlreadyExists: err.playerAlreadyExists,
                            isEmailTaken: player.isEmailTaken
                        });
                    });
                }
                else {
                    reject('Error while trying to create user.');
                }
            }
        );
    });
}

export const logIn = (username, password) => {
    return new Promise((resolve, reject) => {
        fetch(getApiUrl() + '/log-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        }).then(
            response => {
                if (response.ok) {
                    response.json().then(responseBody => {
                        saveAuthResponseData(username, responseBody, resolve, reject);
                    });
                }
                else if (response.status === 400 || response.status === 401) {
                    response.json().then(err => {
                        resolve({ isSuccess: false, playerExists: err.playerExists });
                    });
                }
                else {
                    reject('Error while trying to log in.');
                }
            }
        );
    });
}

export const logOut = () => {
    return new Promise((resolve, reject) => {
        try {
            AsyncStorage.removeItem('user-token', err => {
                if (err) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            })
        } catch(err) {
            reject('Error accessing device storage.');
        }
    })
}

export const getUserToken = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('user-token', (err, token) => {
            if (err) {
                reject('Error reading values from device.');
            }
            else {
                resolve(token);
            }
        });
    })
}
export const getLastLogin = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('last-login', (err, lastLogin) => {
            if (err) {
                reject('Error reading values from device.');
            }
            else {
                const lastLoginDate = lastLogin ? new Date(lastLogin) : null;
                resolve(lastLoginDate);
            }
        })
    })
}
export const setLastLogin = () => {
    return new Promise((resolve, reject) => {
        const lastLogin = new Date().toString();
        AsyncStorage.setItem('last-login', lastLogin, err => {
            if (err) {
                reject('Error reading values from device.');
            }
            else {
                resolve();
            }
        });
    })
}

export const getCurrentUsername = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('username', (err, username) => {
            if (err) {
                reject('Error reading values from device.');
            }
            else {
                resolve(username);
            }
        })
    });
}

export const getSocketReceiveId = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('socket-receive-id', (err, socketReceiveId) => {
            if (err) {
                reject('Error reading values from device.');
            }
            else {
                resolve(socketReceiveId);
            }
        })
    });
}