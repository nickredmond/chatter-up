import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Home } from './app/views/Home';
import { Chat } from './app/views/Chat';
import { Messages } from './app/views/Messages';
import { UserProfile } from './app/views/UserProfile';
import { InstantMessage } from './app/views/InstantMessage';
import { Support } from './app/views/support/Support';
import { Report } from './app/views/support/Report';

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

    Support,
    Report,

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
    }
  },
  {
    initialRouteName: 'Home'
  }
);

const App = createAppContainer(AppRoutes);

export default App;