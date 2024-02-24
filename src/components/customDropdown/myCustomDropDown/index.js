import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_SERVER_IP } from '../../../ip_address/ipconfig';

const MyCustomDropDown = () => {
  // State variables
  const [selectedMember, setSelectedMember] = useState('Select Member');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const [userId, setUserId] = useState(null);

  // Fetch group members when the component mounts
  useEffect(() => {
    fetchGroupMembers();
  }, []);

  // Function to fetch group members
  const fetchGroupMembers = async () => {
    try {
      // Retrieve stored group ID and user ID from AsyncStorage
      const storedGroupId = await AsyncStorage.getItem('selectedGroupId');
      const storedUserId = await AsyncStorage.getItem('userId');
      
      // Set group ID and user ID in state
      setGroupId(storedGroupId);
      setUserId(storedUserId);

      // Check if group ID and user ID are available
      if (storedGroupId && storedUserId) {
        // Construct API URL to fetch group members
        const apiUrl = `http://${API_SERVER_IP}/FundsFriendlyApi/api/Group/onlyGroupMembers?gId=${storedGroupId}`;
        
        // Fetch group members
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // Set group members in state
        setGroupMembers(data);
      }
    } catch (error) {
      console.error('Error fetching group members:', error);
    }
  };

  // Function to handle dropdown press
  const handleDropdownPress = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  // Function to handle member selection
  const handleMemberSelect = async (member) => {
    // Update selected member in state
    setSelectedMember(member.UserName); // Assuming UserName is the property you want to display
    
    // Log selected member ID to the console
    console.log(`Selected Member ID: ${member.UserId}`);
    
    // Hide the dropdown
    setIsDropdownVisible(false);
  
    // Store the selected member's ID in AsyncStorage for future use
    try {
      await AsyncStorage.setItem('selectedMemberId', member.UserId.toString());
      console.log(`Selected Member ID stored in AsyncStorage: ${member.UserId}`);
    } catch (error) {
      console.error('Error storing selected member ID:', error);
    }
  };

  // Render the component
  return (
    <View style={styles.container}>
      {/* Dropdown selector */}
      <TouchableOpacity style={styles.dropDownSelector} onPress={handleDropdownPress}>
        <Text style={styles.headingText}>{selectedMember}</Text>
      </TouchableOpacity>

      {/* Dropdown area */}
      {isDropdownVisible && (
        <View style={styles.dropDownArea}>
          {/* FlatList to display group members */}
          <FlatList
            data={groupMembers}
            keyExtractor={(item) => item.UserId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleMemberSelect(item)}>
                <Text style={styles.dropdownItem}>{item.UserName}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headingText: {
    fontSize: 20,
    marginTop: 5,
    alignSelf: 'center',
  },
  dropDownSelector: {
    width: '130%',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: 'center',
  },
  dropDownArea: {
    width: '100%',
    position: 'absolute',
    top: 50, // Adjust the top position based on your UI
    backgroundColor: 'white',
    elevation: 10,
    borderRadius: 5,
    height:75,
    marginRight:50
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});

// Export the component
export default MyCustomDropDown;
