import React from 'react';
import {View, Text, Image, Dimensions, Pressable} from 'react-native';

const DEVICE = Dimensions.get('screen');

const SplashScreen = ({navigation}) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#004170',
        display: 'flex',
        minHeight: DEVICE.height,
      }}>
      <Image
        source={require('../assets/image1.png')}
        style={{
          width: 300,
          height: 300,
        }}
      />

      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          marginTop: 30,
          color: '#fff',
        }}>
        Help to Read Your Text
      </Text>

      <Text style={{fontSize: 12, marginTop: 15, color: '#fff'}}>
        An android-based text reader application from pdf and jpg files
      </Text>

      <Pressable
        onPress={() => navigation.navigate('SignUp')}
        style={{
          backgroundColor: '#fff',
          paddingVertical: 14,
          marginTop: 40,
          marginHorizontal: 20,
          borderRadius: 20,
          elevation: 2,
          width: DEVICE.width / 1.2,
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          CONTINUE
        </Text>
      </Pressable>
    </View>
  );
};

export default SplashScreen;
