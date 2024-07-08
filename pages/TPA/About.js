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
import {Table, Row, Rows} from 'react-native-table-component';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

const DEVICE = Dimensions.get('window');

const About = ({setMenu}) => {
  const tableHead = ['Waktu', 'Nama', 'Suhu (C)', 'Status', 'Hadir'];
  const tableWidth = [110, 140, 55, 70, 130];

  const [data, setData] = useState(null);

  useEffect(() => {
    firestore()
      .collection('tahap1')
      .doc('absensi')
      .collection('history')
      .orderBy('createdAt', 'desc')
      .onSnapshot(docSnap => {
        let _data = [];
        docSnap.forEach(doc => {
          const {createdAt, isAbsence, name, suhu, status} = doc.data();
          _data.push({
            id: doc.id,
            data: [
              moment.unix(createdAt).format('DD/MM/YY HH:mm'),
              name,
              suhu,
              status,
              isAbsence ? "Hadir" : "Tidak Hadir",
            ],
          });
          if (_data.length === docSnap.size) {
            setData(_data);
          }
        });
      });
  }, []);

  return (
    <>
      <Text style={styles.title}>History Table</Text>
      <View style={styles.container}>
        {data?.length > 0 ? (
          <ScrollView horizontal>
            <Table
              borderStyle={{
                borderWidth: 1,
                borderColor: '#C1C0B9',
              }}>
              <Row
                data={tableHead}
                style={styles.header}
                widthArr={tableWidth}
                textStyle={styles.text}
              />

              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  {data?.map((row, index) => (
                    <Row
                      key={index}
                      data={row.data}
                      widthArr={tableWidth}
                      style={[
                        styles.row,
                        index % 2 && {backgroundColor: '#F7F6E7'},
                      ]}
                      textStyle={styles.text}
                    />
                  ))}
                </Table>
              </ScrollView>
            </Table>
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              height: DEVICE.height / 2,
            }}>
            <Text style={{fontSize: 20}}>Loading...</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.buttonLogout}
        onPress={() => setMenu('nodes')}>
        <Text style={styles.textLogin}>←Back</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    // alignSelf: 'flex-start',
    padding: 10,
  },
  container: {
    width: DEVICE.width,
    height: DEVICE.height / 1.2,
  },
  buttonLogout: {
    display: 'flex',
    backgroundColor: '#cc5044',
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  textLogin: {
    fontWeight: 'bold',
    color: '#fff'
  },
  header: {
    height: 50,
    backgroundColor: '#F9c5b8',
  },
  text: {textAlign: 'center', fontWeight: 'bold', fontSize: 12},
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#E7E6E1'},
});

export default About;
