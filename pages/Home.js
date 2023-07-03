import React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {launchCamera} from 'react-native-image-picker';
import RNTextDetector from 'rn-text-detector';
import DocumentPicker, {types} from 'react-native-document-picker';
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

const DEVICE = Dimensions.get('screen');

const Home = ({route, navigation}) => {
  const {data} = route.params;

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
          <TouchableOpacity style={styles.button}>
            <Text style={styles.textButton}>HISTORY</Text>
          </TouchableOpacity>
        </View>
        <View style={[{backgroundColor: 'transparent', marginTop: 20}]}>
          <Text style={styles.text}>Getting Started Here</Text>
          <View style={{display: 'flex', flexDirection: 'column'}}>
            <TouchableOpacity
              onPress={async () => {
                const res = await launchCamera();
                if (!res.didCancel) {
                  Alert.alert('Scanning', 'Hang on a moment');
                  const textRes = await RNTextDetector.detectFromUri(
                    res.assets[0].uri,
                  );
                  navigation.navigate('Result', {
                    imageRes: res,
                    textRes,
                  });
                }
              }}
              style={styles.card}>
              <Image
                source={require('../assets/camera_white.png')}
                style={styles.icon}
              />
              <Text style={{fontWeight: 'bold'}}>Take with Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                const response = await DocumentPicker.pick({
                  presentationStyle: 'fullScreen',
                  type: [types.pdf],
                });
                console.log(response);
                // const res = await launchImageLibrary();
                // const textRes = await RNTextDetector.detectFromUri(
                //   response[0].uri,
                // );
                // console.log({textRes});
                // navigation.navigate('Result', {
                //   imageRes: res,
                //   textRes,
                // });
              }}
              style={styles.card}>
              <Image
                source={require('../assets/document_white.png')}
                style={styles.icon}
              />
              <Text style={{fontWeight: 'bold'}}>Upload your Document</Text>
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
    height: DEVICE.height / 2.7,
    width: DEVICE.width,
    paddingHorizontal: 20,
    paddingTop: 50,
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
