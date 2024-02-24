import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { InputField } from '../../../components/inputFiled';
import { API_SERVER_IP } from '../../../ip_address/ipconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles';

const Login = ({navigation}) => {
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const handleLogin = async () => {
    try {
    
      if (!email || !password) {
        setErrorMessage('Please fill in all fields');   
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

      const data = await response.json();

      if (response.status === 200) {
        // Store user ID in AsyncStorage
        await AsyncStorage.setItem('userId', data.userId.toString());
        await AsyncStorage.setItem('userName',data.userName);

        await AsyncStorage.setItem('userEmail', data.userEmail);

        // Navigate to the Dashboard
        console.log("successfully logged")
        // console.warn("lets go boy to the Dashboard")
        navigation.navigate('Dashboard');

      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      console.log("An error occurred. Please try again later.");
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <InputField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <InputField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <View style={styles.signupContainer}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.signupText}> Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default Login