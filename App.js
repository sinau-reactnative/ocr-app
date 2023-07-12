/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StatusBar, StyleSheet, Dimensions} from 'react-native';
// import database from '@react-native-firebase/database';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from './pages/Splash';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Result from './pages/Result';
import HomeWali from './pages/HomeWali';

const DEVICE = Dimensions.get('window');
const Stack = createNativeStackNavigator();

const App = () => {
  // const reference = database().ref('/apel');
  // const handleChangePage = from => {
  //   setSrc(from);
  //   setMenu('about');
  // };

  // const handlePress = () => {
  //   if (!isEditMode) {
  //     reference.update({
  //       inputApelBagus: data.inputApelBagus,
  //       inputApelBiasa: data.inputApelBiasa,
  //     });
  //   }

  //   setIsEditMode(!isEditMode);
  // };

  // const handleChangeInput = (name, value) => {
  //   setData({...data, [name]: value});
  // };

  // const handleStart = () => {
  //   reference.update({start: data.start === 1 ? 0 : 1});
  // };

  // const handleReset = () => {
  //   reference.update({
  //     inputApelBagus: 0,
  //     inputApelBiasa: 0,
  //     resultApelBagus: 0,
  //     resultApelBiasa: 0,
  //     start: 0,
  //   });
  // };

  return (
    <>
      <StatusBar backgroundColor={'#004170'} barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen
            options={{gestureEnabled: false}}
            name="Home"
            component={Home}
          />
          <Stack.Screen
            options={{headerShown: true}}
            name="Result"
            component={Result}
          />
          <Stack.Screen name="HomeWali" component={HomeWali} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: DEVICE.width,
    height: DEVICE.height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
    padding: 30,
  },
});

export default App;
