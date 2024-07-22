import React, {useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  BackHandler,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {getUsers} from '../utils/users';

const DEVICE = Dimensions.get('screen');

const Home = ({navigation}) => {
  const [data, setData] = useState([]);

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

  const initData = async () => {
    const res = await getUsers();
    if (res.error) {
      Alert.alert('Error', res.msg);
    } else {
      setData(res.data);
    }
  };

  const handleDetail = (user) => {
    navigation.navigate('Detail', {data: user});
  }

  useEffect(() => {
    initData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.mainCard}>
        <Text style={styles.mainCardtitle}>Data Pasien</Text>
        <Image source={require('../assets/user1.jpeg')} style={{width: 120, height: 120}} />
      </View>
      <ScrollView style={{ marginTop: 12 }}>
        {data?.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardtitle}>{item.name}</Text>
            <Text style={styles.cardValue}>Usia: {item.age}</Text>
            <View style={styles.row}>
              <Text style={styles.cardValue}>Gender: {item.gender}</Text>
              <TouchableOpacity onPress={() => handleDetail(item)}>
                <Text style={styles.cardDetail}>Detail Pasien →</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 24
  },
  mainCard: {
    backgroundColor: '#EDECF4',
    width: DEVICE.width / 1.1,
    height: DEVICE.height / 5,
    borderRadius: 10,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  mainCardtitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#432C81',
  },
  card: {
    backgroundColor: '#B4AADA',
    width: DEVICE.width / 1.1,
    height: DEVICE.height / 8,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 12,
    marginTop: 20,
  },
  cardtitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#432C81',
  },
  cardValue: {
    fontSize: 13,
    color: '#000',
    fontWeight: 'bold',
  },
  cardDetail: {
    fontSize: 12,
    color: '#432C81',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
