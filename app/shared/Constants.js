import Pusher from 'pusher-js/react-native';

export const SUSPENDED_STATUS = 497;
export const CALLS_TEMPORARILY_UNAVAILABLE_STATUS = 565;

export const getApiUrl = () => {
    return 'https://talkingitiout.herokuapp.com';
}

export const getPusherInstance = () => {
    return new Pusher('19698cbd0d564804348c', { cluster: 'us3' });
}

/** strips leading '1' and formats with hyphens in American/Canadian format */
export const getFormattedPhoneNumber = (phoneNumber) => {
    return phoneNumber.substring(1).replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
}