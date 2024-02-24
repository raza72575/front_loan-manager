import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InputField } from '../../../components/inputFiled';
import { CustomButton } from '../../../components/customButton';
import { API_SERVER_IP } from '../../../ip_address/ipconfig';
import { styles } from './styles';

const CreateGroup = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Retrieve the user ID from AsyncStorage when the component mounts
    AsyncStorage.getItem('userId')
      .then((id) => {
        if (!id) {
          // Handle the case where user ID is not retrieved
          console.log('UserId not found');
        } else {
          setUserId(id);
          console.log(`Creating group for user ${userId}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleCreateGroup = () => {
    // Reset error message
    setErrorMessage('');

    // Check if any field is empty
    if (!groupName || !groupDescription) {
      setErrorMessage('Both fields are required to be filled.');
      setTimeout(() => setErrorMessage(''), 1000); // Clear error message after 1 second
      return;
    }

    // Check if the user ID is available
    if (!userId) {
      setErrorMessage('User ID not available. Please log in again.');
      setTimeout(() => setErrorMessage(''), 3000); // Clear error message after 3 seconds
      return;
    }

    // Start loading
    setIsLoading(true);

    // Capture the current date and time
    const currentDate = new Date();

    // Make an API request to create a new group
    fetch(`http://${API_SERVER_IP}/FundsFriendlyApi/api/Group/createNewGroup?`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupName,
        groupDescription,
        userId,
        groupDate: currentDate.toISOString(),  
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Stop loading
        setIsLoading(false);

        // Handle the response as needed
        console.log(data);

        if (data.success) {
          setErrorMessage('Group created successfully!');
          // Clear input fields
          setGroupName('');
          setGroupDescription('');
          setTimeout(() => setErrorMessage(''), 3000); // Clear success message after 3 seconds
        } else {
          setErrorMessage('Group Created Successfully.');
          setTimeout(() => setErrorMessage(''), 3000); // Clear error message after 3 seconds
          setGroupName('');
          setGroupDescription('');
        }
      })
      .catch((error) => {
        // Stop loading
        setIsLoading(false);

        console.error(error);
        setErrorMessage('An error occurred while creating the group.');
        setTimeout(() => setErrorMessage(''), 3000); // Clear error message after 3 seconds
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
      <Text style={styles.title}>Create Group</Text>
        <Image
        source={require('../../../assets/images/groupIcon1.png')} // Replace with your image source
        style={styles.groupImage}
      />
        <InputField label="Group Name" value={groupName} onChangeText={setGroupName} />
       
        <InputField label="Group Description" value={groupDescription} onChangeText={setGroupDescription} />
       
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
       <View style={{alignSelf:'center',margin:10}}>

        <CustomButton title="Create Group" onPress={handleCreateGroup} />
       </View>

        {isLoading && (
          <ActivityIndicator size="large" color="#007bff" style={styles.loadingIndicator} />
        )}

      </View>

      {/* Placeholder for an image */}
      
    </View>
  );
};



export default CreateGroup;
