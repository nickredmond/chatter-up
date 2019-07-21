import React from 'react';
import { View, StyleSheet, Picker, Text } from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { doesUsernameExist, getReportCategories } from '../../services/ChatterUpService';

export class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            isShowingDisclaimer: true,
            usernameFound: true 
        };

        getReportCategories().then(
            categories => {
                this.setState({ categories });
            },
            errorMessage => {
                alert(errorMessage);
            }
        )
    }

    getDisclaimerText = () => {
        return 'Reporting another user is taken seriously at TalkItOut, and users who are reported ' +
            'will be investigated to determine if they are violating community rules. With that in mind, ' + 
            'we ask you only report users who are toxic or damaging to the community. If you are found ' + 
            'to be repeatedly reporting users who aren\'t breaking the rules, then you may face disciplinary ' + 
            'action up to and including suspension of your account. In other words, we appreciate you reporting ' + 
            'the real trolls, and we don\'t appreciate you being the "troll who cried wolf".'
    }

    confirmDisclaimer = () => {
        this.setState({ isShowingDisclaimer: false });
    }

    getUsernameNotFoundMessage = () => {
        return 'We couldn\'t find that username. If you can\'t remember it then we will try our best ' + 
            'to find a match, and will let you know either way.';
    }

    usernameValueChanged = (username) => {
        this.setState({ username });
    }

    checkUsernameValue = () => {
        const username = this.state.username;
        if (username) {
            doesUsernameExist(username).then(
                wasUsernameFound => {
                    this.setState({ usernameFound: wasUsernameFound })
                },
                errorMessage => {
                    alert(errorMessage);
                }
            );
        }
    }

    reportCategoryChanged = (selectedCategory) => {
        this.setState({ selectedCategory });
    }

    getReportCategoryItems = () => {
        return this.state.categories.map((category, index) => {
            return <Picker.Item key={index} value={category} label={category}></Picker.Item>
        })
    }

    descriptionChanged = (description) => {
        this.setState({ description });
    }

    submitButtonPressed = () => {

    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.isShowingDisclaimer && 
                    <View style={styles.disclaimer}>
                        <Text style={[styles.disclaimerHeader, styles.disclaimerText]}>{'Please note:'}</Text>
                        <Text style={styles.disclaimerText}>{this.getDisclaimerText()}</Text>
                        <View style={styles.disclaimerButtonContainer}>
                            <TouchableOpacity 
                                style={styles.disclaimerConfirmButton}
                                onPress={this.confirmDisclaimer}
                                >
                                <Text style={styles.disclaimerConfirmText}>{'ok'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                <View style={styles.shortFormContainer}>
                    <Text style={styles.inputLabel}>{'username being reported'}</Text>
                    <View style={styles.usernameInputGroup}>
                        <TextInput 
                            onValueChange={this.usernameValueChanged}
                            placeholder={'Enter username...'}>
                        </TextInput>
                        <TouchableOpacity 
                            style={styles.usernameCheckButton}
                            onPress={this.checkUsernameValue}
                            >
                            <Text style={styles.usernameCheckButtonText}>{'check'}</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        !this.state.usernameFound && 
                        <Text style={styles.usernameNotFoundMessage}>{this.getUsernameNotFoundMessage()}</Text>
                    }
                </View>
                <View style={styles.shortFormContainer}>
                    <Text style={styles.inputLabel}>{'category'}</Text>
                    {
                        this.state.categories && 
                        <Picker 
                            style={[styles.input, styles.pickerStyle]} 
                            selectedValue={this.state.selectedCategory}
                            onValueChange={(value) => this.reportCategoryChanged(value)}
                            >
                            { this.getReportCategoryItems() }
                        </Picker>
                    }
                </View>
                <View style={styles.longFormContainer}>
                    <Text style={styles.inputLabel}>{'description'}</Text>
                    <TextInput 
                        style={[styles.input, styles.descriptionInput]} 
                        multiline={true}
                        onValueChange={(value) => this.descriptionChanged(value)}>
                    </TextInput>
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={this.submitButtonPressed}>
                    <Text style={styles.submitButtonText}>{'submit'}</Text>
                </TouchableOpacity>
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
    disclaimer: {
        flex: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 15,
        margin: 10,
        borderColor: '#ffeeba',
        borderWidth: 2,
        borderRadius: 3,
        backgroundColor: '#fff3cd'
    },
    disclaimerHeader: {
        fontWeight: 'bold',
        fontSize: 18
    },
    disclaimerText: {
        color: '#856404',
        fontSize: 16
    },
    disclaimerButtonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginTop: 10
    },
    disclaimerConfirmButton: {
        backgroundColor: '#856404',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 25,
        paddingRight: 25
    },
    disclaimerConfirmText: {
        color: '#efefef',
        fontSize: 20
    },
    shortFormContainer: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center'
    },
    longFormContainer: {
        flex: 2
    },
    submitButtonText: {
        color: '#efefef'
    },
    inputLabel: {
        color: '#efefef',
        fontSize: 18
    },
    input: {
        backgroundColor: '#ddd'
    },
    descriptionInput: {
        marginLeft: 10,
        marginRight: 10
    },
    usernameInputGroup: {
        flexDirection: 'row'
    },
    usernameCheckButton: {
        backgroundColor: 'blue'
    },
    usernameCheckButtonText: {
        color: '#efefef'
    },
    usernameNotFoundMessage: {
        color: '#efcccc'
    },
    pickerStyle: {
        alignSelf: 'stretch',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5
    }
});