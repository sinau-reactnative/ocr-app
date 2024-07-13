import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

const DEVICE = Dimensions.get('screen');

const Detail = ({route}) => {
  const [data, setData] = useState(route.params.data);

  const mappingStatus = status => {
    switch (status) {
      case 1:
        return {
          status: 'Aman',
          notifikasi: 'Kesehatan paru paru dalam keadaan sehat',
        };
      case 2:
        return {
          status: 'Gejala Sesak Nafas',
          notifikasi:
            'Kesehatan paru paru dalam kondisi kurang sehat segera periksa kedokter spesialis paru paru',
        };
      case 3:
        return {
          status: 'Sesak Nafas',
          notifikasi:
            'Kesehatan paru paru dalam kondisi tidak sehat dan  masuk dalam kategori dugaan ppok. Segera periksa kedokter spesialis paru paru',
        };
      default:
        return {
          status: 'Aman',
          notifikasi: 'Kesehatan paru paru dalam keadaan sehat',
        };
    }
  };

  useEffect(() => {
    firestore().collection('pkm').doc('sparka').collection('user').doc(data?.id).onSnapshot(docSnap => {
      setData(docSnap.data());
    })
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{data?.name}</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.cardtitle}>Usia: {data?.age} Tahun</Text>
          <Text style={styles.cardtitle}>Tinggi Badan: {data?.height} cm</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardtitle}>Gender: {data?.gender}</Text>
          <Text style={styles.cardtitle}>Berat Badan: {data?.weight} kg</Text>
        </View>
      </View>
      <View style={styles.mainContainer}>
        <Text style={styles.mainCardtitle}>Data Monitoring</Text>
        <View style={styles.column}>
          <Text style={styles.mainCardText}>FEV1</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>
              {data?.FEV1} <Text style={styles.unit}>lt/m</Text>
            </Text>
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.mainCardText}>FVC</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>
              {data?.FVC} <Text style={styles.unit}>lt/m</Text>
            </Text>
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.mainCardText}>CO</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>
              {data?.CO} <Text style={styles.unit}>ppm</Text>
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardtitle}>Status POK:</Text>
        <Text style={styles.cardValue}>
          {mappingStatus(data?.status).status}
        </Text>
      </View>
      <View style={[styles.card, {marginTop: 12, height: DEVICE.height / 8.5}]}>
        <Text style={styles.cardtitle}>Notifikasi:</Text>
        <Text style={[styles.cardValue, {fontSize: 13}]}>
          {mappingStatus(data?.status).notifikasi}
        </Text>
      </View>
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  titleContainer: {
    width: DEVICE.width / 1.1,
  },
  card: {
    backgroundColor: '#EDECF4',
    width: DEVICE.width / 1.1,
    height: DEVICE.height / 10,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    padding: 12,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#432C81',
    padding: 12,
  },
  cardtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#432C81',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  mainContainer: {
    display: 'flex',
    width: DEVICE.width / 1.1,
    minHeight: DEVICE.height / 6,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#432C81',
    borderRadius: 10,
    marginVertical: 12,
    padding: 12,
  },
  mainCardtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#432C81',
  },
  mainCardText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#432C81',
  },
  valueContainer: {
    backgroundColor: '#B4AADA',
    width: DEVICE.width / 1.5,
    height: DEVICE.height / 15,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  unit: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
});
