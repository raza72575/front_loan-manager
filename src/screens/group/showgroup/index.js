import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomButton } from '../../../components/customButton';
import { styles } from './styles';
import { API_SERVER_IP } from '../../../ip_address/ipconfig';

const MyGroup = ({ navigation }) => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const storeGroupId = async (groupId) => {
    try {
      await AsyncStorage.setItem('selectedGroupId', groupId.toString());
      console.log('Group with id ', groupId, 'is stored');
    } catch (err) {
      console.error('Error storing group ID:', err.message || 'An error occurred');
    }
  };

  const fetchUserGroupData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const userId = await AsyncStorage.getItem('userId');

      const apiUrl = `http://${API_SERVER_IP}/FundsFriendlyApi/api/Group/GetGroupsForUser?userId=${userId}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.length === 0) {
        setError('No groups yet created');
      } else {
        setGroups(data);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchGroupDetails = async (groupId) => {
    try {
      const apiUrl = `http://${API_SERVER_IP}/FundsFriendlyApi/api/Group/GetMembers?gId=${groupId}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data) {
        const groupDetails = {
          groupId,
          groupName: data.GroupName,
          groupDescription: data.GroupDescription,
          groupDate: data.GroupDate,
          groupMembers: data.GroupMembers,
        };

        storeGroupId(groupId);
        console.log('Group ID ', groupId, 'is clicked navigating to the group details');
        console.log('_________________________________________________________');
        navigation.navigate('GroupDetail', groupDetails);
      }
    } catch (err) {
      console.error('Error fetching group details:', err.message || 'An error occurred');
    }
  };

  const handleDeletePress = (groupId, groupName) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete the group "${groupName}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => confirmDelete(groupId),
        },
      ],
      { cancelable: false }
    );
  };

  const confirmDelete = (groupId) => {
    // Update the state to remove the group
    setGroups((prevGroups) => prevGroups.filter((group) => group.GroupId !== groupId));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserGroupData();
    });

    return unsubscribe;
  }, [navigation, fetchUserGroupData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserGroupData();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Text style={styles.title}>My Groups</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateGroup')}>
          <Image source={require('../../../assets/images/Plusgreen.png')} style={styles.addGroupIcon} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : error ? (
        <View style={styles.noGroupContainer}>
          <Image source={require('../../../assets/images/groupIcon7.png')} style={styles.noGroupImage} />
          <Text style={styles.noGroupText}>{error}</Text>
          <CustomButton
            title='Create New Group'
            onPress={() => navigation.navigate('CreateGroup')}
          />
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.GroupId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.groupItem}
              onPress={() => fetchGroupDetails(item.GroupId)}
            >
              <Image source={require('../../../assets/images/groupIcon8.png')} style={styles.groupImgIcon} />
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{item.GroupName}</Text>
                <TouchableOpacity
                  onPress={() => handleDeletePress(item.GroupId, item.GroupName)}
                >
                  <Image source={require('../../../assets/images/a.png')} style={styles.groupDeleteIcon} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        />
      )}
    </View>
  );
}

export default MyGroup;
