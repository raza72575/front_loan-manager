import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_SERVER_IP } from '../ip_address/ipconfig';

const UserGroup = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const storeGroupId = async (groupId) => {
    try {
      // Storing the selected group id
      await AsyncStorage.setItem('selectedGroupId', groupId.toString());
    } catch (error) {
      console.log('Error in storing selected Group Id: ', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log(userId)
      const apiUrl = `http://${API_SERVER_IP}/FundsFriendlyApi/api/Group/getGroupsforuser?userId=${userId}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.length === 0) {
        console.warn('No groups yet created');
      } else {
        setGroups(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchGroups();
  };

  useEffect(() => {
    fetchGroups();
    setRefreshing(true)
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Groups</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.GroupId}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                storeGroupId(item.GroupId);
                console.log('Group pressed:', '(',item.GroupName, ')',   'with group Id',item.GroupId);
              }}
              style={styles.groupItem}
            >
              <Text style={styles.groupText}>{item.GroupName}</Text>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#0000ff']}
            />
          }
        />
      )}
    </View>
  );
};

export default UserGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  groupItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  groupText: {
    fontSize: 16,
  },
});
