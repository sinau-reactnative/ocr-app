import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

export const authRef = firestore()
  .collection('tahap1')
  .doc('ocrapp')
  .collection('users');

export const login = async data => {
  const {email, password} = data;
  let userData = [];

  await authRef
    .where('email', '==', email)
    .get()
    .then(docSnapshot => {
      docSnapshot.forEach(doc => userData.push({...doc.data(), id: doc.id}));
    })
    .catch(err => console.log('kesini emang?'));

  if (userData.length > 0) {
    if (userData[0].password !== password) {
      return {error: true, msg: 'Password Tidak Sama', data: []};
    } else {
      return {error: false, msg: 'Oke', data: userData[0]};
    }
  } else {
    return {error: true, msg: 'Email tidak ditemukan', data: []};
  }
};

export const register = async data => {
  return await authRef
    .add({
      ...data,
      created_at: moment().format('YYYY-MM-DD'),
      updated_at: moment().format('YYYY-MM-DD'),
    })
    .then(() => {
      return {error: false, msg: 'Akun berhasil dibuat', data: []};
    })
    .catch(err => {
      return {error: true, msg: err, data: []};
    });
};

export const updateEmergency = async data => {
  return await authRef
    .doc(data.id)
    .update({
      isPanic: data.isPanic,
      latitude: data.latitude,
      longitude: data.longitude,
      updated_at: moment().format('YYYY-MM-DD'),
    })
    .then(() => {
      return {error: false, msg: 'User is Panic', data: []};
    })
    .catch(err => {
      return {error: true, msg: err, data: []};
    });
};
