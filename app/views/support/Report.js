import React from 'react';
import { View, StyleSheet, Picker, Text, Keyboard } from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { getReportCategories, submitUserReport } from '../../services/ChatterUpService';
import { ChatterUpLoadingSpinner } from '../partial/ChatterUpLoadingSpinner';
import { UsernameCheck } from '../partial/UsernameCheck';
import { Icon } from 'react-native-elements';
import { AuthenticatedComponent } from '../../shared/AuthenticatedComponent';
import { IncomingCallOverlay } from '../../shared/IncomingCallOverlay';

export class Report extends AuthenticatedComponent {
    static navigationOptions = {
        title: 'report user'
    };

    constructor(props) {
        super(props);
        this.state = { 
            isShowingDisclaimer: true,
            canDimissDisclaimer: true, // setting to false hides OK button
            usernameFound: null,
            username: '',
            defaultCategory: 'Select category...'
        };

        getReportCategories().then(
            categories => {
                const categoriesWithDefault = [this.state.defaultCategory].concat(categories);
                this.setState({ categories: categoriesWithDefault });
            },
            error => {
                if (error && error.isSuspended) {
                    this.goTo('Suspended');
                }
                else {
                    alert('There was a problem initializing the report form.');
                }
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

    usernameValueChanged = (username) => {
        this.setState({ username, usernameRequired: false });
    }

    reportCategoryChanged = (selectedCategory) => {
        this.setState({ selectedCategory, categoryRequired: false });
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
        this.setState({ description, descriptionRequired: false });
    }

    submitButtonPressed = () => {
        const usernameRequired = !this.state.username;
        const categoryRequired = this.state.selectedCategory === this.state.defaultCategory || !this.state.selectedCategory;
        const descriptionRequired = !this.state.description;
        const isFormSubmitted = !(usernameRequired || categoryRequired || descriptionRequired);

        this.setState({
            usernameRequired,
            categoryRequired,
            descriptionRequired,
            isFormSubmitted
        });

        if (isFormSubmitted) {
            submitUserReport({
                username: this.state.username,
                category: this.state.selectedCategory,
                description: this.state.description
            }).then(
                _ => {
                    this.goTo('ReportConfirmed');
                },
                error => {
                    if (error && error.isSuspended) {
                        this.goTo('Suspended');
                    }
                    else {
                        alert('There was a problem submitting your user report.');
                    }
                }
            );
        }
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
                    </View>
                }

                {
                    !this.state.isShowingDisclaimer && !this.state.isEditingDescription && 
                    <UsernameCheck 
                        username={this.state.username} 
                        inputLabelText={'username being reported'}
                        usernameChanged={this.usernameValueChanged}
                        usernameRequired={this.state.usernameRequired}
                        >
                    </UsernameCheck>
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
                        {
                            this.state.categoryRequired && 
                            <Text style={styles.validationMessage}>{'Category is required.'}</Text>
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
                            onChangeText={(value) => this.descriptionChanged(value)}>
                        </TextInput>
                        {
                            this.state.descriptionRequired && 
                            <Text style={styles.validationMessage}>{'Description is required.'}</Text>
                        }

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
                    !(this.state.isShowingDisclaimer || this.state.isEditingDescription || this.state.isFormSubmitted) && 
                    <TouchableOpacity style={styles.submitButton} onPress={this.submitButtonPressed}>
                        <Text style={styles.submitButtonText}>{'submit'}</Text>
                    </TouchableOpacity>
                }
                {
                    this.state.isFormSubmitted && 
                    <ChatterUpLoadingSpinner></ChatterUpLoadingSpinner>
                }

                <IncomingCallOverlay 
                    navigation={this.props.navigation}
                    incomingCallChannel={this.getIncomingMessageChannel()}>
                </IncomingCallOverlay>
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
    validationMessage: {
        color: '#efcccc',
        alignSelf: 'flex-start',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5
    },
    pickerStyle: {
        alignSelf: 'stretch',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5
    },
    submitButton: {
        flexDirection: 'row',
        backgroundColor: '#ddd',
        borderColor: '#aaa',
        borderRadius: 2,
        borderWidth: 1,
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 25,
        paddingRight: 25,
        marginBottom: 20
    },
    submitButtonText: {
        color: '#222',
        fontSize: 24
    }
});