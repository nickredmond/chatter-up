import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthenticatedComponent } from '../../shared/AuthenticatedComponent';
import { FlatList } from 'react-native-gesture-handler';
import { ChatterUpLoadingSpinner } from '../partial/ChatterUpLoadingSpinner';
import { Text } from 'react-native-elements';
import { getFaqs } from '../../services/ChatterUpService';

export class Faq extends AuthenticatedComponent {
    static navigationOptions = {
        title: 'faq'
    }

    constructor(props) {
        super(props);
        this.state = { loading: true };
        getFaqs().then(
            faqs => {
                this.setState({ faqs, loading: false });
            },
            _ => {
                alert('Error retrieving faqs from server.');
            }
        )
    }

    renderFaq = ({ item: faq }) => {
        return (
            <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.loading && 
                    <ChatterUpLoadingSpinner></ChatterUpLoadingSpinner>
                }
                {
                    !this.state.loading && 
                    <FlatList data={this.state.faqs} renderItem={this.renderFaq}></FlatList>
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
    faqItem: {

    },
    faqQuestion: {

    },
    faqAnswer: {

    }
});