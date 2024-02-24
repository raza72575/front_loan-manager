import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  PermissionsAndroid,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Contacts from 'react-native-contacts';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const requestContactsPermission = async () => {
    try {
      const permission = PermissionsAndroid.PERMISSIONS.READ_CONTACTS;
      const granted = await PermissionsAndroid.request(permission);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        showSettingsAlert();
      }

      return false;
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
      return false;
    }
  };

  const showSettingsAlert = () => {
    alert(
      'You have denied permission to access contacts. Please go to app settings and enable contacts permission.',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Go to Settings', onPress: openSettings },
      ]
    );
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  const loadContacts = async () => {
    const permissionGranted = await requestContactsPermission();

    if (permissionGranted) {
      try {
        setLoading(true);
        const allContacts = await Contacts.getAll();
        setContacts(allContacts);
      } catch (error) {
        console.error('Error loading contacts:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.warn('Contacts permission not granted');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact List</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.recordID}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <View style={styles.nameContainer}>
              <Text style={styles.displayName}>{item.displayName}</Text>
            </View>
            <TouchableOpacity
              style={styles.sendRequestButton}
              onPress={() => {
                console.log("send reuest")
              }}
            >
              <Text style={styles.buttonText}>Send Request</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  nameContainer: {
    width: '50%',
  },
  displayName: {
    fontSize: 15,
  },
  sendRequestButton: {
    backgroundColor: '#4CAF50',
    width: '30%',
    borderRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ContactList;
