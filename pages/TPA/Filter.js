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
  Pressable,
  Image,
} from 'react-native';
import moment from 'moment';
import cloud from './assets/cloud.png';
import database from '@react-native-firebase/database';

const DEVICE = Dimensions.get('window');

const Filter = ({setMenu, role}) => {
  const [data, setData] = useState(null);
  const [filterMode, setFilterMode] = useState(1);
  const reference = database().ref('/TPA');

  useEffect(() => {
    reference.on('value', snapshot => {
      setData(snapshot.val());
    });
  }, []);

  const resolveData = (filterMode) => {
    if(filterMode === 1) {
      return ['filterCo2In1', 'filterCo2Out1']
    } else if(filterMode === 2) {
      return ['filterCo2In2', 'filterCo2Out2']
    } else if(filterMode === 3) {
      return ['filterCo2In3', 'filterCo2Out3']
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>MONITORING FILTER</Text>
      </View>
      <View style={{display: 'flex', flexDirection: 'row', marginBottom: 10}}>
        <Pressable
          onPress={() => setFilterMode(1)}
          style={filterMode === 1 ? styles.buttonActive : styles.buttonNonActive}>
          <Text>FILTER A</Text>
        </Pressable>
        <Pressable
          onPress={() => setFilterMode(2)}
          style={filterMode === 2 ? styles.buttonActive : styles.buttonNonActive}>
          <Text>FILTER B</Text>
        </Pressable>
        <Pressable
          onPress={() => setFilterMode(3)}
          style={filterMode === 3 ? styles.buttonActive : styles.buttonNonActive}>
          <Text>FILTER C</Text>
        </Pressable>
      </View>
      <View style={[styles.card]}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardTitle}>KADAR CO2</Text>
          <Text style={styles.cardTitle}>LUBANG MASUK</Text>
          <Image source={cloud} style={styles.image2} />
        </View>
        <View style={styles.cardRigth}>
          <Text style={{fontSize: 34, fontWeight: 'bold'}}>
            {data?.[resolveData(filterMode)[0]]} <Text style={{fontSize: 22}}>PPM</Text>
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.buttonLogout,
          {width: DEVICE.width / 1.3, marginTop: 30},
          data?.[resolveData(filterMode)[0]] > 100 && {backgroundColor: '#F29393'},
        ]}>
        <Text style={styles.textLogin}>
          {data?.[resolveData(filterMode)[0]] > 100
            ? 'TERJADI PROSES FILTER'
            : 'TIDAK ADA PROSES FILTER'}
        </Text>
      </View>
      <View style={[styles.card]}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardTitle}>KADAR CO2</Text>
          <Text style={styles.cardTitle}>LUBANG KELUAR</Text>
          <Image source={cloud} style={styles.image2} />
        </View>
        <View style={styles.cardRigth}>
          <Text style={{fontSize: 34, fontWeight: 'bold'}}>
            {data?.[resolveData(filterMode)[1]]} <Text style={{fontSize: 22}}>PPM</Text>
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.buttonLogout, {position: 'absolute', bottom: 0}]}
        onPress={() => setMenu('nodes')}>
        <Text style={styles.textLogin}>←Back</Text>
      </TouchableOpacity>
    </View>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 3,
    width: DEVICE.width / 1.3,
    height: DEVICE.width / 3.8,
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
  cardRigth: {
    display: 'flex',
    alignItems: 'center',
    width: DEVICE.width / 1.2 / 2,
  },
  image2: {
    width: 60,
    height: 60,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bo',
    color: '#293462',
  },
  buttonActive: {
    borderBottomWidth: 1,
    borderBottomColor: '#FEC260',
    paddingHorizontal: 12,
    paddingBottom: 5,
  },
  buttonNonActive: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingHorizontal: 12,
    paddingBottom: 5,
  },
});

export default Filter;
