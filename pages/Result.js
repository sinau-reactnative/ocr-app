import React, {useEffect} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Tts from 'react-native-tts';

const DEVICE = Dimensions.get('screen');

export default function Result({route, navigation}) {
  const {imageRes, textRes} = route.params;

  useEffect(() => {
    Tts.setDefaultLanguage('in-ID');
    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-finish', event => console.log('finish', event));
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));
  }, []);

  const speak = () => {
    Tts.stop();
    Tts.speak(textRes[0].text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SCAN RESULT</Text>
      {/* <Image source={imageRes.assets[0]} style={{width: 100, height: 100}} /> */}
      <ScrollView style={styles.scrollview}>
        {textRes?.[0].lines?.map(i => {
          return <Text style={{color: '#fff'}}>{i.text}</Text>;
        })}
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={() => speak()}>
        <Text style={styles.textButton}>Text to Speech</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    display: 'flex',
    minHeight: DEVICE.height,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#004170',
    letterSpacing: 3,
    marginVertical: 20,
  },
  scrollview: {
    backgroundColor: '#004170',
    width: DEVICE.width / 1.4,
    maxHeight: DEVICE.height / 2,
    borderRadius: 10,
    padding: 10,
  },
  button: {
    backgroundColor: '#004170',
    width: DEVICE.width / 1.4,
    minHeight: 50,
    marginTop: 20,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
