import React, {useEffect, useState} from 'react';
import {BarChart} from 'react-native-chart-kit';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
} from 'react-native';
import {firebase} from '@react-native-firebase/database';
import PushNotification from 'react-native-push-notification';
import Logo from '../assets/logo.png';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const getColorAndStatus = status => {
  let color = '#a01602';
  let description = 'Berbahaya';
  let statusContent =
    'Kualitas udara berbahaya yang secara umum dapat merugikan kesehatan yang serius pada populas';

  switch (status) {
    case 1:
      color = '#69fc9a';
      description = 'Baik';
      statusContent =
        'Tidak memberikan dampak bagi kesehatan manusia atau hewan.';
      break;
    case 2:
      color = '#f6f797';
      description = 'Sedang';
      statusContent =
        'Tidak berpengaruh pada kesehatan manusia ataupun hewan tetapi berpengaruh pada tumbuhan yang peka.';
      break;
    case 3:
      color = '#f99761';
      description = 'Tidak Sehat';
      statusContent =
        'Bersifat merugikan pada manusia ataupun kelompok hewan yang peka atau dapat menimbulkan kerusakan pada tumbuhan ataupun nilai estetika.';
      break;
    case 4:
      color = '#da2236';
      description = 'Sangat Tidak Sehat';
      statusContent =
        'Kualitas udara yang dapat merugikan kesehatan pada sejumlah segmen populasi yang terpapar.';
      break;
    default:
      color = '#a01602';
      description = 'Berbahaya';
      break;
  }

  return {
    color: (opacity = 1) => color,
    description,
    statusContent,
  };
};

const chartConfig = {
  backgroundColor: '#003161',
  backgroundGradientFrom: '#003161',
  backgroundGradientTo: '#003161',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 10,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

export default function App() {
  const [data, setData] = useState([]);
  const [dataRaw, setDataRaw] = useState([]);
  const [oldDataRaw, setOldDataRaw] = useState([]);
  const [colors, setColors] = useState([]);
  const [labels, setLabels] = useState(['CO', 'NO2', 'O3', 'PM10', 'PM2.5']);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const db = firebase.database();
    db.ref('/').on('value', snapshot => {
      const data = snapshot.val();

      let _datas = [];
      let _labels = [];
      let _colors = [];
      let _dataRaw = [];

      Object.keys(data).forEach(value => {
        const valueFromFirebase = {
          id: value,
          ...data[value],
          Value: Number(data[value].Value),
        };
        const {color, description, statusContent} = getColorAndStatus(
          +valueFromFirebase.Status,
        );
        _labels.push(
          value === 'PM100' ? 'PM10' : value === 'PM25' ? 'PM2.5' : value,
        );
        _datas.push(data[value].Value);
        _colors.push(color);
        _dataRaw.push({
          ...valueFromFirebase,
          Description: description,
          StatusContent: statusContent,
        });
      });

      setData(_datas);
      setColors(_colors);
      setLabels(_labels);

      const _dataRawSorted = _dataRaw.sort((a, b) => b.Value - a.Value);
      setDataRaw(_dataRawSorted);
    });

    PushNotification.createChannel(
      {
        channelId: 'default-channel-id',
        channelName: 'Default Channel',
      },
      created => console.log(`CreateChannel returned '${created}'`),
    );

    setTimeout(() => {
      setShowSplash(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (dataRaw[0]?.Value !== oldDataRaw[0]?.Value) {
      showNotification(dataRaw[0]);
    }

    setOldDataRaw(dataRaw);
  }, [dataRaw]);

  const showNotification = value => {
    PushNotification.localNotification({
      channelId: 'default-channel-id',
      title: `${value.id} - ${value.Description}`,
      message: value.StatusContent,
      smallIcon: "ic_notification"
    });
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: showSplash ? '#fff' : '#133E87'},
      ]}>
      <StatusBar backgroundColor={'#003161'} />
      {showSplash ? (
        <>
          <Image source={Logo} style={styles.splash} />
          <Text style={[styles.text, {color: '#003161', marginTop: 20}]}>
            ISPU MOBILE APP
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.text}>ISPU MOBILE APP</Text>
          <View style={[styles.card, {backgroundColor: '#003161'}]}>
            <View style={styles.column}>
              <Text style={styles.unit}>{dataRaw[0]?.id}</Text>
              <Text style={styles.value}>{dataRaw[0]?.Value}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.status}>{dataRaw[0]?.Description}</Text>
            </View>
          </View>
          <View style={[styles.card, {height: 70, marginTop: 20}]}>
            <Text style={[styles.unit, {fontSize: 12}]}>
              {dataRaw[0]?.StatusContent}
            </Text>
          </View>
          <BarChart
            style={styles.chart}
            data={{
              labels: labels,
              datasets: [
                {
                  data: data,
                  colors: colors,
                },
              ],
            }}
            width={screenWidth / 1.1}
            height={screenHeight / 3}
            fromZero={true}
            fromNumber={300}
            chartConfig={chartConfig}
            withCustomBarColorFromData={true}
            flatColor={true}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#133E87',
  },
  chart: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: screenHeight / 15,
    marginBottom: screenHeight / 20,
  },
  card: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 120,
    backgroundColor: '#608BC1',
    width: screenWidth / 1.1,
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    width: screenWidth / 2.5,
  },
  value: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  unit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#fff',
  },
  status: {
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  splash: {
    width: 300,
    height: 300,
  },
});
