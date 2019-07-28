import { AsyncStorage } from 'react-native';
import { getApiUrl } from '../shared/Constants';
import { getUserToken, authenticate } from './AuthService';

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
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                text: 'I get up every morning and it\'s going to be a great day. You never know when it\'s going to be over, so I refuse to have a bad day.',
                author: 'Paul Henderson'
            })
        }, 1000);
    })
}

export const getUsers = () => {
    return sendAuthenticatedRequest('/users');
}

export const getUserProfileInfo = (username) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                username,
                isOnline: false,
                lastOnline: new Date(2019, 5, 29), // Date, else null if online
                coolPoints: 1097,
                badges: [
                    {
                        icon: 'hearing',
                        name: 'Good Listener',
                        description: 'Makes an effort to listen attentively without interrupting.'
                    },
                    {
                        icon: 'grade',
                        name: 'A-Player',
                        description: 'Has taken at least 50 calls, and has spent ample time with many calls.'
                    },
                    {
                        icon: 'terrain',
                        name: 'Rock the World',
                        description: 'Has been users\' "rock" by remaining calm and objective while helping people work through difficult situations.'
                    },
                    {
                        icon: 'sentiment-satisfied',
                        name: 'Friend in Me',
                        description: 'Is very friendly and helps bring cheer or solace to others.'
                    },
                    {
                        icon: 'directions',
                        name: 'Wise One',
                        description: 'Known for providing guidance and direction that has helped others move past difficult times.'
                    },
                    {
                        icon: 'favorite',
                        name: 'Superstar',
                        description: 'Has been regarded by at least 100 different users, and is a shining example of what keeps the world moving \'round.'
                    },
                    {
                        icon: 'watch',
                        name: 'The Great Protector',
                        description: 'Has reported numerous individuals who were determined to be unwelcome on the platform. In other words, keeps us safe from trolls.'
                    }
                ],
                about: 'I just love trolling people and making them feel bad about themselves... jk. ' + 
                    'I\'ve been told I\'m a pretty cool dude, and I like talking with people because sometimes people ' + 
                    'have interesting things to say. Other times, not so much.'
            })
        }, 1);
    })
}

export const openChatConnection = (username) => {
    return new Promise((resolve, reject) => {
        sendAuthenticatedRequest('/chat/connect', { username }).then(
            response => {
                resolve(response.channelId);
            },
            _ => {
                reject('There was a problem connecting to chat :(');
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

export const doesUsernameExist = (username) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const result = Math.random() >= 0.5;
            resolve(result);
        }, 500);
    })
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
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 2000);
    })
}

export const initializeCall = (username) => {
    return new Promise((resolve, reject) => {
        sendAuthenticatedRequest('/call/initialize', { username }).then(
            response => {
                resolve(response.virtualNumber);
            },
            _ => {
                reject('There was a problem connecting the call :(');
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