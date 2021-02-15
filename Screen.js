import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './src/Home';
import Details from './src/Details';

const Stack = createStackNavigator();
export default function AnimatedStyleUpdateExample(props) {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode={false} initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
