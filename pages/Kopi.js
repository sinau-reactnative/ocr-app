import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  // Image,
  ScrollView,
  Pressable,
} from 'react-native';
// import {db} from './config';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';

// import Oksigen from './images/logo-02.png';
// import hen from '../assets/bean.png';
// import light from '../assets/light.png';
// import medium from '../assets/medium.png';
// import dark from '../assets/dark.png';

const DEVICE = Dimensions.get('window');

const mappingWarna = {0: 'Light', 1: 'Medium', 2: 'Dark', 3: 'Tidak Sesuai'};

const App = () => {
  const [data, setData] = useState({
    frekuensi: 0,
    warna: 0,
    fuzzy: 0,
    type: 0,
  });
  const [isStarted, setIsStarted] = useState();
  const [type, setType] = useState();

  useEffect(() => {
    database()
      .ref('/Rara')
      .on('value', snapshot => {
        const {frekuensi, warna, type, result_type, is_started} =
          snapshot.val();
        const _fuzzy = parseFloat(snapshot.val().fuzzy);

        setData({
          frekuensi,
          warna,
          fuzzy: _fuzzy,
          type: result_type,
        });
        setIsStarted(is_started);
        setType(type);
      });
  }, []);

  const handleIsStarted = () => {
    database()
      .ref('/Rara')
      .update({is_started: !isStarted ? 1 : 0});
  };

  const handleType = _type => {
    database().ref('/Rara').update({type: _type});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#7e5333'} />
      <ScrollView>
        <View style={styles.scrollviewContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              SISTEM PENGGILING KOPI BERBASIS IOT
            </Text>
            <Text style={styles.subTitle}>
              Silahkan Taruh Biji Kopi Hasil Roasing
            </Text>
          </View>
          {/* <Image source={hen} style={styles.image} /> */}
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <Text style={styles.textTitleCard}>FREKUENSI</Text>
              <Text style={styles.textValue}>{data.frekuensi}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.textTitleCard}>SENSOR WARNA</Text>
              <Text style={styles.textValue}>{data.warna}</Text>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.card2}>
              <Text style={styles.textTitleCard}>NILAI FUZZY</Text>
              <Text style={styles.textValue}>{data.fuzzy}</Text>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.card3}>
              <Text style={styles.textTitleCardKeterangan}>KETERANGAN</Text>
              <View>
                <Text style={styles.textValueKeterangan}>
                  Hasil Sugeno Singleton:{' '}
                  <Text style={{color: '#000'}}>{data.fuzzy}</Text>
                </Text>
                <Text style={styles.textValueKeterangan}>
                  Tingkat kematangan:{' '}
                  <Text style={{color: '#000'}}>{mappingWarna[data.type]}</Text>
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.footerContainer}>
            {Object.keys(mappingWarna).map((i, key) => {
              if (key !== 3) {
                return (
                  <Pressable
                    style={type == i ? styles.buttonActive : styles.button}
                    key={i}
                    onPress={() => {
                      if (type != i) {
                        setType(i);
                        handleType(+i);
                      } else {
                        setType();
                      }
                    }}>
                    <Text
                      style={
                        type == i ? styles.textButtonActive : styles.textButton
                      }>
                      Type {mappingWarna[i]}
                    </Text>
                  </Pressable>
                );
              }
            })}
          </View>
          <Pressable
            disabled={type === null || type === undefined}
            style={
              isStarted ? styles.buttonStartedActive : styles.buttonStarted
            }
            onPress={() => {
              setIsStarted(!isStarted);
              handleIsStarted();
            }}>
            <Text
              style={
                isStarted
                  ? styles.textButtonStartedActive
                  : styles.textButtonStarted
              }>
              {isStarted ? 'Proses Sedang Berjalan' : 'Mulai Proses'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7e5333',
  },
  scrollviewContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginVertical: 20,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  subTitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 12,
    marginBottom: 12,
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: DEVICE.width,
    height: DEVICE.height,
    position: 'absolute',
    zIndex: -999999,
    paddingTop: DEVICE.height / 10,
  },
  card3: {
    width: DEVICE.width / 1.2,
    height: DEVICE.height / 9,
    backgroundColor: '#fbab45',
    borderRadius: 5,
    shadowColor: '#f5b25f',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 10,
  },
  card2: {
    width: DEVICE.width / 1.7,
    height: DEVICE.height / 7,
    backgroundColor: '#fbab45',
    borderRadius: 5,
    shadowColor: '#f5b25f',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 10,
  },
  card: {
    width: DEVICE.width / 2.7,
    height: DEVICE.height / 6,
    backgroundColor: '#fbab45',
    borderRadius: 5,
    shadowColor: '#f5b25f',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 10,
  },
  textTitleCard: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7e5333',
    paddingBottom: 10,
  },
  textTitleCardKeterangan: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#7e5333',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textValue: {
    color: '#746c5c',
    fontSize: 30,
    fontWeight: 'bold',
  },
  textValueKeterangan: {
    color: '#746c5c',
    fontSize: 15,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#F8F0E5',
    padding: 10,
    marginTop: 10,
  },
  footerText: {
    color: '#fff',
    fontWeight: 'bold',
    paddingTop: 3,
    fontSize: 17,
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  imageFooter: {
    width: DEVICE.height / 8,
    height: DEVICE.height / 8,
  },
  button: {
    width: DEVICE.width / 1.2,
    backgroundColor: '#053B50',
    borderRadius: 5,
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    margin: 5,
  },
  textButton: {
    fontWeight: 'bold',
    color: '#EEEEEE',
  },
  buttonActive: {
    width: DEVICE.width / 1.2,
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    margin: 5,
  },
  textButtonActive: {
    fontWeight: 'bold',
    color: '#053B50',
  },
  buttonStarted: {
    width: DEVICE.width / 1.2,
    backgroundColor: '#AE445A',
    borderRadius: 5,
    padding: 15,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
  },
  textButtonStarted: {
    fontWeight: 'bold',
    color: '#EEEEEE',
  },
  buttonStartedActive: {
    width: DEVICE.width / 1.2,
    backgroundColor: '#35A29F',
    borderRadius: 5,
    padding: 15,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
  },
  textButtonStartedActive: {
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default App;
