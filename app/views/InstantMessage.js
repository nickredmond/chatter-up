import React from 'react';
import { ChatterUpLoadingSpinner } from './partial/ChatterUpLoadingSpinner';
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView, TextInput, TouchableHighlight, Keyboard } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AutogrowInput from 'react-native-autogrow-input';
import Pusher from 'pusher-js/react-native';
import { getUsername, getMessages, openChatConnection, sendMessage } from '../services/ChatterUpService';
import { AuthenticatedComponent } from '../shared/AuthenticatedComponent';

/**
 * These components were originally written by GitHub user @llamaluvr and were published at 
 * https://github.com/llamaluvr/ChatUIExample. 
 */

// The actual chat view itself- a ScrollView of BubbleMessages, with an InputBar at the bottom, which moves with the keyboard
export class InstantMessage extends AuthenticatedComponent {
  constructor(props) {
    super(props);
    this.state = {
        messages: []
    };

    getUsername().then(
        username => {
            this.setState({ username });
        },
        errorMessage => { 
            alert(errorMessage);
        }
    );
    
    const channelId = this.props.navigation.getParam('channelId');
    
    
    if (channelId) {
        this.state = { channelId, isLoading: true };
        this.getExistingMessages(channelId);
        this.initializeMessageListener(channelId);
    }
    else {
        // todo: should this be loading too? maybe not cuz some users are fresh? 
        const otherUsername = this.props.navigation.getParam('username');
        openChatConnection(otherUsername).then(
            channelId => {
                this.setState({ channelId });
                this.getExistingMessages(channelId);
                this.initializeMessageListener(channelId);
            },
            errorMessage => {
                alert(errorMessage);
            }
        );
    }
  }

  initializeMessageListener = (channelId) => {
    const socket = new Pusher('0eff4fdefc2715d879a4', { cluster: 'us3' });
    const channel = socket.subscribe(channelId);
    alert('hm1 ' + channelId)
    channel.bind('message', message => {
        alert('hm2')
        if (message.sentBy !== this.state.username) {
            const uiMessage = {
                direction: 'left',
                dateSent: message.dateSent,
                text: message.content
            };
            this.setState({ messages: this.state.messages.concat([uiMessage]) });
        }
    });
  }

  getExistingMessages = (channelId) => {
    getMessages(channelId).then(
        messages => {
            messages.sort((a, b) => a.dateSent - b.dateSent);
            const formattedMessages = [];

            for(var i = 0; i < messages.length; i++) {
                const direction = this.getMessageBubbleDirection(messages[i].sentBy);

                formattedMessages.push({
                    direction,
                    dateSent: messages[i].dateSent,
                    text: messages[i].content
                });
            }

            this.setState({
                messages: formattedMessages,
                isLoading: false
            });
        },
        errorMessage => {
            alert(errorMessage);
        }
    );
  }

  getMessageBubbleDirection(sentBy) {
      return sentBy === this.state.username ? 'right' : 'left';
  }

  //fun keyboard stuff- we use these to get the end of the ScrollView to "follow" the top of the InputBar as the keyboard rises and falls
  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  //When the keyboard appears, this gets the ScrollView to move the end back "up" so the last message is visible with the keyboard up
  //Without this, whatever message is the keyboard's height from the bottom will look like the last message.
  keyboardDidShow (e) {
    this.scrollView.scrollToEnd();
  }

  //When the keyboard dissapears, this gets the ScrollView to move the last message back down.
  keyboardDidHide (e) {
    this.scrollView.scrollToEnd();
  }

  //scroll to bottom when first showing the view
  componentDidMount() {
    setTimeout(function() {
      this.scrollView.scrollToEnd();
    }.bind(this))
  }

  //this is a bit sloppy: this is to make sure it scrolls to the bottom when a message is added, but 
  //the component could update for other reasons, for which we wouldn't want it to scroll to the bottom.
  componentDidUpdate() {
    setTimeout(function() {
      this.scrollView.scrollToEnd();
    }.bind(this))
  }

  _sendMessage(inputText) {
    const sanitizedText = new String(inputText);
    
    const uiMessage = {
        direction: 'right',
        dateSent: new Date(),
        text: sanitizedText
    };
    this.setState({ messages: this.state.messages.concat([uiMessage]) });

    sendMessage(this.state.channelId, sanitizedText).then(
        _ => {},
        errorMessage => {
            alert(errorMessage);
        }
    );
  }

  //This event fires way too often.
  //We need to move the last message up if the input bar expands due to the user's new message exceeding the height of the box.
  //We really only need to do anything when the height of the InputBar changes, but AutogrowInput can't tell us that.
  //The real solution here is probably a fork of AutogrowInput that can provide this information.
  _onInputSizeChange() {
    setTimeout(function() {
      this.scrollView.scrollToEnd({animated: false});
    }.bind(this))
  }

  render() {

    var messages = [];

    if (this.state && this.state.messages) {
        this.state.messages.forEach(function(message, index) {
            messages.push(
                <MessageBubble 
                    key={index} 
                    direction={message.direction} 
                    text={message.text}
                    dateSent={message.dateSent}
                    />
            );
        });
    }

    return (
        <View style={styles.container}>
            {
                this.state && this.state.isLoading && 
                <ChatterUpLoadingSpinner></ChatterUpLoadingSpinner>
            }

            {
                this.state && !this.state.isLoading && 
                <View style={styles.outer}>
                    <ScrollView ref={(ref) => { this.scrollView = ref }} style={styles.messages}>
                    {messages}
                    </ScrollView>
                    <InputBar onSendPressed={(inputText) => this._sendMessage(inputText)} 
                            onSizeChange={() => this._onInputSizeChange()} />
                    <KeyboardSpacer/>             
                </View>
            }
        </View>
    );
  }
}

//The bubbles that appear on the left or the right for the messages.
class MessageBubble extends React.Component {
    getFormattedDateText = (dateTimeValue) => {
        const dateTime = new Date(dateTimeValue);
        const date = dateTime.toLocaleDateString('en-US', { month: 'long' });
        const time = dateTime.toLocaleTimeString('en-US', { hour12: true });
        return date + ' ' + time;
    }

  render() {

    //These spacers make the message bubble stay to the left or the right, depending on who is speaking, even if the message is multiple lines.
    var leftSpacer = this.props.direction === 'left' ? null : <View style={{width: 70}}/>;
    var rightSpacer = this.props.direction === 'left' ? <View style={{width: 70}}/> : null;

    var bubbleStyles = this.props.direction === 'left' ? [styles.messageBubbleInner, styles.messageBubbleLeft] : [styles.messageBubbleInner, styles.messageBubbleRight];

    var bubbleTextStyle = this.props.direction === 'left' ? styles.messageBubbleTextLeft : styles.messageBubbleTextRight;

    return (
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            {leftSpacer}
            <View style={styles.messageBubble}>
                <Text>{ this.getFormattedDateText(this.props.dateSent) }</Text>
                <View style={bubbleStyles}>
                <Text style={bubbleTextStyle}>
                    {this.props.text}
                </Text>
                </View>
            </View>
            {rightSpacer}
          </View>
      );
  }
}

//The bar at the bottom with a textbox and a send button.
class InputBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { inputText: '' };
    }

    textChanged = (text) => {
        this.setState({ inputText: text });
    }

    submitPressed = () => {
        const inputText = this.state.inputText;
        if (inputText) {
            this.setState({ inputText: '' });
            this.props.onSendPressed(this.state.inputText);
        }
    }

  render() {
    return (
          <View style={styles.inputBar}>
            <TextInput style={styles.textBox}
                ref={(ref) => { this.autogrowInput = ref }} 
                multiline={true}
                defaultHeight={30}
                onChangeText={(text) => this.textChanged(text)}
                onContentSizeChange={this.props.onSizeChange}
                placeholder={'Enter message to send...'}
                value={this.state.inputText}/>
            <TouchableHighlight style={styles.sendButton} onPress={() => this.submitPressed()}>
                <Text style={{color: 'white'}}>Send</Text>
            </TouchableHighlight>
          </View> 
          );
  }
}

//TODO: separate these out. This is what happens when you're in a hurry!
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#222'
    },

  //ChatView

  outer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    backgroundColor: 'white'
  },

  messages: {
    flex: 1
  },

  //InputBar

  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 3,
  },

  textBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10
  },

  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
    marginLeft: 5,
    paddingRight: 15,
    borderRadius: 5,
    backgroundColor: '#66db30'
  },

  //MessageBubble

  messageBubble: {
      marginTop: 8,
      marginRight: 10,
      marginLeft: 10,
      flex: 1
  },

  messageBubbleInner: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection:'row',
    flex: 1,
    borderRadius: 5,
  },

  messageBubbleLeft: {
    backgroundColor: '#d5d8d4',
  },

  messageBubbleTextLeft: {
    color: 'black'
  },

  messageBubbleRight: {
    backgroundColor: '#66db30'
  },

  messageBubbleTextRight: {
    color: 'white'
  },
})

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         backgroundColor: '#222'
//     }
// });