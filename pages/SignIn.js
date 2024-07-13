import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import {login} from '../utils/auth';

const DEVICE = Dimensions.get('screen');

const inputList = [
  {id: 'email', title: 'Email', placeholder: 'Enter your email'},
  {
    id: 'password',
    title: 'Password',
    placeholder: 'Enter your password',
    secure: true,
  },
];

const initForm = {
  email: '',
  password: '',
};

const SignIn = ({navigation}) => {
  const [form, setForm] = useState(initForm);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    if (!form.email.length || !form.password.length) {
      Alert.alert('Field cannot be null');
      setIsLoading(false);
      return;
    }

    const res = await login(form);
    if (res.error) {
      Alert.alert('Error', res.msg);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setForm(initForm);
    navigation.navigate('Home', {data: res.data});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selamat Datang di</Text>
      <Text style={[styles.title, {fontSize: 30}]}>SPARKA</Text>
      <Image
        source={require('../assets/sparka.jpeg')}
        style={{
          height: DEVICE.height / 2.5,
          objectFit: 'contain',
        }}
      />
      {inputList.map((i, key) => {
        return (
          <View key={(key + 3).toString()}>
            <TextInput
              style={styles.input}
              placeholder={i.placeholder}
              secureTextEntry={i?.secure}
              value={form[i]}
              onChangeText={val => setForm({...form, [i.id]: val})}
            />
          </View>
        );
      })}
      <TouchableOpacity onPress={() => handleLogin()} style={styles.button}>
        <Text style={styles.textButton}>
          {isLoading ? 'LOADING' : 'SIGN IN'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    display: 'flex',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#432C81',
  },
  button: {
    backgroundColor: '#432C81',
    paddingVertical: 14,
    marginTop: 40,
    marginHorizontal: 20,
    borderRadius: 5,
    elevation: 2,
    width: DEVICE.width / 1.3,
  },
  textButton: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    width: DEVICE.width / 1.3,
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 13,
    borderColor: '#EDECF4',
    borderWidth: 1,
    margin: 5,
    color: '#432C81',
  },
  intputTitle: {
    alignSelf: 'flex-start',
    color: '#fff',
    paddingBottom: 5,
    fontWeight: 'bold',
    marginTop: 15,
  },
});
