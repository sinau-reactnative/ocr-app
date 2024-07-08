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
  ScrollView,
  Alert,
} from 'react-native';

import About from './About';
import Notification from './Notification';
import Filter from './Filter';
import firestore from '@react-native-firebase/firestore';
import logo from './assets/splash.png';
import axios from 'axios';

const DEVICE = Dimensions.get('window');

export const userData = [
  {
    nim: '1101212023',
    name: 'FAUZIAH RAMADHANI',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101212050',
    name: 'FANY FADILAH IRWAN',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101214001',
    name: 'ABIGAIL ARIVIANTI',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101214003',
    name: 'NUR AZIZAH',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101214006',
    name: 'SURYA DWI PERMANA',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101214008',
    name: 'SALSHABILA NATASYA',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101214009',
    name: 'VITA PUTRI HANDAYANI',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101214011',
    name: 'IQBAL ZUBAIR RAMADHAN',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101214027',
    name: 'LAKSAMANA AIDZUL HAQ',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101214037',
    name: 'LUKMAN HAKIM',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101214047',
    name: 'ERWIN ALFANDI',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101215002',
    name: 'NURYUNITA FAUZIAH ARROHMAH',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101215005',
    name: 'NATALIA',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101215007',
    name: 'SHERFINA SALSABILA',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101215010',
    name: 'AISYAH NABILAH HANASEPTYANI',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101215013',
    name: 'REFSI INDRA MAULANA',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101215016',
    name: 'AJENG SAPUTRI AL HIDAYAH',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101215019',
    name: 'DEWI UBUDIAH',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101215025',
    name: 'MUHAMMAD MAULANA AKBAR',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
  {
    nim: '1101215031',
    name: 'ARYA BIMANTARA MAHESA',
    suhu: Math.floor(Math.random() * (40 - 30 + 1)) + 30,
    status: 'Sehat',
    isAbsence: true,
  },
];

const sliceString = (string, length) => {
  if (string.length > length) {
    return string.slice(0, length) + '...';
  }
  return string;
}


const App = () => {

  const [showSplash, setShowSplash] = useState(true);
  const [menu, setMenu] = useState('nodes');
  const [data, setData] = useState([]);

  useEffect(() => {
    firestore().collection('tahap1').doc('absensi').collection('user').onSnapshot(docSnap => {
      let _data = [];
      docSnap.forEach(doc => {
        _data.push({
          id: doc.id,
          ...doc.data(),
        });
        if (_data.length === docSnap.size) {
          setData(_data);
        }
      });
    })

    firestore().collection('tahap1').doc('absensi').collection('user').doc('1101214001').onSnapshot(docSnap => {
      console.log(docSnap.data())
    })
  }, []);
  

 const reset = async () => {
    // const request = []
    // for (const user of userData ) {
    //   request.push(firestore().collection('tahap1').doc('kelas').collection('user').doc(user.nim).update({ isAbsence: false, suhu: 0}))
    // }
    // await Promise.all(request)
    //  .then(() => {
    //    Alert.alert('Success', 'Reset success')
    //  })
    //  .catch(err => {
    //    console.log(err)
    //  })
    // await fetch(`https://al-quran-8d642.firebaseio.com/data.json?print=pretty`).then(res => res.json()).then(data => {
    //   console.log('kesini', data)
    // })
 }

  return (
    <>
      <SafeAreaView>
        <View style={styles.container}>
          {showSplash ? (
            <View style={styles.splashContainer}>
              <Image source={logo} style={styles.image} />
              <Text style={styles.footerText}>
                Selamat datang di aplikasi SafeClass
              </Text>
              <TouchableOpacity
                style={{marginTop: 20}}
                onPress={() => setShowSplash(false)}>
                <View style={styles.buttonLogout}>
                  <Text style={styles.textLogin}>NEXT</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {menu === 'nodes' ? (
                <>
                  <View style={styles.menu}>
                    <View style={styles.titleContainer}>
                      <Text style={styles.title}>
                        {'List Mahasiswa'.toUpperCase()}
                      </Text>
                    </View>
                    <ScrollView>
                      {data?.map((i, index) => (
                        <View key={index} style={[styles.card, index % 2 === 0 ? { backgroundColor: '#F9c5b8' } : { backgroundColor: '#Fbe2dd' }]}>
                          <View>
                            <Text style={styles.menuText}>{sliceString(i?.name, 17)}</Text>
                            <Text style={styles.menuText}>{i?.nim}</Text>
                          </View>
                          <View style={{width: '40%' }}>
                            <Text style={styles.subMenu}>Suhu: <Text style={{ fontSize: 12 }}>{i?.suhu}°</Text></Text>
                            <Text style={styles.subMenu}>Status: <Text style={{ fontSize: 12 }}>{i?.status}</Text></Text>
                            <Text style={styles.subMenu}>Absensi: <Text style={{ fontSize: 12 }}>{i?.isAbsence ? 'Hadir' : 'Tidak Hadir'}</Text></Text>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                    <View
                    style={[
                      styles.rowContainer,
                      {
                        justifyContent: 'space-between',
                        width: 'auto',
                        paddingTop: 20
                      },
                    ]}>
                    <TouchableOpacity onPress={() => reset()}>
                      <View style={styles.buttonLogout}>
                        <Text style={styles.textLogin}>RESET</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setMenu('history')}>
                      <View style={styles.buttonLogout}>
                        <Text style={styles.textLogin}>HISTORY</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  </View>
                 
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
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    // marginBottom: 20,
    padding: 20,
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
    backgroundColor: '#cc5044',
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
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
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 3,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
    padding: 10,
    width: DEVICE.width / 1.2,
    height: DEVICE.height / 9,
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
  subMenu: {
    fontWeight: 'bold'
  }
});

export default App;
