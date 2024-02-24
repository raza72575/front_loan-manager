import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { API_SERVER_IP } from '../../../ip_address/ipconfig';

const MyReceivables = ({ route }) => {
  // Destructure userId from route params
  const { userId } = route.params;

  // States to store data and manage loading and refreshing states
  const [singleData, setSingleData] = useState([]);
  const [multipleData, setMultipleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to fetch data from the API
  const fetchData = useCallback(async () => {
    try {
      // Fetch data for single expenses from the first API endpoint
      const singleResponse = await fetch(`http://${API_SERVER_IP}/FundsFriendlyApi/api/Payment/MyyReceivables?id=${userId}`);
      
      // Parse the JSON response
      const singleResult = await singleResponse.json();
  
      // Update the state with the fetched single data
      setSingleData(singleResult);
    } catch (error) {
      // Handle errors that might occur during fetching single data
      console.error('Error fetching single data:', error);
    }
  
    try {
      // Fetch data for multiple expenses from the second API endpoint
      const multipleResponse = await fetch(`http://${API_SERVER_IP}/BackUpApi/api/MultiplePayableRecieveable/MyReceivables?id=${userId}`);
      
      // Parse the JSON response
      const multipleResult = await multipleResponse.json();
  
      // Update the state with the fetched multiple data
      setMultipleData(multipleResult);
    } catch (error) {
      // Handle errors that might occur during fetching multiple data
      console.error('Error fetching multiple data:', error);
    } finally {
      // Set loading and refreshing states to false after data is fetched
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userId]);
  

  // UseEffect to fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to handle pull-to-refresh
  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  // Function to render a single item
  const renderSingleItem = ({ item, index }) => (
    <View style={styles.listItem} key={index}>
      {/* Display relevant data for single item */}
      <Text style={styles.itemTitle}>{`Payment Due from ${item.HeHasToPayName ? item.HeHasToPayName.PayyerName || 'N/A' : 'N/A'}`}</Text>
      <Text style={styles.itemText}>{`Amount: ${item.AmountRemaining}`}</Text>
      <Text style={styles.itemText}>{`Expense Name: ${item.ExpenseName}`}</Text>
      <Text style={styles.itemText}>{`Id: ${item.HeHasToPay}`}</Text>

      {/* Button to trigger notification */}
      <TouchableOpacity style={styles.notifyButton} onPress={() => handleNotifySingle(item)}>
        <Text style={styles.buttonText}>Notify</Text>
      </TouchableOpacity>
    </View>
  );

  // Function to render a multiple item
  const renderMultipleItem = ({ item, index }) => (
    <View style={styles.listItem} key={index}>
      {/* Display relevant data for multiple item */}
      <Text style={styles.itemTitle}>{`Payment Due from ${item.HeHasToPayName || 'N/A'}`}</Text>
      <Text style={styles.itemText}>{`Amount: ${item.AmountRemaining}`}</Text>
      <Text style={styles.itemText}>{`Expense Name: ${item.ExpenseName}`}</Text>
      <Text style={styles.itemText}>{`Other Id: ${item.OtherId}`}</Text>

      {/* Button to trigger notification */}
      <TouchableOpacity style={styles.notifyButton} onPress={() => handleNotifyMultiple(item)}>
        <Text style={styles.buttonText}>Notify</Text>
      </TouchableOpacity>
    </View>
  );

  // Function to handle single expense notification
  const handleNotifySingle = async (item) => {
    try {
      // Check if the notification has already been sent
      if (item.NotificationSent) {
        console.log('Notification already sent for single expenses:', item);
        Alert.alert('Notification already Sent', 'Single expenses notification has already been sent.');
        return;
      }

      // Extract the first element of the ExpenseName array
      const expenseName = item.ExpenseName && item.ExpenseName.length > 0 ? item.ExpenseName[0] : 'N/A';

      // Call the API to send single expense notification
      console.log('Notify Single:', item);
      const response = await fetch(`http://${API_SERVER_IP}/BackUpApi/api/PaymentNotifications/sendSingleExpenseNotification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notifierId: userId,
          notifyId: item.HeHasToPay,
          amount: item.AmountRemaining,
          expenseName: expenseName,
        }),
      });

      const result = await response.json();
      console.log('Result:', result);

      // Check if the API call was successful
      if (response.ok) {
        // Alert when notification is sent
        Alert.alert('Notification Sent', 'Single expenses notification has been sent successfully.');
      } else {
        // Alert when there is an issue with the API call
        console.error('Error sending single expenses notification:', result);
        Alert.alert('Error', 'There was an issue sending the single expenses notification.');
      }
    } catch (error) {
      console.error('Error notifying single expenses:', error);
      Alert.alert('Error', 'An unexpected error occurred while sending the single expenses notification.');
    }
  };

  // Function to handle multiple expense notification
  const handleNotifyMultiple = async (item) => {
    try {
      // Check if the notification has already been sent
      if (item.NotificationSent) {
        console.log('Notification already sent for multiple expenses:', item);
        Alert.alert('Notification already Sent', 'Multiple expenses notification has already been sent.');
        return;
      }

      // Call the API to send multiple expense notification
      console.log('Notify Multiple:', item);
      const response = await fetch(`http://${API_SERVER_IP}/BackUpApi/api/PaymentNotifications/sendMultipleExpenseNotification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notifierId: userId,
          notifyId: item.OtherId,
          amount: item.AmountRemaining,
          expenseName: item.ExpenseName,
        }),
      });

      const result = await response.json();
      console.log('Result:', result);

      // Check if the API call was successful
      if (response.ok) {
        // Alert when notification is sent
        Alert.alert('Notification Sent', 'Multiple expenses notification has been sent successfully.');
      } else {
        // Alert when there is an issue with the API call
        console.error('Error sending multiple expenses notification:', result);
        Alert.alert('Error', 'There was an issue sending the multiple expenses notification.');
      }
    } catch (error) {
      console.error('Error notifying multiple expenses:', error);
      Alert.alert('Error', 'An unexpected error occurred while sending the multiple expenses notification.');
    }
  };

  // Main component rendering
  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Receivables</Text>
      {isLoading ? (
        // Display loading indicator while data is being fetched
        <ActivityIndicator size="large" color="#8b0000" />
      ) : (
        <>
          {/* Display a single FlatList for both single and multiple data */}
          <FlatList
            data={[...singleData, ...multipleData]}
            keyExtractor={(item, index) => `combined-${index}`}
            renderItem={({ item, index }) => (
              // Render items based on type (single or multiple)
              item.OtherId ? renderMultipleItem({ item, index }) : renderSingleItem({ item, index })
            )}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          />
        </>
      )}
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listItem: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 12,
  },
  notifyButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

// Export the component as the default export
export default MyReceivables;
