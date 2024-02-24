import React, { useState, useEffect, useCallback, useId } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_SERVER_IP } from '../../ip_address/ipconfig';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [isFriendListLoading, setIsFriendListLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState([]);
  const [filteredUserData, setFilteredUserData] = useState([]);
  const [searchText, setSearchText] = useState('');

  const fetchFriends = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userId');
      if (userToken) {
        setIsFriendListLoading(true);
        const response = await fetch(
          `http://${API_SERVER_IP}/FundsFriendlyApi/api/friends/friend?userId=${userToken}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          const friendNames = data.map((friend) => friend.Friendname);
          setFriends(friendNames);
        } else {
          console.log('Failed to fetch friends.');
        }
      }
    } catch (error) {
      console.error('An error occurred while fetching friends:', error);
    } finally {
      setIsFriendListLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAllUserData = async () => {
    try {
      const response = await fetch(
        `http://${API_SERVER_IP}/FundsFriendlyApi/api/Login/getUser`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setUserData(data);
        setModalVisible(true);
      } else {
        console.log('Failed to fetch user data.');
      }
    } catch (error) {
      console.error('An error occurred while fetching user data:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFriends();
  }, []);

  useEffect(() => {
    setRefreshing(true);
    fetchFriends();
  }, []);

  const isUserInFriendsList = (userId) => friends.includes(userId);

  const sendFriendRequest = async (receiverUserId) => {
    try {
      const senderUserId = await AsyncStorage.getItem('userId');
      const response = await fetch(`http://${API_SERVER_IP}/FundsFriendlyApi/api/MakeFriend/SendFriendRequest?senderUserId=${senderUserId}&receiverUserId=${receiverUserId}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
  
        console.log(senderUserId);
        console.log(receiverUserId);
  
        if (result) {
          if (result) {
            console.log("sent")
          } else {
            Alert.alert('Error', 'Failed to send friend request. Please try again.');
          }
        } else {
          Alert.alert('Error', 'Failed to send friend request. Please try again.');
        }
      } else {
        // Handle non-JSON responses here
        const text = await response.text();
        console.error('Non-JSON response:', text);
        Alert.alert('Error', 'Unexpected response from the server. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred while sending friend request:', error);
      Alert.alert('Error', 'Failed to send friend request. Please try again.');
    }
  };
  

  const renderFriendItem = ({ item }) => (
    <View style={styles.friendItem}>
      <Image source={require('../../assets/images/contacts.png')} style={styles.profileIcon} />
      <Text style={styles.friendName}>{item}</Text>
    </View>
  );

  const renderUserItem = ({ item }) => (
    <View style={styles.modalItem}>
      <View style={styles.userDataRow}>
        <Text style={styles.userName}>{item.Name}</Text>
        {/* <Text style={styles.userId}>{`ID: ${item.Id}`}</Text> */}
      {!isUserInFriendsList(item.Id) ? (
        <TouchableOpacity style={styles.sendRequestButton} onPress={() => sendFriendRequest(item.Id)}>
          <Text style={styles.sendRequestButtonText}>Send Request</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.sendRequestButtonText}>Request Sent</Text>
        )}
        </View>
    </View>
  );
  

  const searchUser = () => {
    const filteredData = userData.filter(
      (user) => user.Name && user.Name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredUserData(filteredData);
  };

  useEffect(() => {
    searchUser();
  }, [searchText]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Friends</Text>
        <Pressable  onPress={fetchAllUserData}>
          {/* <Text style={styles.addButtonText}>Add</Text> */}
          <Image source={require('../../assets/images/af.png')} style={styles.profileIcon} />
        </Pressable>
      </View>
      <FlatList
        data={friends}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={renderFriendItem}
      />

      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Send Request to make friend</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name"
            onChangeText={(text) => setSearchText(text)}
          />
          <FlatList
            data={filteredUserData.length > 0 ? filteredUserData : userData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderUserItem}
          />
          <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3E7EB0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  friendName: {
    fontSize: 18,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '80%',
    borderRadius:10,
    elevation:1,
    backgroundColor:'white'
  },
  modalItem: {
    marginVertical: 5,
  },
  userDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  userName: {
    fontSize: 18,
  },
  userId: {
    fontSize: 16,
    color: '#555',
  },
  sendRequestButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    elevation:10,
    borderWidth:1,
    // backgroundColor:'white'
  },
  sendRequestButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeModalButton: {
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width:'50%',
    
  },
  closeModalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Friends;
