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
import {register} from '../utils/auth';

const DEVICE = Dimensions.get('screen');

const inputList = [
  {id: 'fullname', title: 'Fullname', placeholder: 'Enter your fullname'},
  {id: 'email', title: 'Email', placeholder: 'Enter your email'},
  {
    id: 'password',
    title: 'Password',
    placeholder: 'Enter your password',
    secure: true,
  },
  {
    id: 'repassword',
    title: 'Confirm Password',
    placeholder: 'Enter your confirm password',
    secure: true,
  },
];

const initForm = {
  fullname: '',
  email: '',
  password: '',
  repassword: '',
};

const SignUp = ({navigation}) => {
  const [form, setForm] = useState(initForm);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    if (
      !form.fullname.length ||
      !form.password.length ||
      !form.repassword.length ||
      !form.email.length
    ) {
      Alert.alert('Field cannot be null');
      setIsLoading(false);
      return;
    }
    if (form.password !== form.repassword) {
      Alert.alert('Password is not same');
      setIsLoading(false);
      return;
    }

    const res = await register(form);
    if (res.error) {
      Alert.alert('Error', res.msg);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setForm(initForm);
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Onboard!</Text>
      <Text style={styles.subtitle}>Let’s help tidy up your reading list.</Text>
      {inputList.map((i, key) => {
        return (
          <View key={key}>
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
      <TouchableOpacity
        disabled={isLoading}
        onPress={() => handleRegister()}
        style={styles.button}>
        <Text style={styles.textButton}>
          {isLoading ? 'LOADING' : 'SIGN UP'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.alreadyHave}>
          Already have an account?
          <Text style={{color: 'red'}}> Sign In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUp;

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
});
