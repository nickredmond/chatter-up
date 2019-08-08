import Pusher from 'pusher-js/react-native';

export const SUSPENDED_STATUS = 497;

export const getApiUrl = () => {
    return 'https://talk-it-out-api.herokuapp.com';
}

export const getPusherInstance = () => {
    return new Pusher('630d9da03c427eb6fac0', { cluster: 'us3' });
}

/** strips leading '1' and formats with hyphens in American/Canadian format */
export const getFormattedPhoneNumber = (phoneNumber) => {
    return phoneNumber.substring(1).replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
}