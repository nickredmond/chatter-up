import React from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthenticatedComponent } from '../../shared/AuthenticatedComponent';
import { submitAboutMe } from '../../services/ChatterUpService';

export class AboutMe extends AuthenticatedComponent {
    static navigationOptions = {
        title: 'about me'
    };

    constructor(props) {
        super(props);
        this.state = {
            aboutMe: ''
        };
    }

    aboutMeCancelPressed = () => {
        this.setState({
            aboutMe: ''
        });
    }

    aboutMeSavePressed = () => {
        const isBlank = !this.state.aboutMe;
        if (!isBlank) {
            submitAboutMe(this.state.aboutMe).then(
                _ => {
                    alert('hm')
                    this.props.navigation.navigate('PhoneNumberConfirmation');
                },
                _ => {
                    alert('There was a problem submitting your information.');
                }
            );
        }
    }

    aboutMeUpdated = (text) => {
        this.setState({ aboutMe: text });
    }

    getSubtitleText = () => {
        return 'Enter some info about yourself, why you joined, maybe a fun fact or two, and whatever else you want to share.';
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.aboutMeTitleContainer}>
                    <Text style={styles.sectionTitle}>ABOUT ME</Text>
                    <Text style={styles.subtitle}>{this.getSubtitleText()}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.aboutMeInput}
                        value={this.state.aboutMe} 
                        multiline={true}
                        autoFocus={true}
                        minHeight={160}
                        maxHeight={160}
                        onChangeText={(text) => this.aboutMeUpdated(text)}
                        >
                    </TextInput>
                    <View style={styles.aboutMeActionButtons}>
                        <TouchableOpacity 
                            style={[styles.aboutMeActionButton, styles.aboutMeCancelButton]}
                            onPress={() => this.aboutMeCancelPressed()}
                            >
                            <Icon size={24} name='ban' type='font-awesome' color='#efefef'></Icon>    
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.aboutMeActionButton, styles.aboutMeSaveButton]}
                            onPress={() => this.aboutMeSavePressed()}
                            >
                            <Icon size={24} name='check' type='font-awesome' color='#efefef'></Icon>    
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
        alignItems: 'center'
    },
    aboutMeTitleContainer: {
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
    },
    sectionTitle: {
        color: '#ccc',
        fontSize: 24,
        fontWeight: 'bold'
    },
    subtitle: {
        color: '#dedede',
        fontSize: 16
    },  
    aboutMeEditButton: {
        backgroundColor: '#222',
        marginLeft: 10,
        marginTop: 5
    },
    aboutMeText: {
        color: '#efefef',
        fontSize: 18, 
        padding: 5
    }, 
    aboutMeEditableText: {
        borderColor: '#ccc', 
        borderRadius: 5, 
        borderWidth: 1
    },
    aboutMeInput: {
        fontSize: 18,
        backgroundColor: '#ddd',
        textAlignVertical: 'top',
        marginLeft: 10,
        marginRight: 10
    },
    aboutMeCancelButton: {
        backgroundColor: '#B70000'
    },
    aboutMeSaveButton: {
        backgroundColor: '#00B706'
    },
    aboutMeActionButton: {
        minWidth: 100,
        paddingTop: 10,
        paddingBottom: 10
    },
    aboutMeActionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 15
    },
    inputContainer: {
        flex: 1,
        alignSelf: 'stretch'
    }
});