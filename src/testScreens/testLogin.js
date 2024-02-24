import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_SERVER_IP } from '../ip_address/ipconfig';

const LoginTest = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
      setDone('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [errorMessage, done]);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setErrorMessage('Please fill in both email and password.');
        return;
      }

      setLoading(true);
      const response = await fetch(
        `http://${API_SERVER_IP}/FundsFriendlyApi/api/login/login?email=${email}&password=${password}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        await AsyncStorage.setItem('userId', data.userId.toString());
        setUserId(data.userId); // Set the user ID in state
        console.log('Logged in successfully');
        setDone('Good to Go');
        navigation.navigate('UserGroup');
      } else {
        setErrorMessage('Invalid data');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Friends Loan Manager {'\n'}(Get Login)
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      {done && <Text style={styles.successText}>{done}</Text>}
      {userId && <Text style={styles.userIdText}>User ID: {userId}</Text>}
      <Button title="Login" onPress={handleLogin} disabled={loading} />
    </View>
  );
};

export default LoginTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    color: '#8b0000',
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  errorText: {
    color: 'red',
  },
  successText: {
    color: 'green',
  },
  userIdText: {
    color: 'blue',
  },
});
