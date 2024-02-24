import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const Tab = createMaterialBottomTabNavigator();
import MyGroup from '../group/showgroup';
import Friends from '../friends';
import Account from '../account';
import FriendRequest from '../notification/friendRequests';
import Practice from '../../testScreens/practice';
import ContactList from '../my_contactList';

const Dashboard = () => {
  return (
    <Tab.Navigator
    activeColor='blue'
    inactiveColor='black'
    barStyle={{
        borderTopWidth: 2,
        borderWidth: 1,
        backgroundColor: '#1122',
    }}
    initialRouteName="MyGroup"
    >
      <Tab.Screen
        name="MyGroup"
        component={MyGroup}
        options={{
          tabBarLabel: 'Groups',
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIcon}>
              <Image
                source={require('../../assets/images/groupIcon3.png')}
                style={{ width: 30, height: 30, borderRadius: 0 }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={Friends}
        options={{
          tabBarLabel: 'Friends',
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIcon}>
              <Image
                source={require('../../assets/images/contacts.png')}
                style={{ width: 30, height: 30, borderRadius: 0 }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="FriendRequest"
        component={FriendRequest}
        options={{
          tabBarLabel: 'Notification',
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIcon}>
              <Image
                source={require('../../assets/images/notification.png')}
                style={{ width: 30, height: 30, borderRadius: 0 }}
              />
            </View>
          ),
        }}
      />
      {/* <Tab.Screen
        name="Practice"
        component={Practice}
        options={{
          tabBarLabel: 'Practice',
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIcon}>
              <Image
                source={require('../../assets/images/fish.png')}
                style={{ width: 30, height: 30, borderRadius: 0 }}
              />
            </View>
          ),
        }}
      /> */}
      <Tab.Screen
        name="ContactList"
        component={ContactList}
        options={{
          tabBarLabel: 'Contacts',
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIcon}>
              <Image
                source={require('../../assets/images/contacts1.png')}
                style={{ width: 30, height: 30, borderRadius: 0 }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIcon}>
              <Image
                source={require('../../assets/images/member.png')}
                style={{ width: 30, height: 30, borderRadius: 0 }}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default Dashboard;

const styles = StyleSheet.create({
  tabIcon: {
    justifyContent: 'center',
    alignItems: 'center'
  },
});
