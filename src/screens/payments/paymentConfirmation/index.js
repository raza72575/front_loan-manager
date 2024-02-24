import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_SERVER_IP } from '../../../ip_address/ipconfig';

const PaymentConfirmation = () => {
  const [singleData, setSingleData] = useState([]);
  const [multipleData, setMultipleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expenseId, setExpenseId] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    fetchSinglePayConfirmation();
    fetchMultiplePayConfirmation();
    getExpenseId();
    getUserId();
  }, []);

  const fetchSinglePayConfirmation = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('userId:', userId);
      const apiUrl = `http://${API_SERVER_IP}/BackUpApi/api/SinglePayConfirmation/getSinglePayConfirmation?amountSentTo=${userId}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.length === 0) {
        console.log('No single payment notifications');
      } else {
        setSingleData(data);
        console.log('Single Payment Data:', singleData);
      }
    } catch (error) {
      console.log('Fetch Single Payment Error:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const fetchMultiplePayConfirmation = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const apiUrl = `http://${API_SERVER_IP}/BackUpApi/api/SinglePayConfirmation/getMultiplePayConfirmation?amountSentTo=${userId}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.length === 0) {
        console.log('No multiple payment notifications');
      } else {
        setMultipleData(data);
        console.log('Multiple Payment Data:', multipleData);
      }
    } catch (error) {
      console.log('Fetch Multiple Payment Error:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const getExpenseId = async () => {
    try {
      const expenseId = await AsyncStorage.getItem('expenseId');
      if (expenseId) {
        setExpenseId(expenseId);
      }
    } catch (error) {
      console.error('AsyncStorage Error:', error);
    }
  };

  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        setUserId(userId);
      }
    } catch (error) {
      console.error('AsyncStorage Error:', error);
    }
  };

  const handleConfirmSinglePayment = async (item) => {
    try {
      console.log('Confirm Single Payment:', item);
      
      // Get user ID from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      
      // Log necessary details for debugging
      console.log('userId:', userId);
      console.log('ExpenseId:', item.expenseId);
      console.log('PaidBy:', item.singlePaySendBy);
      console.log('Id:', item.Id);
      console.log('Amount:', item.Amount);
  
      // Make a PUT request to the API to update group expense details
      const response = await fetch(`http://${API_SERVER_IP}/BackUpApi/api/ConfrimPay/UpdateGroupExpenseDetail?expenseId=${item.expenseId}&paidBy=${item.singlePaySendBy}&id=${item.Id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Paid:item.Amount,
        }),
      });
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Failed to confirm single payment. Server response: ${response.status}`);
      }
  
      // Parse the response JSON
      const updatedGroupExpenseDetail = await response.json();
  
      // Log the updated group expense details for debugging
      console.log('Updated Group Expense Detail:', updatedGroupExpenseDetail);
  
      // Handle any additional logic or state updates as needed
  
      console.log('Single Payment Confirmed Successfully');
    } catch (error) {
      console.error('Confirm Single Payment Error:', error);
    }
  };
  

  const handleConfirmMultiplePayment = async (item) => {
    try {
      console.log('Confirm Single Payment:', item);
      
      // Get user ID from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      
      // Log necessary details for debugging
      console.log('userId:', userId);
      console.log('ExpenseId:', item.multipleExpenseId);
      console.log('PaidBy:', item.singlePaySendBy);
      console.log('Id:', item.Id);
      console.log('Amount:', item.multipleAmount);
  
      // Make a PUT request to the API to update group expense details
      const response = await fetch(`http://${API_SERVER_IP}/BackUpApi/api/ConfrimPay/UpdateMultipleExpenseDetail?expenseId=${item.multipleExpenseId}&paidBy=${item.multiplePaySendBy}&id=${item.Id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Paid:item.multipleAmount,
        }),
      });
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Failed to confirm multiple payment. Server response: ${response.status}`);
      }
  
      // Parse the response JSON
      const updatedGroupExpenseDetail = await response.json();
  
      // Log the updated group expense details for debugging
      console.log('Updated Group Expense Detail:', updatedGroupExpenseDetail);
  
      // Handle any additional logic or state updates as needed
  
      console.log('multiple Payment Confirmed Successfully');
    } catch (error) {
      console.error('Confirm Single Payment Error:', error);
    }
  };
  

  const renderSingleItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text>{item.singlePaySendByName} has sent you amount: {item.Amount}</Text>
      <TouchableOpacity style={styles.confirmButton} onPress={() => handleConfirmSinglePayment(item)}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
      <Text>sender id: {item.singlePaySendBy}</Text>
      <Text>{item.singlePayGetByName}</Text>
      <Text>{item.Status}</Text>
      <Text>{item.singlePayGetBy}</Text>
      <Text>expense id: {item.expenseId}</Text>
    </View>
  );

  const renderMultipleItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text>{item.multiplePaySendByName} has sent you amount: {item.multipleAmount}</Text>
      <TouchableOpacity style={styles.confirmButton} onPress={() => handleConfirmMultiplePayment(item)}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
      <Text>{item.multiplePayGetByName}</Text>
      <Text>{item.multipleStatus}</Text>
      <Text>{item.multiplePayGetBy}</Text>
      <Text>expense id: {item.multipleExpenseId}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={{fontSize:24,fontWeight:'bold'}}>Payments</Text>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          {/* <Text>Single Payment Confirmations:</Text> */}
          <FlatList
            data={singleData}
            renderItem={renderSingleItem}
            keyExtractor={(item) => item.Id.toString()}
            refreshing={refreshing}
            onRefresh={fetchSinglePayConfirmation}
          />
          {/* <Text>Multiple Payment Confirmations:</Text> */}
          <FlatList
            data={multipleData}
            renderItem={renderMultipleItem}
            keyExtractor={(item) => item.Id.toString()}
            refreshing={refreshing}
            onRefresh={fetchMultiplePayConfirmation}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  notificationItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentConfirmation;
