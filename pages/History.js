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

const History = ({route, navigation}) => {
  console.log('history: ', route.params.data);

  const FEV1_MAX = route.params.data?.FEV1_MAX || 0.7;
  const tableHead = ['Waktu', 'Nama', 'FEV1', 'FVC', 'CO', 'Status'];
  const tableWidth = [110, 140, 55, 70, 70, 140];
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState(null);

  useEffect(() => {
    firestore()
      .collection('pkm')
      .doc('sparka')
      .collection('user')
      .doc(route.params.data?.id)
      .collection('history')
      .onSnapshot(docSnap => {
        let datas = [];
        docSnap.forEach(doc => {
          const {createdAt, name} = doc.data();
          const FEV1 = Number(doc.data().FEV1);
          const FVC = Number(doc.data().FVC);
          const CO = Number(doc.data().CO);
          const FEV1_FVC = (FEV1 / FVC) * 100;
          let finalStatus = 'Normal';

          if (FEV1_FVC >= 70 && CO <= 6 && FEV1 >= FEV1_MAX) {
            finalStatus = 'Normal';
          } else if (
            (FEV1_FVC < 70 && FEV1_FVC >= 50 && CO <= 6 && FEV1 >= FEV1_MAX) ||
            (FEV1_FVC >= 70 && CO <= 6 && FEV1 < FEV1_MAX)
          ) {
            finalStatus = 'Gejala Sesak Nafas';
          } else if (
            FEV1_FVC < 70 &&
            FEV1_FVC >= 50 &&
            CO <= 6 &&
            FEV1 < FEV1_MAX
          ) {
            finalStatus = 'Sesak Nafas Ringan';
          } else if (FEV1_FVC < 50 && CO <= 6 && FEV1 < FEV1_MAX) {
            finalStatus = 'Sesak Nafas PPOK';
          } else if (FEV1_FVC < 50 && CO > 6 && FEV1 < FEV1_MAX) {
            finalStatus = 'Sesak Nafas Kronis';
          }

          datas.push({
            id: doc.id,
            data: [
              moment.unix(createdAt).format('DD/MM/YY HH:mm'),
              name,
              FEV1,
              FVC,
              CO,
              finalStatus,
            ],
          });
          if (datas.length === docSnap.size) {
            setData(datas);
          }
        });

        setIsLoading(false);
      });
  }, []);

  return (
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
              textStyle={[styles.text, {color: '#FFF'}]}
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
                      index % 2 && {backgroundColor: '#B4AADA'},
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
          <Text style={{fontSize: 20}}>{isLoading ? 'Loading...': 'History not Found'}</Text>
        </View>
      )}
    </View>
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
    color: '#fff',
  },
  header: {
    height: 50,
    backgroundColor: '#432C81',
  },
  text: {textAlign: 'center', fontWeight: 'bold', fontSize: 12},
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#fff'},
});

export default History;
