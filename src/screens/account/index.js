import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Switch, Image, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Account = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserNameEmail = useCallback(async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      const userName = await AsyncStorage.getItem('userName');

      setUserEmail(userEmail);
      setUserName(userName);

      console.log("userName:", userName);
      console.log("userEmail:", userEmail);

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserNameEmail();
    setRefreshing(false);
  }, [fetchUserNameEmail]);

  useEffect(() => {
    fetchUserNameEmail();
  }, [navigation, fetchUserNameEmail]);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            // Perform logout actions if needed

            // Navigate to the Login screen
            navigation.navigate('Login');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleMyPayables = () => {
    navigation.navigate('MyPayable');
  };

  const handleMyReceivables = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      if (userId) {
        navigation.navigate('MyReceivables', { userId: userId });
      } else {
        Alert.alert('Error', 'User ID not found.');
      }
    } catch (error) {
      console.error('Error retrieving user ID:', error);
    }
  };

  const handleNotification = () => {
    navigation.navigate("FriendRequest")
    console.log("notification button is pressed")
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ScrollView
      style={[styles.container, darkMode && styles.darkMode]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Account</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={darkMode ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleDarkMode}
          value={darkMode}
        />
      </View>
      <View style={styles.userInfoContainer}>
        <Image style={styles.profileImage} source={require('../../assets/images/profile.png')} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleMyPayables}>
          <Image style={styles.icon} source={require('../../assets/images/payable.png')} />
          <Text style={styles.buttonText}>My Payables</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleMyReceivables}>
          <Image style={styles.icon} source={require('../../assets/images/recieve.png')} />
          <Text style={styles.buttonText}>My Receivables</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPressOut={handleNotification}>
          <Image style={styles.icon} source={require('../../assets/images/notification.png')} />
          <Text style={styles.buttonText}>Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() =>navigation.navigate("PaymentConfirmation")}>
          <Image style={styles.icon} source={require('../../assets/images/p.png')} />
          <Text style={styles.buttonText}>Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ExpenseAlert")}>
          <Image style={styles.icon} source={require('../../assets/images/help.png')} />
          <Text style={styles.buttonText}>Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("Setting")}>
          <Image style={styles.icon} source={require('../../assets/images/setting1.png')} />
          <Text style={styles.buttonText}>Setting</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Image style={styles.icon} source={require('../../assets/images/log.png')} />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  darkMode: {
    backgroundColor: '#2c3e50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#3498db',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#ddd',
    // marginVertical: 10,
    padding: 5,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    marginLeft: 5,
  },
  userInfo: {
    marginLeft: 20,
    // marginTop: 10,
  },
  userName: {
    fontSize: 28,
  },
  userEmail: {
    fontSize: 20,
  },
  buttonsContainer: {
    // marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 7,
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  buttonText: {
    // fontSize: 20,
  },
});

export default Account;
