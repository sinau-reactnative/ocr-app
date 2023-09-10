import React, {memo, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNTextDetector from 'rn-text-detector';
import {
  View,
  Text,
  BackHandler,
  Image,
  StyleSheet,
  Dimensions,
  Linking,
  // StatusBar,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import Geolocation from '@react-native-community/geolocation';
import {authRef, updateEmergency} from '../utils/auth';
import Notifications from '../utils/Notifications';
import PushNotification from 'react-native-push-notification';

const DEVICE = Dimensions.get('screen');

const HomeWali = ({route, navigation}) => {
  const {data: dataParams} = route.params;

  const [data, setData] = useState(dataParams);
  const [error, setError] = useState(false);
  const [results, setResults] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(() => {
    authRef.doc(data.id).onSnapshot(documentSnapshot => {
      setData({id: documentSnapshot.id, ...documentSnapshot.data()});
    });
  }, []);

  useEffect(() => {
    if (data?.isPanic) {
      PushNotification.removeAllDeliveredNotifications();
      PushNotification.localNotification({
        channelId: 'reminders',
        title: `🆘 ${data?.fullname?.toUpperCase()} is Panic`,
        message: 'Please check the map',
      });
    }
  }, [data]);

  const toGoogleMap = () => {
    const scheme = Platform.select({
      ios: 'maps://0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${data?.latitude},${data?.longitude}`;
    const label = data?.fullname;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  return (
    <>
      {/* <StatusBar backgroundColor={'#fff'} barStyle="light-content" /> */}
      <View style={styles.container}>
        <View style={styles.column}>
          <View style={styles.row}>
            <View>
              <Text style={styles.date}>{moment().format('ll')}</Text>
              <Text style={styles.name}>Halo Wali dari {data.fullname}!</Text>
            </View>
            <View>
              <Image
                source={require('../assets/user.png')}
                style={styles.image}
              />
            </View>
          </View>
          {/* <TouchableOpacity
            onPress={async () => {
              if (isStarted) {
                stopRecognizing();
              } else {
                await speakStarted();
                setTimeout(() => {
                  startRecognizing();
                }, 1500);
              }
            }}
            style={styles.button}>
            <Text style={styles.textButton}>
              {isStarted ? 'STOP' : 'START'} LISTENING
            </Text>
          </TouchableOpacity> */}
        </View>
        <View style={[{backgroundColor: 'transparent', marginTop: 20}]}>
          <Text style={styles.text}>Summary</Text>
          <View style={{display: 'flex', flexDirection: 'column'}}>
            <View style={styles.card}>
              <Text style={{fontWeight: 'bold'}}>Nama: {data.fullname}</Text>
              <Text style={{fontWeight: 'bold'}}>Email: {data.email}</Text>
              <Text style={{fontWeight: 'bold'}}>
                Status: {data?.isPanic ? 'EMERGENCY' : 'NORMAL'}
              </Text>
              {data?.isPanic && (
                <TouchableOpacity onPress={() => toGoogleMap()}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      letterSpacing: 2,
                      paddingTop: 10,
                      textDecorationLine: 'underline',
                      color: 'darkred',
                    }}>
                    Menuju Lokasi →
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {data?.isPanic && (
              <TouchableOpacity
                onPress={() => {
                  PushNotification.removeAllDeliveredNotifications();
                  updateEmergency({
                    id: data.id,
                    isPanic: false,
                    latitude: null,
                    longitude: null,
                  });
                }}
                style={{
                  backgroundColor: 'darkred',
                  minWidth: DEVICE.width / 1.1,
                  minHeight: 40,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  marginBottom: 20,
                }}>
                <Text style={{fontWeight: 'bold', color: '#fff'}}>
                  Click here if you already on Location
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export default HomeWali;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#004170',
    display: 'flex',
    minHeight: DEVICE.height,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    height: DEVICE.height / 4,
    width: DEVICE.width,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: DEVICE.width / 1.1,
    justifyContent: 'space-between',
  },
  image: {
    width: 50,
    height: 50,
  },
  icon: {
    width: 120,
    height: 120,
  },
  button: {
    backgroundColor: '#69C9EF',
    paddingVertical: 14,
    marginTop: 40,
    marginHorizontal: 20,
    borderRadius: 20,
    elevation: 2,
    width: DEVICE.width / 1.1,
  },
  textButton: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  date: {fontSize: 13, fontWeight: 'bold'},
  name: {fontSize: 20, fontWeight: '400'},
  card: {
    backgroundColor: '#69C9EF',
    minWidth: DEVICE.width / 1.1,
    minHeight: DEVICE.width / 2.2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    alignSelf: 'center',
  },
});
