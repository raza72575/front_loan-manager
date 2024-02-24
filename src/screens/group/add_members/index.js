import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { API_SERVER_IP } from '../../../ip_address/ipconfig';
import { CustomButton } from '../../../components/customButton';

const AddMembers = () => {
  const [groupId, setGroupId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const [noFriends, setNoFriends] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchUserAndGroupID = async () => {
    try {
      const groupId = await AsyncStorage.getItem('selectedGroupId');
      setGroupId(groupId);
      const userId = await AsyncStorage.getItem('userId');
      setUserId(userId);
      console.log("Logged in User ID is", userId, "and Group ID is", groupId);
    } catch (error) {
      console.error('Error while retrieving data from AsyncStorage:', error);
    }
  };

  const fetchFriends = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userId');
      if (userToken) {
        const response = await fetch(
          `http://${API_SERVER_IP}/FundsFriendlyApi/api/Friends/Friend?userId=${userToken}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          if (data.length === 0) {
            setNoFriends(true);
          } else {
            setNoFriends(false);
            setFriends(data);
          }
        } else {
          console.log('Failed to fetch friends.');
        }
      }
    } catch (error) {
      console.error('An error occurred while fetching friends:', error);
    }
  };

  const handleFriendSelection = (UserId1,UserId2 ) => {
    if (selectedFriends.includes(UserId1,UserId2)) {
      setSelectedFriends(selectedFriends.filter(id => id!==UserId1 && id!==UserId2));
      console.log(selectedFriends)
    } else {
      setSelectedFriends([...selectedFriends,UserId1,UserId2]);
      console.log(selectedFriends)

    }
  };

  const addSelectedFriendsToGroup = async () => {
    try {
      const token = await AsyncStorage.getItem('userId');

      const response = await fetch(
        `http://${API_SERVER_IP}/FundsFriendlyApi/api/AddGroupMember/Add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            groupId,
            members: selectedFriends,
          }),
        }
      );

      if (response.ok) {
        setSuccessMessage('Members added successfully');
        setSelectedFriends([]);
      } else {
        console.log('Failed to add group members.');
      }
    } catch (error) {
      console.error('An error occurred while adding group members:', error);
    }
  };

  useEffect(() => {
    fetchUserAndGroupID();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => fetchFriends()}
        >
          <Text style={styles.buttonText}>Friends</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => fetchFriends()}
        >
          <Text style={styles.buttonText}>Contacts</Text>
        </TouchableOpacity> */}
      </View>

      {noFriends ? (
        <Text>No friends yet added.</Text>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.FriendId.toString()}
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <Text style={{fontSize:24}}>{item.Friendname}</Text>
              <CheckBox
                value={selectedFriends.includes(item.UserId1,item.UserId2)}
                onValueChange={() => handleFriendSelection(item.UserId1,item.UserId2)}
              />
            </View>
          )}
        />
      )}
      
      <CustomButton
        title='Add Member'
        onPress={addSelectedFriendsToGroup}
        disabled={selectedFriends.length === 0}
      />
      
      {successMessage !== '' && (
        <Text style={styles.successMessage}>{successMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#8b0000',
    elevation: 10,
    marginHorizontal: 8,
    paddingVertical: 8,
    borderRadius:10,
    borderColor:'white'
  },
  buttonText: {
    fontSize: 24,
    color:'white'
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  successMessage: {
    color: 'green',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AddMembers;
