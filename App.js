import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, LogBox, Platform } from 'react-native';
import * as theme from './utils/theme';

// Firebase ve diğer uyarıları gizle
LogBox.ignoreLogs([
  // AsyncStorage uyarıları
  'AsyncStorage has been extracted',
  'AsyncStorage: Storing value',
  'Possible Unhandled Promise Rejection',
  
  // Firebase uyarıları
  '@firebase/database',
  'Setting a timer',
  'Firebase: Error',
  'sendRequest',
  '[2023',
  
  // Prop-types uyarıları
  'Warning: Failed prop type',
  
  // Bridge hatalarıyla ilgili ek uyarıları gizle
  '[TypeError: Cannot read property',
  'RCTBridge',
  'Non-serializable values',
  'Sending `onAnimatedValueUpdate`',
  'Calling getNode() on the ref',
  
  // Ek Windows platform hataları
  'NativeEventEmitter',
  'EventEmitter.removeListener',
  'ReactNative.NativeModules',
  '[object Object]',
  
  // Analytics ile ilgili hatalar
  'analytics',
  'getAnalytics',
  'FirebaseError',
  'Network Error'
]);

// Ekranlar
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import QuestionManagementScreen from './screens/QuestionManagementScreen';
import AddQuestion from './screens/AddQuestion';
import StatisticsScreen from './screens/StatisticsScreen';
import SettingsScreen from './screens/SettingsScreen';
import AboutScreen from './screens/AboutScreen';

const Stack = createStackNavigator();

export default function App() {
  // Yönlendirici options
  const screenOptions = {
    headerShown: false,
    cardStyle: { backgroundColor: theme.colors.background },
    presentation: 'card',
    gestureEnabled: Platform.OS === 'ios' ? true : false,
    animationEnabled: true,
    cardOverlayEnabled: true,
  };

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.cardBackground,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.primary,
        },
      }}
    >
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={theme.colors.background} 
        translucent={false}
      />
      
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
        />
        <Stack.Screen 
          name="Game" 
          component={GameScreen} 
        />
        <Stack.Screen 
          name="QuestionManagement" 
          component={QuestionManagementScreen} 
        />
        <Stack.Screen 
          name="AddQuestion" 
          component={AddQuestion} 
        />
        <Stack.Screen 
          name="Statistics" 
          component={StatisticsScreen} 
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
        />
        <Stack.Screen 
          name="About" 
          component={AboutScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
