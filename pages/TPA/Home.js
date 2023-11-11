/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import database from '@react-native-firebase/database';

import About from './About';
import Notification from './Notification';
import Filter from './Filter';

import logo from './assets/logo.png';
import therm from './assets/therm.png';
import cloud from './assets/cloud.png';

const DEVICE = Dimensions.get('window');

const mappingKey = {
  0: 'A',
  1: 'B',
  2: 'C',
};

const App = () => {
  const reference = database().ref('/TPA');

  const [showSplash, setShowSplash] = useState(true);
  const [menu, setMenu] = useState('nodes');
  const [data, setData] = useState({});

  useEffect(() => {
    reference.on('value', snapshot => {
      setData(snapshot.val());
    });
  }, []);

  return (
    <>
      <StatusBar backgroundColor={'#D36B00'} />
      <SafeAreaView>
        <View style={styles.container}>
          {showSplash ? (
            <View style={styles.splashContainer}>
              <Image source={logo} style={styles.image} />
              <Text style={styles.footerText}>
                Selamat datang di aplikasi Telemonitoring Suhu dan Kadar
                Pembakaran Tempat Pembuangan Sampah (TPS) Perum GPA Raya Ngijo
                Karangploso
              </Text>
              <TouchableOpacity onPress={() => setShowSplash(false)}>
                <View style={styles.buttonLogout}>
                  <Text style={styles.textLogin}>NEXT</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {menu === 'nodes' ? (
                <>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                      {'Realtime Monitoring'.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.menu}>
                    <View style={styles.card}>
                      <View style={styles.cardLeft}>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: 'bo',
                            color: '#293462',
                            marginBottom: 10,
                          }}>
                          TEMPERATURE
                        </Text>
                        <Image source={therm} style={styles.image2} />
                      </View>
                      <View style={styles.cardRigth}>
                        {Object.keys(data)
                          .filter(i => !i.search('suhu'))
                          .map((d, key) => (
                            <View key={key} style={styles.rowContainer}>
                              <View style={styles.rowInput2}>
                                <Text
                                  style={{fontWeight: 'bold', color: '#fff'}}>
                                  Point {mappingKey[key]}
                                </Text>
                              </View>
                              <View
                                style={[
                                  styles.rowInput,
                                  {
                                    backgroundColor:
                                      data[d] > 60 ? '#FFE898' : '#9ED2C6',
                                  },
                                ]}>
                                <Text
                                  style={{
                                    color: '#293462',
                                    fontWeight: 'bold',
                                  }}>
                                  {data[d]} ℃
                                </Text>
                              </View>
                            </View>
                          ))}
                        <View style={styles.rowContainer}>
                          <View
                            style={[
                              styles.rowInput,
                              {width: 150},
                              {
                                backgroundColor:
                                  data.suhuA > 60 ||
                                  data.suhuB > 60 ||
                                  data.suhuC > 60
                                    ? '#FFE898'
                                    : '#9ED2C6',
                              },
                            ]}>
                            <Text
                              style={{color: '#293462', fontWeight: 'bold'}}>
                              {data.suhuA > 60 ||
                              data.suhuB > 60 ||
                              data.suhuC > 60
                                ? 'MEMBAKAR'
                                : 'TIDAK MEMBAKAR'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.card, {height: DEVICE.height / 2.7}]}>
                      <View style={styles.cardLeft}>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: 'bo',
                            color: '#293462',
                            marginBottom: 10,
                          }}>
                          KADAR CO2
                        </Text>
                        <Image source={cloud} style={styles.image2} />
                      </View>
                      <View style={styles.cardRigth}>
                        {Object.keys(data)
                          .filter(i => !i.search('co'))
                          .map((d, key) => (
                            <>
                              <View key={key} style={styles.rowContainer}>
                                <View style={styles.rowInput2}>
                                  <Text
                                    style={{fontWeight: 'bold', color: '#fff'}}>
                                    Point {mappingKey[key]}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.rowInput,
                                    {
                                      backgroundColor:
                                        data[d] > 1000 ? '#FF7C7C' : '#9ED2C6',
                                    },
                                  ]}>
                                  <Text
                                    style={{
                                      color: '#293462',
                                      fontWeight: 'bold',
                                    }}>
                                    {data[d]} PPM
                                  </Text>
                                </View>
                              </View>
                              <View
                                style={[
                                  styles.rowContainer,
                                  {paddingBottom: 12},
                                ]}>
                                <View
                                  style={[
                                    styles.rowInput,
                                    {width: 150},
                                    {
                                      backgroundColor:
                                        data[d] > 1000 ? '#FF7C7C' : '#9ED2C6',
                                    },
                                  ]}>
                                  <Text
                                    style={{
                                      color: '#293462',
                                      fontWeight: 'bold',
                                    }}>
                                    {data[d] > 1000 ? 'TIDAK AMAN' : 'AMAN'}
                                  </Text>
                                </View>
                              </View>
                            </>
                          ))}
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.rowContainer,
                      {
                        justifyContent: 'space-between',
                        width: DEVICE.width / 1.3,
                      },
                    ]}>
                    <TouchableOpacity onPress={() => setMenu('notifikasi')}>
                      <View style={styles.buttonLogout}>
                        <Text style={styles.textLogin}>NOTIFIKASI</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setMenu('history')}>
                      <View style={styles.buttonLogout}>
                        <Text style={styles.textLogin}>HISTORY</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => setMenu('filter')}>
                    <View
                      style={[
                        styles.buttonLogout,
                        {width: DEVICE.width / 1.3},
                      ]}>
                      <Text style={styles.textLogin}>MONITORING FILTER</Text>
                    </View>
                  </TouchableOpacity>
                  {/* <Notification isShow={showNotification} data={data} oldData={sendData} setShow={() => setShowNotification(false)} /> */}
                </>
              ) : menu === 'notifikasi' ? (
                <Notification setMenu={setMenu} />
              ) : menu === 'filter' ? (
                <Filter setMenu={setMenu} />
              ) : (
                <About setMenu={setMenu} />
              )}
            </>
          )}
        </View>
      </SafeAreaView>
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
  },
  splashContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: 20,
  },
  image: {
    width: DEVICE.width / 1.5,
    height: DEVICE.width / 1.5,
    borderRadius: 10,
    marginVertical: 30,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#103754',
    textAlign: 'center',
    letterSpacing: 2,
  },
  buttonMenu: {
    display: 'flex',
    backgroundColor: '#FFDBA4',
    height: DEVICE.width / 5,
    width: DEVICE.width / 2,
    marginTop: 10,
    borderRadius: 3,
    padding: 10,
  },
  danger: {
    borderColor: '#FF8B8B',
  },
  primary: {
    borderColor: '#66BFBF',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 21,
    color: '#495C83',
    textAlign: 'center',
    marginTop: 5,
  },
  buttonText2: {
    fontSize: 9,
    color: '#495C83',
  },
  buttonLogout: {
    display: 'flex',
    backgroundColor: '#FEC260',
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  footerText: {
    fontSize: 17,
    fontFamily: 'sans-serif-condensed',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 8,
  },
  textLogin: {
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 3,
    width: DEVICE.width / 1.3,
    height: DEVICE.width / 2.1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
  },
  cardLeft: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: DEVICE.width / 1.5 / 2,
  },
  image2: {
    width: 100,
    height: 100,
  },
  cardRigth: {
    display: 'flex',
    alignItems: 'center',
    width: DEVICE.width / 1.2 / 2,
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 4,
  },
  rowInput: {
    backgroundColor: '#F0F0F0',
    width: 90,
    padding: 5,
    display: 'flex',
    alignItems: 'center',
    borderTopEndRadius: 3,
    borderBottomEndRadius: 3,
  },
  rowInput2: {
    backgroundColor: '#F29393',
    width: 60,
    padding: 5,
    display: 'flex',
    alignItems: 'center',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
});

export default App;
