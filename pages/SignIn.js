import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
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
  const [isUser, setIsUser] = useState(true);

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
    if (isUser) {
      navigation.navigate('Home', {data: res.data});
    } else {
      navigation.navigate('HomeWali', {data: res.data});
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Onboard!</Text>
      <Text style={styles.subtitle}>Please enter your email and password</Text>
      {inputList.map((i, key) => {
        return (
          <View key={(key + 3).toString()}>
            <Text style={styles.intputTitle}>{i.title}</Text>
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
      <View style={styles.radioRow}>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            onPress={() => setIsUser(true)}
            style={styles.radioButton}>
            {isUser ? <View style={styles.selected} /> : <View />}
          </TouchableOpacity>
          <Text style={[styles.textButton, {paddingLeft: 10}]}>User</Text>
        </View>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            onPress={() => setIsUser(false)}
            style={styles.radioButton}>
            {!isUser ? <View style={styles.selected} /> : <View />}
          </TouchableOpacity>
          <Text style={[styles.textButton, {paddingLeft: 10}]}>Non User</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleLogin()} style={styles.button}>
        <Text style={styles.textButton}>
          {isLoading ? 'LOADING' : 'SIGN IN'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.alreadyHave}>
          Don't have an account?
          <Text style={{color: 'red'}}> Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#004170',
    display: 'flex',
    minHeight: DEVICE.height,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#fff',
  },
  subtitle: {fontSize: 12, marginTop: 15, color: '#fff', marginBottom: 20},
  button: {
    backgroundColor: '#69C9EF',
    paddingVertical: 14,
    marginTop: 40,
    marginHorizontal: 20,
    borderRadius: 20,
    elevation: 2,
    width: DEVICE.width / 1.2,
  },
  textButton: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    width: DEVICE.width / 1.5,
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 13,
  },
  intputTitle: {
    alignSelf: 'flex-start',
    color: '#fff',
    paddingBottom: 5,
    fontWeight: 'bold',
    marginTop: 15,
  },
  alreadyHave: {
    fontWeight: '400',
    paddingTop: 10,
    color: '#fff',
  },
  radioRow: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 20,
    minWidth: DEVICE.width / 2,
    justifyContent: 'space-between',
  },
  radioContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
});
