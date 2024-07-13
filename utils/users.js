import firestore from '@react-native-firebase/firestore';

export const authRef = firestore()
  .collection('pkm')
  .doc('sparka')
  .collection('user');

export const getUsers = async () => {
  let users = [];

  await authRef
    .get()
    .then(docSnapshot => {
      docSnapshot.forEach(doc => users.push({...doc.data(), id: doc.id}));
    })
    .catch(err => console.log('err: ', err));

    return {error: false, msg: 'Oke', data: users};
};

export const getDetailUser = async id => {
  return await authRef
    .doc(id)
    .get()
    .then(docSnapshot => {
      return {error: false, msg: 'Oke', data: {...docSnapshot.data(), id: docSnapshot.id}};
    })
    .catch(err => console.log('err: ', err));
};
