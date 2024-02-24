import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_SERVER_IP } from '../../../ip_address/ipconfig';

const ExpenseAlert = () => {
  const [singleData, setSingleData] = useState([]);
  const [multipleData, setMultipleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expenseId, setExpenseId] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    fetchSinglePayConfirmation();
    fetchMultiplePayConfirmation;
    getExpenseId();
    getUserId();
  }, []);

  const fetchSinglePayConfirmation = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('userId:', userId);
      const apiUrl = `http://${API_SERVER_IP}/BackUpApi/api/AlertExpense/GetSingleExpenseAlert?paidBy=${userId}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.length === 0) {
        console.warn('No single payment notifications');
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
      const apiUrl = `http://${API_SERVER_IP}/BackUpApi/api/MultipleAlertExpense/GetMultipleExpenseAlert?paidBy=${userId}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.length === 0) {
        console.warn('No multiple payment notifications');
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

  const handleApproveAndSendData = async (item) => {
    try {
      console.log('Confirm Single Payment:', item);
      
      const userId = await AsyncStorage.getItem('userId');
      
     
  
      const response = await fetch(`http://${API_SERVER_IP}/BackUpApi/api/AlertExpense/Approve?paidBy=${userId}&expenseId=${item.ExpenseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        
        }),
      });
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Failed to approve. Server response: ${response.status}`);
      }
  
      // Parse the response JSON
      const updatedGroupExpenseDetail = await response.json();
  
      // Log the updated group expense details for debugging
      console.log('Updated Group Expense Detail:', updatedGroupExpenseDetail);
  
      // Handle any additional logic or state updates as needed
  
      console.log('approved  Successfully');
    } catch (error) {
      console.error('approve Error:', error);
    }
    // ------------------------------------------------

    const responseSendData = await fetch(`http://${API_SERVER_IP}/BackUpApi/api/AlertExpense/createGroupExpenseDetail?expenseId=${item.ExpenseId}&paidBy=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expenseId:item.ExpenseId,
        paid:item.Paid,
        toBePaid:item.ToBePaid,
        paidBy:item.PaidBy,
        remainingAmount:item.Remaining,
        totalPaidBy:item.TotalPaidBy
      }),
    });

    if (!responseSendData.ok) {
      throw new Error(`Failed to update amount. Server response: ${responseSendData.status}`);
    }

    return responseSendData.json();
    
  };
  
  const sendData = async (item) => {


    const userId = await AsyncStorage.getItem('userId');
    const response = await fetch(`http://${API_SERVER_IP}/BackUpApi/api/AlertExpense/createGroupExpenseDetail?expenseId=${item.ExpenseId}&paidBy=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expenseId:item.ExpenseId,
        paid:item.Paid,
        toBePaid:item.ToBePaid,
        paidBy:item.PaidBy,
        remainingAmount:item.Remaining,
        totalPaidBy:item.TotalPaidBy
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update amount. Server response: ${response.status}`);
    }

    return response.json();
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
      <Text>New Expense: {item.ExpenseName} has been created  and you have to pay amount:{item.Remaining}</Text>
      {/* <Text>Expense Created By Id: {item.ExpenseCreatedById}</Text> */}
      <Text>Date:{item.ExpenseDate}</Text>
      {/* <Text>Status{item.status}</Text>
      <Text>Total Amount Paid By{item.TotalPaidByName}</Text>
      <Text>expense id: {item.ExpenseId}</Text> */}
      <View style={{flexDirection:'row', justifyContent:'space-around',width:'50%'}}>

      <TouchableOpacity style={styles.confirmButton} onPress={() => handleApproveAndSendData(item)}>
        <Text style={styles.confirmButtonText}>Approve</Text>
      </TouchableOpacity>
{/*       
      <TouchableOpacity style={styles.confirmButton} onPress={() => console.log("pressed")}>
        <Text style={styles.confirmButtonText}>reject</Text>
      </TouchableOpacity> */}
      </View>
      
    </View>
  );

  const renderMultipleItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text>New Expense: {item.m_ExpenseName} has been created  and you have to pay amount:{item.m_Remaining}</Text>
      {/* <Text>Expense Created By Id: {item.ExpenseCreatedById}</Text> */}
      <Text>Date:{item.m_ExpenseDate}</Text>
      {/* <Text>Status{item.status}</Text>
      <Text>Total Amount Paid By{item.TotalPaidByName}</Text>
      <Text>expense id: {item.ExpenseId}</Text> */}
      <View style={{flexDirection:'row', justifyContent:'space-around',width:'50%'}}>

      <TouchableOpacity style={styles.confirmButton} onPress={() => handleApproveAndSendData(item)}>
        <Text style={styles.confirmButtonText}>Approve</Text>
      </TouchableOpacity>
      
      {/* <TouchableOpacity style={styles.confirmButton} onPress={() => console.log("pressed")}>
        <Text style={styles.confirmButtonText}>reject</Text>
      </TouchableOpacity> */}
      </View>
      
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={{fontWeight:'bold',fontSize:24}}>Alerts</Text>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          
          <FlatList
            data={singleData}
            renderItem={renderSingleItem}
            keyExtractor={(item) => item.Id}
            refreshing={refreshing}
            onRefresh={fetchSinglePayConfirmation}
          />
        {/* <Text>Multiple</Text> */}
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

export default ExpenseAlert;
