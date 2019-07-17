import { getApiUrl } from '../shared/Constants';
import { getUserToken } from './AuthService';

export const sendAuthenticatedRequest = (path, body) => {
    return new Promise((resolve, reject) => {
        getUserToken().then(
            token => {
                body.token = token; 
                fetch(getApiUrl() + path, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }).then(
                    response => {
                        if (response.ok) {
                            response.json().then(responseBody => {
                                resolve(responseBody.users);
                            });
                        }
                        else {
                            reject(null);
                        }
                    },
                    _ => {
                        reject(null);
                    }
                )
            },
            _ => {
                reject('Problem reading from device storage.');
            }
        );
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
    // todo: get up to 5 most recently connected, then up to 5 "random" online, then fill in with random
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([
                {
                    isOnline: true,
                    username: 'rgso35',
                    coolPoints: 1097,
                    badges: 2
                },
                {
                    isOnline: false,
                    username: 'somedude',
                    coolPoints: 47,
                    badges: 0
                },
                {
                    isOnline: false,
                    username: 'everylittlethingshedoesismagic',
                    coolPoints: 35,
                    badges: 1
                },
                {
                    isOnline: true,
                    username: 'ellisBellis33',
                    coolPoints: 1200,
                    badges: 0
                },
                {
                    isOnline: false,
                    username: 'anonymousSquirrel',
                    coolPoints: 9723,
                    badges: 7
                },
                {
                    isOnline: true,
                    username: 'JessieJames',
                    coolPoints: 88,
                    badges: 2
                },
                {
                    isOnline: true,
                    username: '99redballoons',
                    coolPoints: 72,
                    badges: 0
                },
                {
                    isOnline: false,
                    username: 'dudesareweird',
                    coolPoints: 613,
                    badges: 4
                },
                {
                    isOnline: false,
                    username: 'rebecca76',
                    coolPoints: 0,
                    badges: 0
                },
                {
                    isOnline: false,
                    username: 'reggaerules',
                    coolPoints: 5,
                    badges: 1
                }
            ]);
        }, 1000);
    })
}

export const getUserProfileInfo = (username) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                username,
                isOnline: true,
                lastOnline: null, // Date
                coolPoints: 1097,
                badges: [
                    {
                        icon: 'ear',
                        name: 'Good Listener',
                        description: 'Makes an effort to listen attentively without interrupting.'
                    },
                    {
                        icon: 'mountain',
                        name: 'A-Player',
                        description: 'Has taken at least 50 calls, and has spent ample time with many calls.'
                    }
                ],
                about: 'I just love trolling people and making them feel bad about themselves... jk. ' + 
                    'I\'ve been told I\'m a pretty cool dude, and I like talking with people because sometimes people ' + 
                    'have interesting things to say. Other times, not so much.'
            })
        }, 1000);
    })
}