import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Home } from './app/views/Home';
import { Chat } from './app/views/Chat';
import { Messages } from './app/views/Messages';
import { UserProfile } from './app/views/UserProfile';
import { InstantMessage } from './app/views/InstantMessage';
import { PhoneCall } from './app/views/PhoneCall';
import { Support } from './app/views/support/Support';
import { Faq } from './app/views/support/Faq';
import { Report } from './app/views/support/Report';
import { Block } from './app/views/support/Block';
import { Contact } from './app/views/support/Contact';
import { ReportConfirmed } from './app/views/support/ReportConfirmed';
import { BlockConfirmed } from './app/views/support/BlockConfirmed';
import { AboutMe } from './app/views/setup/AboutMe';
import { PhoneNumberConfirmation } from './app/views/setup/PhoneNumberConfirmation';
import { Suspended } from './app/views/Suspended';

const getTrimmedUsernameTitle = (username) => {
  return username.length > 16 ? username.substring(0, 15) + '...' : username;
};

const getUserProfileTitle = (navigationParams) => {
  return navigationParams.isCurrentUser ? 'profile' : getTrimmedUsernameTitle(navigationParams.username);
}

const AppRoutes = createStackNavigator(
  {
    Home,
    Chat,
    Messages,

    AboutMe,
    PhoneNumberConfirmation,

    Support,
    Faq,
    Report,
    ReportConfirmed,
    Block,
    BlockConfirmed,
    Contact,

    Suspended,

    UserProfile: {
      screen: UserProfile,
      navigationOptions: ({ navigation }) => ({
        title: getUserProfileTitle(navigation.state.params)
      })
    },
    InstantMessage: {
      screen: InstantMessage,
      navigationOptions: ({ navigation }) => ({
        title: getTrimmedUsernameTitle(navigation.state.params.username)
      })
    },
    PhoneCall: {
      screen: PhoneCall,
      navigationOptions: ({ navigation }) => ({
        title: 'call: ' + getTrimmedUsernameTitle(navigation.state.params.username)
      })
    }
  },
  {
    initialRouteName: 'Home'
  }
);

const App = createAppContainer(AppRoutes);

export default App;