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
  Alert,
  // StatusBar,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import Geolocation from '@react-native-community/geolocation';
import {updateEmergency} from '../utils/auth';

const DEVICE = Dimensions.get('screen');

const Home = ({route, navigation}) => {
  const {data} = route.params;

  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    Tts.setDefaultLanguage('in-ID');
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    if (results[0]?.indexOf('buka kamera') > -1) {
      openCamera();
      setResults([]);
    } else if (results[0]?.indexOf('buka gambar') > -1) {
      openImage();
      setResults([]);
    } else if (
      results[0]?.indexOf('jam') > -1 ||
      results[0]?.indexOf('waktu') > -1
    ) {
      const time = moment().format('HH:mm');
      Tts.speak(`Sekarang jam ${time}`);
      setResults([]);
    } else if (
      results[0]?.indexOf('tolong') > -1 ||
      results[0]?.indexOf('panik') > -1
    ) {
      Geolocation.getCurrentPosition(info => {
        updateEmergency({
          id: data.id,
          isPanic: true,
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      });
    }

    // destroyRecognizer();
  }, [results]);

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

  const onSpeechStart = e => {
    console.log('onSpeechStart: ', e);
    setIsStarted(true);
  };

  const onSpeechEnd = e => {
    console.log('onSpeechEnd: ', e);
    setIsStarted(false);
  };

  const onSpeechError = e => {
    console.log('onSpeechError: ', e);
    setError(JSON.stringify(e.error));
  };

  const onSpeechResults = e => {
    console.log('onSpeechResults: ', e);
    setResults(e.value);
  };

  const startRecognizing = async () => {
    try {
      await Voice.start('in-ID');
      setError('');
      setResults([]);
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const destroyRecognizer = async () => {
    try {
      await Voice.destroy();
      setError('');
      setResults([]);
      setIsStarted(false);
    } catch (e) {
      console.error(e);
    }
  };

  const speakStarted = async () => {
    Tts.speak('Silahkan berbicara');
  };

  const openCamera = async () => {
    const res = await launchCamera();
    if (!res.didCancel) {
      Alert.alert('Scanning', 'Hang on a moment');
      const textRes = await RNTextDetector.detectFromUri(res.assets[0].uri);
      navigation.navigate('Result', {
        imageRes: res,
        textRes,
      });
    }
  };

  const openImage = async () => {
    const res = await launchImageLibrary();
    if (!res.didCancel) {
      Alert.alert('Scanning', 'Hang on a moment');
      const textRes = await RNTextDetector.detectFromUri(res.assets[0].uri);
      navigation.navigate('Result', {
        imageRes: res,
        textRes,
      });
    }
  };

  return (
    <>
      {/* <StatusBar backgroundColor={'#fff'} barStyle="light-content" /> */}
      <View style={styles.container}>
        <View style={styles.column}>
          <View style={styles.row}>
            <View>
              <Text style={styles.date}>{moment().format('ll')}</Text>
              <Text style={styles.name}>Hi {data.fullname}!</Text>
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
          <Text style={styles.text}>Getting Started Here</Text>
          <View style={{display: 'flex', flexDirection: 'column'}}>
            <TouchableOpacity
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
              style={styles.card}>
              <Image
                source={require('../assets/mic.png')}
                style={styles.icon}
              />
              <Text style={{fontWeight: 'bold'}}>
                {isStarted ? 'Stop' : 'Start'} Listening
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openCamera()} style={styles.card}>
              <Image
                source={require('../assets/camera_white.png')}
                style={styles.icon}
              />
              <Text style={{fontWeight: 'bold'}}>Take with Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openImage()} style={styles.card}>
              <Image
                source={require('../assets/document_white.png')}
                style={styles.icon}
              />
              <Text style={{fontWeight: 'bold'}}>Upload your Picture</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default Home;

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
    height: DEVICE.height / 6,
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
