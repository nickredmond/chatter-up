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
        resolve({
            text: 'I get up every morning and it\'s going to be a great day. You never know when it\'s going to be over, so I refuse to have a bad day.',
            author: 'Paul Henderson'
        })
    })
}