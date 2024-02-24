import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_SERVER_IP } from '../../../ip_address/ipconfig';

const UpdateExpenseDetail = ({ route, navigation }) => {
  const { expenseDetails } = route.params;
  const [groupMembers, setGroupMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [updateAmount, setUpdateAmount] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [multipleData, setMultipleData] = useState([]);

  useEffect(() => {
    // Fetch group information when the component mounts
    fetchMultipleData();
    fetchGroupInfo();
  }, []);

  const fetchMultipleData = async () => {
    try {
      const storedExpenseId = await AsyncStorage.getItem('selectedExpenseId');
      console.log("Fetching multiple data for expense ID:", storedExpenseId);

      const apiUrl = `http://${API_SERVER_IP}/BackUpApi/api/MultipleExpenseDetail/GetMultipleExpenseDetail?groupExpenseId=${storedExpenseId}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch group members');
      }

      const data = await response.json();

      if (data.length === 0) {
        console.log('No members found.');
      } else {
        // Update the state with the fetched group members
        setMultipleData(data);
        console.log("Multiple data:", multipleData);
      }
    } catch (error) {
      console.error("Fetch Multiple Data Error:", error);
      setError('An error occurred while fetching group members.');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupInfo = async () => {
    try {
      const storedGroupId = await AsyncStorage.getItem('selectedGroupId');
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);

      const apiUrl = `http://${API_SERVER_IP}/FundsFriendlyApi/api/Group/onlyGroupMembers?gid=${storedGroupId}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch group members');
      }

      const data = await response.json();

      if (data.length === 0) {
        console.log('No members found.');
      } else {
        // Update the state with the fetched group members
        setGroupMembers(data);
        console.log("Group members:", groupMembers);
      }
    } catch (error) {
      console.error("Fetch Group Info Error:", error);
      setError('An error occurred while fetching group members.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAmount = async () => {
    try {
      setRefreshing(true);

      const storedExpenseId = await AsyncStorage.getItem('selectedExpenseId');
      const paidBy = selectedExpense ? selectedExpense.PaidBy : userId;
      const apiUrl = `http://${API_SERVER_IP}/FundsFriendlyApi/api/UpdateGroupExpenseDetail/UpdateGroupExpenseDetail?expenseId=${encodeURIComponent(storedExpenseId)}&paidBy=${encodeURIComponent(paidBy)}`;

      console.log('API URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Paid: parseFloat(updateAmount),
        }),
      });

      console.log('PUT Response:', response);

      if (!response.ok) {
        throw new Error(`Failed to update expense details. Server response: ${response.status}`);
      }

      const updatedData = await response.json();
      setGroupMembers((prevGroupMembers) => {
        return prevGroupMembers.map((member) =>
          member.UserId === updatedData.UserId ? updatedData : member
        );
      });

      await fetchGroupInfo();

      setUpdateAmount('');
      setSelectedExpense(null);
    } catch (error) {
      console.error('Update Error:', error);
      setError(`An error occurred while updating expense details: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGroupInfo();
    setRefreshing(false);
  };

  const handleRowPress = (item) => {
    setSelectedExpense((prevSelectedExpense) =>
      prevSelectedExpense && prevSelectedExpense.ExpenseId === item.ExpenseId
        ? null
        : item
    );
  };

  const validateAmount = () => {
    const remainingAmount = selectedExpense.Remaining || 0;
    const enteredAmount = parseFloat(updateAmount) || 0;

    if (enteredAmount > remainingAmount) {
      Alert.alert('Invalid Amount', 'Amount cannot be greater than the remaining amount.');
      return false;
    }

    return true;
  };

  const renderTouchableRow = ({ item }) => {
    if (!item || !item.ExpenseId) {
      return null;
    }

    const member = groupMembers.find((m) => m.UserId === item.PaidBy);
    const remainingAmount = item.Remaining || 0;

    return (
      <TouchableOpacity key={item.ExpenseId} onPress={() => handleRowPress(item)}>
        <View style={styles.row}>
          <Text style={styles.rowText}>{member ? member.UserName : 'Unknown'}</Text>
          <Text style={styles.rowText}> {item.ToBePaid}</Text>
          <Text style={styles.rowText}>{item.Paid}</Text>
          <Text style={styles.rowText}>{remainingAmount}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMultipleData = ({ item }) => {
    return (
      <TouchableOpacity key={item.ExpenseId} onPress={() => handleRowPress(item)}>
        <View style={styles.row}>
          <Text style={styles.rowText}>{item.MemberName}</Text>
          <Text style={styles.rowText}> {item.ToBePaid}</Text>
          <Text style={styles.rowText}>{item.Paid}</Text>
          <Text style={styles.rowText}>{item.Remaining}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // ... (Previous code)

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Text style={styles.title}>Expense Details</Text>
        <TouchableOpacity style={styles.ReceiptButton} onPress={() => navigation.navigate("Receipt")}>
          <Text style={{ color: 'white', fontSize: 15 }}> Generate Receipt</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#8b0000" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Name</Text>
            <Text style={styles.headerText}>To be Paid</Text>
            <Text style={styles.headerText}>Paid</Text>
            <Text style={styles.headerText}>Remaining</Text>
          </View>
          
          {/* {multipleData.length > 0 ? (
            <FlatList
              data={multipleData}
              keyExtractor={(item) => item.Id}
              renderItem={renderMultipleData}
            />
          ) : (
            <Text style={styles.errorText}>No multiple data found.</Text>
          )} */}

          {expenseDetails.length > 0 && (
            <FlatList
              data={expenseDetails}
              keyExtractor={(item, index) =>
                item && item.ExpenseId ? item.ExpenseId.toString() + index : index.toString()
              }
              renderItem={renderTouchableRow}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
          )}

          {selectedExpense && (
            <>
              <TextInput
                style={styles.input}
                placeholder={`Enters Remaining Amount`}
                keyboardType="numeric"
                value={updateAmount}
                onChangeText={(text) => setUpdateAmount(text)}
              />
              <TouchableOpacity
                style={styles.updateButton}
                onPress={validateAmount() ? handleUpdateAmount : null}
              >
                <Text style={styles.updateButtonText}>Pay Remaining Amount</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </View>
  );
};

// ... (Remaining code)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  ReceiptButton: {
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#8b0000',
    elevation: 10,
    borderColor: 'white',
    elevation: 20,
    width: '40%',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  userIdText: {
    fontSize: 16,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    elevation: 10,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    width: '100%',
    marginBottom: 10,
  },
  rowText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 10,
  },
  updateButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  updateButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default UpdateExpenseDetail;
