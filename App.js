import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import Categories from './screens/Categories';
import QuizScreen from './screens/QuizScreen';
import AddQuestion from './screens/AddQuestion';
import QuizResult from './screens/QuizResult';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Categories" 
          component={Categories}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Quiz" 
          component={QuizScreen}
          options={{ 
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="QuizResult" 
          component={QuizResult}
          options={{ 
            headerShown: false,
            animationEnabled: true,
            gestureEnabled: false
          }}
        />
        <Stack.Screen 
          name="AddQuestion" 
          component={AddQuestion} 
          options={{ 
            headerShown: false
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
