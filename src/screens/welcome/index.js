import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const WelcomeScreen = ({ navigation }) => {
  const handleLogin = () => {
    navigation.navigate('Login');
    console.log('Getting started');
    
  };

  return (
    <ImageBackground
      source={require('../../assets/images/welcomeBackimg.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>
          <Text style={{ color: 'red', fontSize: 45 }}>F</Text>RIENDS LOAN MANAGER
        </Text>

        <Image
          style={styles.image}
          source={require('../../assets/images/welcome.jpg')}
        />

        <Text style={styles.description}>
          Friends Loan Manager: Your trusted companion for tracking and settling loans among friends, making money matters within your social circle a breeze.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Let's Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: windowWidth * 0.01,
    margin: windowWidth * 0.1,
    alignItems: 'center',
  },
  title: {
    fontSize: windowWidth * 0.06,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: windowHeight * 0.05,
    marginTop: windowHeight * 0.05,
  },
  image: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.4,
    borderRadius: windowWidth * 1,
  },
  description: {
    color: '#111',
    marginTop: windowHeight * 0.03,
    textAlign: 'center',
    fontSize: windowWidth * 0.04,
  },
  button: {
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    width: windowWidth * 0.5,
    alignItems: 'center',
    elevation: 10,
    marginTop: windowHeight * 0.07,
    padding: windowHeight * 0.015,
  },
  buttonText: {
    fontSize: windowWidth * 0.05,
  },
});

export default WelcomeScreen;
