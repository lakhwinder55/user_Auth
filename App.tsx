import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

import Register from './screens/Register';
import Login from './screens/Login';
import home from './screens/home'; // Capitalized for convention

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState(null); // current user
  const [initializing, setInitializing] = useState(true); // show loader until we know auth state

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      setUser(user); // store logged-in user
      if (initializing) setInitializing(false); // stop loading
    });

    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8687E7" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'home' : 'Register'} // if user exists, go to Home
      >
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="home"
          component={home}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
