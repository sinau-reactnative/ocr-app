/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Detail from './pages/Detail';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
      <StatusBar backgroundColor={'#fff'} barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="SignIn">
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen
            options={{gestureEnabled: false}}
            name="Home"
            component={Home}
          />
           <Stack.Screen
            options={{gestureEnabled: false}}
            name="Detail"
            component={Detail}
          />
          {/* <Stack.Screen name="TPA" component={HomeTPA} /> */}
          {/* <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="SignIn" component={SignIn} /> */}
          {/* <Stack.Screen
            options={{gestureEnabled: false}}
            name="Home"
            component={Home}
          />
          <Stack.Screen
            options={{headerShown: true}}
            name="Result"
            component={Result}
          />
          <Stack.Screen name="HomeWali" component={HomeWali} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
