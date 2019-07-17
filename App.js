import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Home } from './app/views/Home';
import { Chat } from './app/views/Chat';
import { UserProfile } from './app/views/UserProfile';

const AppRoutes = createStackNavigator(
  {
    Home,
    Chat,
    UserProfile: {
      screen: UserProfile,
      navigationOptions: ({ navigation }) => ({
        title: `${
          navigation.state.params.username.length > 16 ? 
          navigation.state.params.username.substring(0, 15) + '...' : 
          navigation.state.params.username
        }`
      })
    }
  },
  {
    initialRouteName: 'Home'
  }
);

const App = createAppContainer(AppRoutes);

export default App;