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
                                resolve(responseBody);
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
        }, 1);
    })
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

export const getMessages = (username) => {
    return new Promise((resolve, reject) => {
        resolve([
            {
                'sentBy': username,
                'dateSent': new Date("2019/07/15 07:31:22"),
                'content': 'Hey Nick, hows it going?'
            },
            {
                'sentBy': username,
                'dateSent': new Date("2019/07/16 09:42:11"),
                'content': '...u sure about that?'
            },
            {
                'sentBy': 'theonetruenick',
                'dateSent': new Date("2019/07/15 07:37:45"),
                'content': 'eh I think ill be all right, thanks 4 asking!'
            },
            {
                'sentBy': username,
                'dateSent': new Date("2019/07/15 07:37:00"),
                'content': 'u wanna talk about it?'
            },
            {
                'sentBy': 'theonetruenick',
                'dateSent': new Date("2019/07/15 07:32:22"),
                'content': 'oh hey its going all right. just bored.'
            },
            {
                'sentBy': 'theonetruenick',
                'dateSent': new Date("2019/07/17 13:21:27"),
                'content': 'dude leave me alone ;)'
            }
        ])
    })
}

export const getMessageLists = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([
                {
                    'username': 'somepotato',
                    'isOnline': true,
                    'lastMessageDate': new Date('2019/07/16 13:22:27'),
                    'lastMessagePreview': 'I really couldn\'t tell you but'
                },
                {
                    'username': 'abcmeanderingaroundwithit',
                    'isOnline': false,
                    'lastMessageDate': new Date('2019/07/20 04:10:44'),
                    'lastMessagePreview': 'wow i really didnt know that wa'
                },
                {
                    'username': 'fairytalewonder',
                    'isOnline': false,
                    'lastMessageDate': new Date('2019/07/14 06:22:00'),
                    'lastMessagePreview': 'now when you get going like tha'
                },
                {
                    'username': 'halo_master_99',
                    'isOnline': false,
                    'lastMessageDate': new Date('2019/05/04 19:00:16'),
                    'lastMessagePreview': 'lol me too!!'
                },
                {
                    'username': 'rgso35',
                    'isOnline': true,
                    'lastMessageDate': new Date('2019/07/19 17:20:30'),
                    'lastMessagePreview': 'well theres really not a whole'
                },
                {
                    'username': 'justanotherreallylongusername',
                    'isOnline': false,
                    'lastMessageDate': new Date('2019/06/23 09:10:27'),
                    'lastMessagePreview': 'thats what I was thinking!'
                }
            ]);
        }, 1);
    });
}

export const doesUsernameExist = (username) => {
    return new Promise((resolve, reject) => {
        resolve(false);
    })
}

// todo: maybe get these from server so they may updated on the fly? 
export const getReportCategories = () => {
    return new Promise((resolve) => {
        resolve([
            'belittling',
            'shaming',
            'doxxing',
            'trolling',
            'other'
        ]);
    })
}