import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Home } from './app/views/Home';

const AppRoutes = createStackNavigator(
  {
    Home
  },
  {
    initialRouteName: 'Home'
  }
);

const App = createAppContainer(AppRoutes);

export default App;