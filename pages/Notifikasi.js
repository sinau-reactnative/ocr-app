import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';

const DEVICE = Dimensions.get('screen');

const Notifikasi = ({route}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dataUser = route.params.data;

  const mappingStatus = status => {
    switch (status) {
      case 1:
        return {
          status: 'Normal',
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
          status: 'Sesak Nafas Ringan',
          notifikasi:
            'Kesehatan paru paru dalam kondisi kurang sehat segera periksa kedokter spesialis paru paru',
        };
      case 4:
        return {
          status: 'Sesak Nafas PPOK',
          notifikasi:
            'Kesehatan paru paru dalam kondisi tidak sehat dan  masuk dalam kategori dugaan ppok. Segera periksa kedokter spesialis paru paru',
        };
      case 5:
        return {
          status: 'Sesak Nafas Kronis',
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
    const FEV1_MAX = data?.FEV1_MAX || 0.7;

    firestore()
      .collection('pkm')
      .doc('sparka')
      .collection('user')
      .doc(dataUser?.id)
      .collection('history')
      .onSnapshot(docSnap => {
        console.log('docSnap: ', docSnap.size);

        let datas = [];
        docSnap.forEach(doc => {
          console.log('doc: ', doc.data());
          const {createdAt, name} = doc.data();
          const FEV1 = Number(doc.data().FEV1);
          const FVC = Number(doc.data().FVC);
          const CO = Number(doc.data().CO);
          const FEV1_FVC = (FEV1 / FVC) * 100;
          let finalStatus;

          if (FEV1_FVC >= 70 && CO <= 6 && FEV1 >= FEV1_MAX) {
            finalStatus = 1;
          } else if (
            (FEV1_FVC < 70 && FEV1_FVC >= 50 && CO <= 6 && FEV1 >= FEV1_MAX) ||
            (FEV1_FVC >= 70 && CO <= 6 && FEV1 < FEV1_MAX)
          ) {
            finalStatus = 2;
          } else if (
            FEV1_FVC < 70 &&
            FEV1_FVC >= 50 &&
            CO <= 6 &&
            FEV1 < FEV1_MAX
          ) {
            finalStatus = 3;
          } else if (FEV1_FVC < 50 && CO <= 6 && FEV1 < FEV1_MAX) {
            finalStatus = 4;
          } else if (FEV1_FVC < 50 && CO > 6 && FEV1 < FEV1_MAX) {
            finalStatus = 5;
          }

          console.log('notifikasi - finalStatus: ', finalStatus);

          datas.push({
            id: doc.id,

            tgl: moment.unix(createdAt).format('DD/MM/YYYY HH:mm'),
            name,
            FEV1,
            FVC,
            CO,
            finalStatus,
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
      <ScrollView>
        {data?.length > 0 ? (
          data.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cartTitle}>{item.tgl}</Text>
              <Text style={styles.cardValue}>
                {mappingStatus(item.finalStatus).notifikasi}
              </Text>
            </View>
          ))
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              height: DEVICE.height / 2,
            }}>
            <Text style={{fontSize: 20}}>
              {isLoading ? 'Loading...' : 'History not Found'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Notifikasi;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  card: {
    width: DEVICE.width / 1.1,
    height: 75,
    backgroundColor: '#B4AADA',
    borderRadius: 10,
    padding: 5,
    marginVertical: 5,
  },
  cartTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
    paddingTop: 5,
  },
  cardValue: {
    color: '#fff',
    fontSize: 13,
    paddingTop: 4
  },
});
