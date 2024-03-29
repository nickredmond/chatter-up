import { AsyncStorage } from 'react-native';
import { getApiUrl, getPusherInstance } from '../shared/Constants';
import { getUserToken, authenticate } from './AuthService';
import { SUSPENDED_STATUS, CALLS_TEMPORARILY_UNAVAILABLE_STATUS } from '../shared/Constants';

export const sendAuthenticatedRequest = (path, body, hasResponse) => {
    return new Promise((resolve, reject) => {
        getUserToken().then(
            token => {
                const requestBody = body || {};
                requestBody.token = token; 
                fetch(getApiUrl() + path, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                }).then(
                    response => {
                        if (response.ok) {
                            const parseResponse = (hasResponse !== false);
                            if (parseResponse) {
                                response.json().then(responseBody => {
                                    resolve(responseBody);
                                });
                            }
                            else {
                                resolve(true);
                            }
                        }
                        else if (response.status === SUSPENDED_STATUS) {
                            reject({ isSuspended: true });
                        }
                        else if (response.status === CALLS_TEMPORARILY_UNAVAILABLE_STATUS) {
                            reject({ areCallsUnavailable: true });
                        }
                        else {
                            reject('There was a problem communicating with server');
                        }
                    },
                    _ => {
                        reject('There was a problem communicating with server');
                    }
                )
            },
            _ => {
                reject('There was a problem reading from device storage.');
            }
        );
    });
}

export const getUsername = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('username', (err, username) => {
            if (err) {
                reject('Error reading from device storage.');
            }
            else {
                resolve(username);
            }
        });
    });
}

export const getRandomQuote = () => {
    return sendAuthenticatedRequest('/quote');
}

export const getUsers = () => {
    return sendAuthenticatedRequest('/users');
}

export const getUserProfileInfo = (username) => {
    return sendAuthenticatedRequest('/user', { username });
}

export const openChatConnection = (username) => {
    return new Promise((resolve, reject) => {
        sendAuthenticatedRequest('/chat/connect', { username }).then(
            response => {
                resolve(response.channelId);
            },
            error => {
                reject(error);
            }
        );
    });
}

export const getMessages = (channelId) => {
    return sendAuthenticatedRequest('/chat/messages', { channelId });
}

export const sendMessage = (channelId, message) => {
    const hasResponse = false
    return sendAuthenticatedRequest('/chat/message', { channelId, content: message }, hasResponse);
}

export const getMessageLists = () => {
    return sendAuthenticatedRequest('/messages/list');
}

export const doesUsernameExist = async (username) => {
    const responseBody = await sendAuthenticatedRequest('/username/exists', { username });
    return responseBody.exists;
}

// todo: maybe get these from server so they may updated on the fly? 
export const getReportCategories = () => {
    return new Promise((resolve) => {
        resolve([
            'belittling',
            'shaming',
            'soliciting',
            'doxxing',
            'trolling',
            'unwelcome advances',
            'other'
        ]);
    })
}

export const submitUserReport = (userReport) => {
    const hasResponse = false;
    return sendAuthenticatedRequest('/report', userReport, hasResponse);
}

export const initializeCall = (username) => {
    return new Promise((resolve, reject) => {
        sendAuthenticatedRequest('/call/initialize', { username }).then(
            response => {
                resolve(response.virtualNumber);
            },
            error => {
                reject(error);
            }
        );
    });
}

/** SETUP FUNCTIONS */

const userErrorPossibleRequest = (path, body, userErrorResponse) => {
    return new Promise((resolve, reject) => {
        getUserToken().then(
            token => {
                const requestBody = body;
                requestBody.token = token; 
                fetch(getApiUrl() + path, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                }).then(
                    response => {
                        if (response.ok) {
                            resolve(true);
                        }
                        else if (response.status === 400) {
                            reject(userErrorResponse);
                        }
                        else {
                            reject('There was a problem with the request.');
                        }
                    },
                    _ => {
                        reject('There was a problem communicating with server.');
                    }
                )
            },
            _ => {
                reject('There was a problem reading from device storage.');
            }
        );
    });
}

export const submitPhoneNumber = (phoneNumber) => {
    const errorResponse = { isNumberTaken: true };
    return userErrorPossibleRequest('/user/phone', { phoneNumber }, errorResponse);
}

export const submitConfirmationCode = (confirmationCode) => {
    const body = { verificationNumber: confirmationCode };
    const errorResponse = { invalidCode: true };
    return userErrorPossibleRequest('/user/phone/verify', body, errorResponse);
}

export const submitAboutMe = (aboutMe) => {
    const hasResponse = false;
    return sendAuthenticatedRequest('/profile/about', { aboutMe }, hasResponse);
}

/** END: SETUP FUNCTIONS */

export const setPhoneCallsEnabled = (enabled) => {
    const hasResponse = false;
    const actionPath = enabled ? 'enable' : 'disable';
    return sendAuthenticatedRequest('/profile/calls/' + actionPath, null, hasResponse);
}

export const blockUser = (username) => {
    const hasResponse = false;
    return sendAuthenticatedRequest('/username/block', { username }, hasResponse);
}

export const submitCallRating = (callId, rating) => {
    const hasResponse = false;
    return sendAuthenticatedRequest('/call/' + callId + '/rate', { rating }, hasResponse);
}

export const releaseVirtualNumber = (virtualNumber) => {
    const hasResponse = false;
    return sendAuthenticatedRequest('/virtualNumber/release', { virtualNumber }, hasResponse);
}

export const sendSupportRequest = (description) => {
    const hasResponse = false;
    return sendAuthenticatedRequest('/contact', { description }, hasResponse);
}

export const getFaqs = () => {
    return sendAuthenticatedRequest('/faq');
}