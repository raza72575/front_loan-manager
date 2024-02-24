import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_SERVER_IP } from '../../../ip_address/ipconfig';

const SendRemainingAmount = ({ route }) => {
  const { item } = route.params;
  const [updateAmount, setUpdateAmount] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const createSinglePayConfirmation = async (userId, enteredAmount) => {
    const response = await fetch(`http://${API_SERVER_IP}/BackUpApi/api/SinglePayConfirmation/createSinglePayConfirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amountSendBy: userId,
        amountSentTo: item.MyId,
        amount: enteredAmount,
        status: 'pending',
        expenseId:item.Expense
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update amount. Server response: ${response.status}`);
    }

    return response.json();
  };

  const createMultiplePayConfirmation = async (userId, enteredAmount) => {
    const response = await fetch(`http://${API_SERVER_IP}/BackUpApi/api/SinglePayConfirmation/createMultiplePayConfirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        m_amountSendBy: userId,
        m_amountSentTo: item.mId,
        m_amount: enteredAmount,
        status: 'pending',
        expenseId:item.Expense
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update amount. Server response: ${response.status}`);
    }

    return response.json();
  };

  const handleUpdateAmount = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!updateAmount) {
        Alert.alert('Error', 'Please fill in the amount before sending.');
        return;
      }

      const remainingAmount = parseFloat(item?.AmountRemaining) || 0;
      const enteredAmount = parseFloat(updateAmount) || 0;

      if (enteredAmount > remainingAmount) {
        Alert.alert('Invalid Amount', 'Amount cannot be greater than the remaining amount.');
        return;
      }

      const apiCall = item.MyId ? createSinglePayConfirmation : createMultiplePayConfirmation;
      await apiCall(userId, enteredAmount);

      setSuccessMessage('Amount sent successfully!');
      setUpdateAmount('');
    } catch (error) {
      console.error('Update Error:', error);
      Alert.alert('Error', `An error occurred while updating amount: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Expense: {item?.ExpenseDetails?.ExpenseName || 'N/A'} To Pay: {item?.AmountRemaining || 'N/A'}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Send Remaining Amount </Text>
        <Text style={styles.cardText}>{`You have to pay ${item?.AmountRemaining || 'N/A'} to ${item?.MyName || 'N/A'}`}</Text>

        {item?.ExpenseDetails && (
          <>
            <Text style={styles.cardText}>{`Total Amount: ${item.ExpenseDetails.TotalExpenseAmount || 'N/A'}`}</Text>
            <Text style={styles.cardText}>{`Amount To Be Paid: ${item.AmountToBePaid}`}</Text>
            <Text style={styles.cardText}>{`Amount Paid: ${item.AmountPaid}`}</Text>
            <Text style={styles.cardText}>{`Amount Remaining: ${item.AmountRemaining}`}</Text>
            <Text style={styles.cardText}>{`Date: ${item.ExpenseDetails.ExpenseDate?.split('T')[0] || 'N/A'}`}</Text>
            <Text>Expense Id: {item.Expense} /{item.MyId}</Text>
          </>
        )}

        {/* Input for updating the amount */}
        <TextInput
          style={{ borderWidth: 0.3, borderRadius: 10, width: '70%', backgroundColor: 'white', marginTop: 16 }}
          placeholder="Enter Amount"
          keyboardType="numeric"
          value={updateAmount}
          onChangeText={(text) => setUpdateAmount(text)}
        />

        {/* Display the entered amount */}
        <Text>{`Update Amount: ${updateAmount}`}</Text>

        {/* Button to trigger the update */}
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateAmount}>
          <Text style={styles.updateButtonText}>Send Amount</Text>
        </TouchableOpacity>

        {/* Display success message */}
        {successMessage !== '' && <Text style={styles.successMessage}>{successMessage}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    elevation: 10,
    borderRadius: 8,
    padding: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successMessage: {
    fontSize: 18,
    color: 'green',
    marginTop: 8,
  },
});

export default SendRemainingAmount;
