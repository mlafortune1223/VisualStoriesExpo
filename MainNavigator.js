import * as React from 'react';
//import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VisualStories from './VisualStories';
import Preview from './Preview';
//import Animation from './Animation';

const Stack = createNativeStackNavigator();

function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ header: () => false }} >
        {/* <Stack.Screen name="Animation" component={Animation} /> */}
        <Stack.Screen name="VisualStories" component={VisualStories} />
        <Stack.Screen name="Preview" component={Preview} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;