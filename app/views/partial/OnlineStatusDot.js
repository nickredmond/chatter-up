import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';

export class OnlineStatusDot extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={this.props.containerStyle}>
                {
                    this.props.isOnline &&
                    <Icon size={22} name='circle' type='font-awesome' color='#77ff88' />
                }
                
                {
                    !this.props.isOnline &&
                    <Icon size={22} name='circle' type='font-awesome' color='#999' />
                }
            </View>
        );
    }
}