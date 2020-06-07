import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CollectionPoints from './pages/CollectionPoints';
import Detail from './pages/Detail';
import Home from './pages/Home';

const AppStack = createStackNavigator();

const Routes: React.FC = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        headerMode="none"
        screenOptions={{ cardStyle: { backgroundColor: '#F0F0F5' } }}
      >
        <AppStack.Screen name="Home" component={Home} />
        <AppStack.Screen
          name="Collection Points"
          component={CollectionPoints}
        />
        <AppStack.Screen name="Detail" component={Detail} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
