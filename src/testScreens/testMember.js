// Importing necessary libraries and components
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_SERVER_IP } from '../ip_address/ipconfig';
import { InputField } from '../components/inputFiled';
import { RadioButton } from 'react-native-paper';

// Define the TestMember component
const TestMember = () => {
  // State variables to manage component state
  const [members, setMembers] = useState([]);
  const [groupId, setGroupId] = useState('');
  const [userId, setUserId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [totalExpenseAmount, setTotalExpenseAmount] = useState('');
  const [expenseType, setExpenseType] = useState('equal');
  const [memberPayments, setMemberPayments] = useState({});
  const [remainingAmounts, setRemainingAmounts] = useState({});
  const [perToBePaid, setPerToBePaid] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Function to fetch group information
  const fetchGroupInfo = async () => {
    try {
      // Retrieve stored group and user IDs from AsyncStorage
      const storedGroupId = await AsyncStorage.getItem('selectedGroupId');
      const storedUserId = await AsyncStorage.getItem('userId');
      setGroupId(storedGroupId);
      setUserId(storedUserId);

      // Fetch group members from the server using the group ID
      const apiUrl = `http://${API_SERVER_IP}/FundsFriendlyApi/api/Group/onlyGroupMembers?gid=${storedGroupId}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.length === 0) {
        console.log('No members found.');
      } else {
        // Update component state with fetched members
        setMembers(data);

        // Extract the group name from the first member
        const firstMember = data[0];
        setGroupName(firstMember.GroupName);

        // Initialize remaining amounts object with default values
        const initialRemainingAmounts = {};
        data.forEach((member) => {
          initialRemainingAmounts[member.UserId] = '0';
        });
        setRemainingAmounts(initialRemainingAmounts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch group information on component mount and focus
  useEffect(() => {
    fetchGroupInfo();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchGroupInfo();
    }, [])
  );

  // Handle total expense amount change
  const handleExpenseAmountChange = (amount) => {
    setTotalExpenseAmount(amount);

    // If equal expense type, calculate and set "to be paid" for each member
    if (expenseType === 'equal') {
      const perMemberAmount = amount / members.length;
      setPerToBePaid(perMemberAmount.toFixed(2));
      setMemberPayments((prevPayments) => {
        const updatedPayments = {};
        Object.keys(prevPayments).forEach((memberId) => {
          updatedPayments[memberId] = perMemberAmount.toFixed(2);
        });
        return updatedPayments;
      });
    }
  };

  // Handle member payment change
  const handleMemberPaymentChange = (memberId, amount) => {
    setMemberPayments((prevPayments) => ({
      ...prevPayments,
      [memberId]: amount,
    }));
  };

  // Calculate remaining amounts
  const calculateRemainingAmounts = () => {
    const updatedRemainingAmounts = {};
    members.forEach((member) => {
      const paidAmount = parseFloat(memberPayments[member.UserId]) || 0;
      const remainingAmount = (parseFloat(totalExpenseAmount) / members.length) - paidAmount;
      updatedRemainingAmounts[member.UserId] = remainingAmount.toFixed(2);
    });
    setRemainingAmounts(updatedRemainingAmounts);
  };

  // Update remaining amounts when total expense amount or member payments change
  useEffect(() => {
    calculateRemainingAmounts();
  }, [totalExpenseAmount, memberPayments]);

  // Handle expense creation
  const handleCreateExpense = () => {
    setErrorMessage('');
    if (!expenseName || !totalExpenseAmount) {
      setErrorMessage('Both fields are required to be filled');
      setTimeout(() => setErrorMessage(''), 1000);
      return;
    }

    const currentDate = new Date();

    // Call the API to create the expense
    fetch(`http://${API_SERVER_IP}/FundsFriendlyApi/api/GroupExpense/createGroupExpense?`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupId,
        expenseName,
        totalExpenseAmount,
        expenseDate: currentDate.toISOString(),
        createdByUserId: userId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setErrorMessage('Expense created successfully!');
          setExpenseName('');
          setTotalExpenseAmount('');
          setTimeout(() => setErrorMessage(''), 3000);

          // Fetch expense details using the entered expense name
          fetchExpenseInfo(expenseName);
        } else {
          setErrorMessage('Failed to create expense.');
          setTimeout(() => setErrorMessage(''), 3000);
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('An error occurred while creating the expense.');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  // Function to fetch expense information
  const fetchExpenseInfo = async (expName) => {
    try {
      // Call the API to get expense details using the entered expense name
      const apiUrl = `http://${API_SERVER_IP}/FundsFriendlyApi/api/GroupExpense/getExp?expName=${expName}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        // Assuming only one expense for simplicity, you might need to handle multiple expenses differently
        const expense = data[0];
        // Use the expense details as needed
        console.log('Expense Details:', expense);
        // TODO: Store or use the expense details as needed
      } else {
        console.log(`Expense with name: ${expName} not found.`);
        // TODO: Handle the case where the expense is not found
      }
    } catch (error) {
      console.error(error);
      // TODO: Handle errors
    }
  };

  // Handle creating group expense details
  const handleCreateGroupExpenseDetails = async () => {
    try {
      const currentDate = new Date();

      // Call the API to create the expense details for each member
      for (const member of members) {
        const expenseDetailData = {
          paidBy: parseInt(userId),
          toBePaid: parseFloat(perToBePaid),
          paid: parseFloat(memberPayments[member.UserId]) || 0,
          remainingAmount: parseFloat(remainingAmounts[member.UserId]),
          expenseId: 1, // Replace with the actual expense ID
          equal_unequal: expenseType === 'equal' ? 1 : 0,
        };

        const response = await fetch(`http://${API_SERVER_IP}/FundsFriendlyApi/api/GroupExpense/createGroupExpenseDetail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(expenseDetailData),
        });

        const data = await response.json();

        if (data.success) {
          console.log('Expense detail created successfully!');
        } else {
          console.log('Failed to create expense detail.');
        }
      }
    } catch (error) {
      console.error(error);
      // TODO: Handle errors
    }
  };



  // Return the JSX structure of the component
  return (
    <View style={styles.container}>
      {groupName && <Text style={{ alignSelf: 'center', fontSize: 18 }}>Add Expense With {groupName}</Text>}
      <InputField label="Expense description" value={expenseName} onChangeText={setExpenseName} />
      <InputField
        label="Expense Amount"
        value={totalExpenseAmount}
        onChangeText={handleExpenseAmountChange}
        keyboardType="numeric"
      />
      <Text>Total amount: {parseFloat(totalExpenseAmount).toFixed(2)}</Text>

      {/* Radio buttons for selecting expense type */}
      <View style={styles.radioButtonContainer}>
        <View style={styles.radioButtonItem}>
          <Text>Equal</Text>
          <RadioButton value="equal" status={expenseType === 'equal' ? 'checked' : 'unchecked'} onPress={() => setExpenseType('equal')} />
        </View>
        <View style={styles.radioButtonItem}>
          <Text>Unequal</Text>
          <RadioButton value="unequal" status={expenseType === 'unequal' ? 'checked' : 'unchecked'} onPress={() => setExpenseType('unequal')} />
        </View>
      </View>

      {/* List of members and their payment details */}
      <FlatList style={{
        borderWidth: 1, width: '100%', height: '40%', backgroundColor: 'white',
        elevation: 10, borderRadius: 10, padding: 5, alignContent: 'center'
      }} data={members}
        keyExtractor={(item) => item.UserId.toString()}
        renderItem={({ item }) => ( 
          <View >
            {expenseType==='equal' &&(
            <View style={{
              borderWidth: 0, flexDirection: 'row', justifyContent: 'space-between',
              width: '100%', height: 50,
            }}>
               <Text>{item.UserName}</Text>
               <TextInput
              style={styles.paymentInput}
              keyboardType="numeric"
              placeholder="0"
              value={perToBePaid}
              editable={false}
            />
            <TextInput
              style={styles.paymentInput}
              keyboardType="numeric"
              placeholder={`Paid: ${memberPayments[item.UserId]}`}
              value={memberPayments[item.UserId]}
              onChangeText={(amount) => handleMemberPaymentChange(item.UserId, amount)}
            />
            <TextInput
              style={styles.paymentInput}
              keyboardType="numeric"
              placeholder={`Remaining: ${remainingAmounts[item.UserId]}`}
              value={remainingAmounts[item.UserId]}
              editable={false}
            />
            </View>
            
            )}

            {expenseType==='unequal' && (
              <View style={{
                borderWidth: 0, flexDirection: 'row', justifyContent: 'space-between',
                width: '100%', height: 50,
              }}>
                 <Text>{item.UserName}</Text>
                 <TextInput
                style={styles.paymentInput}
                keyboardType="numeric"
                placeholder="0"
                value={perToBePaid}
                editable={true}
              />
              <TextInput
                style={styles.paymentInput}
                keyboardType="numeric"
                placeholder={`Paid: ${memberPayments[item.UserId]}`}
                value={memberPayments[item.UserId]}
                onChangeText={(amount) => handleMemberPaymentChange(item.UserId, amount)}
              />
              <TextInput
                style={styles.paymentInput}
                keyboardType="numeric"
                placeholder={`Remaining: ${remainingAmounts[item.UserId]}`}
                value={remainingAmounts[item.UserId]}
                editable={false}
              />
              </View>
            )}
        
            
           
            
          </View>

        )}
      />

      {/* Buttons to create expense and expense details */}
      <TouchableOpacity style={styles.button} onPress={handleCreateExpense}>
        <Text style={styles.buttonText}>Create Expense</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleCreateGroupExpenseDetails}>
        <Text style={styles.buttonText}>Create Expense Details</Text>
      </TouchableOpacity>

      {/* Display error message if any */}
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
    </View>
  );
};

// Styles for the TestMember component
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  memberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#eee',
    borderWidth: 1
  },
  memberText: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioButtonItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentInput: {
    // flex: 1,
    height: '80%',
    width: '20%',
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
    // paddingHorizontal: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#8b0000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 10,
    elevation: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
});

// Export the TestMember component as the default export
export default TestMember;
