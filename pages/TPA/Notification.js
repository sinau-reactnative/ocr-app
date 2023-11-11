/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

const DEVICE = Dimensions.get('window');

const KamarTamu = ({setMenu, role}) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    firestore()
      .collection('tahap1')
      .doc('tpa')
      .collection('notification')
      .onSnapshot(docSnap => {
        let _data = [];
        docSnap.forEach(doc => {
          _data.push({
            id: doc.id,
            ...doc.data(),
          });
          if (_data.length === docSnap.size) {
            setData(_data.sort((a, b) => b.createdAt - a.createdAt));
          }
        });
      });
  }, []);

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>List Notifikasi</Text>
      </View>
      <ScrollView style={styles.scrollviewContainer}>
        {data &&
          data.map((i, key) => {
            return (
              <View key={key} style={styles.row}>
                <Text style={styles.tanggal}>
                  {moment.unix(i.createdAt).format('YYYY/MM/DD HH:mm')}
                </Text>
                {/* <Text>{`${i.gudang.name} ${i.status}`}</Text> */}
                <Text style={{fontWeight: 'bold', color: '#495C83'}}>
                  {i.msg}
                </Text>
              </View>
            );
          })}
      </ScrollView>
      <TouchableOpacity
        style={styles.buttonLogout}
        onPress={() => setMenu('nodes')}>
        <Text style={styles.textLogin}>←Back</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  scrollviewContainer: {
    width: DEVICE.width / 1.3,
    height: DEVICE.height / 1.6,
    marginBottom: 30,
    borderBottomColor: '#fff',
    borderBottomWidth: 3,
  },
  titleContainer: {
    alignSelf: 'flex-start',
    marginLeft: DEVICE.width / 8.5,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#103754',
  },
  tanggal: {
    fontSize: 10,
    color: '#5F7161',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  card: {
    width: DEVICE.width / 1.4,
    height: DEVICE.height / 5.5,
    backgroundColor: '#66BFBF',
    borderRadius: 5,
    shadowColor: '#66BFBF',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    margin: 10,
    marginBottom: 20,
  },
  textTitleCard: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B85252',
    paddingBottom: 5,
  },
  textTitleCard2: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  textTitleCard3: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#B85252',
    alignSelf: 'flex-end',
    marginTop: 15,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dashed',
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#C4D7E0',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  row1: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textValue: {
    color: '#746c5c',
    fontSize: 40,
    fontWeight: 'bold',
  },
  textTitleCardValue: {
    color: '#746c5c',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonLogout: {
    display: 'flex',
    backgroundColor: '#FEC260',
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 30,
  },
  textLogin: {
    fontWeight: 'bold',
  },
});

export default KamarTamu;
