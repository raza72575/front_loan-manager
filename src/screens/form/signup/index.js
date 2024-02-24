import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { InputField } from '../../../components/inputFiled';
import { API_SERVER_IP } from '../../../ip_address/ipconfig'; 
import { styles } from './styles';

const Signup = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState('');

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setRegistrationError('');
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [registrationError]);

  const handleRegistration = () => {
    if (!fullName || !email || !password || !confirmPassword || !contactNo) {
      setRegistrationError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setRegistrationError('Passwords do not match.');
      return;
    }

    if (contactNo.length < 11) {
      setRegistrationError('Please enter a correct contact number.');
      return;
    }

    setIsLoading(true);

    const newUser = {
      userName: fullName,
      userEmail: email,
      userPassword: password,
      contactNo: contactNo,
    };

    fetch(`http://${API_SERVER_IP}/FundsFriendlyApi/api/login/Signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        if (data === 'User Data Added Successfully') {
          console.log('Registration successful');
          setRegistrationError('Registered successfully');
          clearFields();
        } else if (data === 'Email Exit') {
          setRegistrationError('Email already exists');
        } else {
          setRegistrationError('An error occurred. Please try again later.');
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setRegistrationError('Registration failed. Please try again later.');
      });
  };

  const clearFields = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setContactNo('');
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.registrationContainer}>
          <Text style={styles.registrationText}>Create an Account</Text>
          <InputField label="Full Name" value={fullName} onChangeText={setFullName} />
          <InputField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <InputField label="Contact-No" value={contactNo} onChangeText={setContactNo} keyboardType='numeric' />

          <InputField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <InputField label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
          {registrationError ? <Text style={styles.errorText}>{registrationError}</Text> : null}
          <TouchableOpacity
            style={styles.registrationButton}
            onPress={handleRegistration}
            disabled={isLoading}
          >
            <Text style={styles.registrationButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;