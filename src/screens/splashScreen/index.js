// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, Animated, Easing } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const opacity = new Animated.Value(10);
  const translateY = new Animated.Value(0);

  useEffect(() => {
    // Animate the opacity
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      easing: Easing.circle,
      useNativeDriver: true,
    }).start();

    // Floating text animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -40,
          duration: 1000,
          easing: Easing.inOut(Easing.circle),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 10,
          duration: 1000,
          easing: Easing.inOut(Easing.circle),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Simulate a delay for demonstration purposes
    const timer = setTimeout(() => {
      // Navigate to the main screen or any other screen after the splash screen
      navigation.replace('WelcomeScreen');
    }, 3300); // Adjust the delay as needed (in milliseconds)

    // Clear the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, [navigation, opacity, translateY]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/images/s.png')}
        style={[styles.logo, { opacity }]}
      />
      <Animated.Text style={[styles.title, { transform: [{ translateY }] }]}>
        Welcome To 
      </Animated.Text >
      <Animated.Text style={[styles.fm, { transform: [{ translateY }] }]} >
        Friends Loan Manager
      </Animated.Text>
      <Text style={styles.subtitle}>---------- </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Customize the background color
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  fm:{
   color:'red',
   fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight:'700',
    marginTop:50
  },
});

export default SplashScreen;
