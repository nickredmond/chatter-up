import React from 'react';
import { View, StyleSheet, Picker, Text, Keyboard } from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { doesUsernameExist, getReportCategories } from '../../services/ChatterUpService';
import { ChatterUpLoadingSpinner } from '../partial/ChatterUpLoadingSpinner';
import { Icon } from 'react-native-elements';

export class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            isShowingDisclaimer: false,//true,
            canDimissDisclaimer: false,
            usernameFound: true 
        };

        // todo: maybe provide option after first time to not show again
        setTimeout(() => {
            this.setState({ canDimissDisclaimer: true });
        }, 5000);

        getReportCategories().then(
            categories => {
                const categoriesWithDefault = ['Select category...'].concat(categories);
                this.setState({ categories: categoriesWithDefault });
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

    descriptionInputFocused = () => {
        this.setState({ isEditingDescription: true });
    }

    descriptionInputDoneEditing = () => {
        Keyboard.dismiss();
        this.setState({ isEditingDescription: false });
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
                        
                        {
                            this.state.canDimissDisclaimer && 
                            <View style={styles.disclaimerButtonContainer}>
                                <TouchableOpacity 
                                    style={styles.disclaimerConfirmButton}
                                    onPress={this.confirmDisclaimer}
                                    >
                                    <Text style={styles.disclaimerConfirmText}>{'ok'}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {
                            !this.state.canDimissDisclaimer && 
                            <View style={styles.disclaimerLoadingSpinner}>
                                <ChatterUpLoadingSpinner color={'#856404'}></ChatterUpLoadingSpinner>
                            </View>
                        }
                    </View>
                }

                {
                    !this.state.isShowingDisclaimer && !this.state.isEditingDescription &&
                    <View style={styles.shortFormContainer}>
                        <Text style={[styles.inputLabel, styles.usernameInputLabel]}>{'username being reported'}</Text>
                        <View style={styles.usernameInputGroup}>
                            <TextInput 
                                style={[styles.input, styles.usernameInput]}
                                onChangeText={this.usernameValueChanged}
                                placeholder={'Enter username...'}
                                placeholderTextColor={'#888'}>
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
                }
                {
                    !this.state.isShowingDisclaimer && !this.state.isEditingDescription &&
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
                }
                {
                    !this.state.isShowingDisclaimer && 
                    <View style={styles.longFormContainer}>
                        <Text style={styles.inputLabel}>{'description'}</Text>
                        <TextInput 
                            style={[styles.input, styles.descriptionInput]} 
                            multiline={true} 
                            textAlignVertical='top' 
                            onFocus={this.descriptionInputFocused} 
                            onValueChange={(value) => this.descriptionChanged(value)}>
                        </TextInput>

                        {
                            this.state.isEditingDescription && 
                            <TouchableOpacity
                                style={styles.acceptDescriptionButton}
                                onPress={() => this.descriptionInputDoneEditing()}
                                >
                                <Icon size={28} name='check' color='#efefef'></Icon>
                            </TouchableOpacity>
                        }
                    </View>
                }
                {
                    !(this.state.isShowingDisclaimer || this.state.isEditingDescription) && 
                    <TouchableOpacity style={styles.submitButton} onPress={this.submitButtonPressed}>
                        <Text style={styles.submitButtonText}>{'submit'}</Text>
                    </TouchableOpacity>
                }
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
    disclaimerLoadingSpinner: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center'
    },  
    shortFormContainer: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center'
    },
    longFormContainer: {
        flex: 2,
        alignSelf: 'stretch',
        alignItems: 'center'
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
        marginTop: 10,
        marginBottom: 15,
        marginLeft: 10,
        marginRight: 10,
        flex: 1,
        maxHeight: '30%',
        alignSelf: 'stretch'
    },
    acceptDescriptionButton: {
        minWidth: 200,
        backgroundColor: '#00B706',
        padding: 10,
        marginLeft: 20,
        marginRight: 20
    },
    usernameInputGroup: {
        flexDirection: 'row',
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    usernameInputLabel: {
        marginTop: 20
    },
    usernameInput: {
        flex: 1,
        paddingLeft: 5,
        fontSize: 18
    },  
    usernameCheckButton: {
        backgroundColor: 'blue',
        padding: 5
    },
    usernameCheckButtonText: {
        color: '#efefef',
        fontSize: 20
    },
    usernameNotFoundMessage: {
        color: '#efcccc',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5
    },
    pickerStyle: {
        alignSelf: 'stretch',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5
    }
});