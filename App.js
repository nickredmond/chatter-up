import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Home } from './app/views/Home';
import { Chat } from './app/views/Chat';
import { Messages } from './app/views/Messages';
import { UserProfile } from './app/views/UserProfile';
import { InstantMessage } from './app/views/InstantMessage';

const getTrimmedUsernameTitle = (username) => {
  return username.length > 16 ? username.substring(0, 15) + '...' : username;
};

const AppRoutes = createStackNavigator(
  {
    Home,
    Chat,
    Messages,
    UserProfile: {
      screen: UserProfile,
      navigationOptions: ({ navigation }) => ({
        title: getTrimmedUsernameTitle(navigation.state.params.username)
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