import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Pantalla_1 from './src/Pantalla_1'
import Pantalla_2 from './src/Pantalla_2'

export type RootStackParamList = {
  Pantalla_1 : undefined;
  Pantalla_2: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
<NavigationContainer>
      <Stack.Navigator initialRouteName="Pantalla_1">
        <Stack.Screen 
          name="Pantalla_1" 
          component={Pantalla_1} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Pantalla_2" 
          component={Pantalla_2} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#313349ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
