import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_SERVER_IP } from '../../../ip_address/ipconfig';

const ShowExpense = ({ navigation }) => {
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchGroupExpenses() {
      try {
        const selectedGroupId = await AsyncStorage.getItem('selectedGroupId');
        const response = await fetch(`http://${API_SERVER_IP}/FundsFriendlyApi/api/GroupExpense/GetGroupExpense?groupExpenseId=${selectedGroupId}`);
        const data = await response.json();

        if (typeof data === 'string' && data.includes("not yet created")) {
          setErrorMessage(data);
          setGroupExpenses([]);
        } else {
          setGroupExpenses(data);
          setErrorMessage('');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error while fetching group expenses:', error);
        setIsLoading(false);
      }
    }

    fetchGroupExpenses();
  }, []);

  const handleExpenseItemPress = async (expenseId) => {
    try {
      const response = await fetch(`http://${API_SERVER_IP}/FundsFriendlyApi/api/GroupExpense/GetGroupExpenseDetail?groupExpenseId=${expenseId}`);
      const data = await response.json();

      if (typeof data === 'string' && data.includes("not yet created")) {
        setErrorMessage(data);
      } else {
        await AsyncStorage.setItem('selectedExpenseId', expenseId.toString());
        const storedExpenseId = await AsyncStorage.getItem('selectedExpenseId');
        console.log('Stored ExpenseId:', storedExpenseId);

        navigation.navigate('UpdateExpenseDetail', { expenseDetails: data });
      }
    } catch (error) {
      console.error('Error while fetching expense details:', error);
    }
  };

  const renderExpenseItem = ({ item }) => {
    const expenseDate = new Date(item.expenseDate);
    const formattedDate = `${getDayOfWeek(expenseDate.getDay())}, ${expenseDate.toLocaleDateString()}`;

    return (
      <TouchableOpacity onPress={() => handleExpenseItemPress(item.expenseId)} style={styles.cardTouchable}>
        <View style={styles.card}>
          <Image source={require('../../../assets/images/groupIcon7.png')} style={styles.icon} />
          <Text style={styles.title}>{item.expenseName}</Text>
          <Text style={styles.amount}>Amount: {item.totalExpenseAmount}</Text>
          <Text style={styles.dateTimeText}>Expense Date: {formattedDate}</Text>
          <Text style={styles.dateTimeText}>{item.expenseId}</Text>

        </View>
      </TouchableOpacity>
    );
  };

  const getDayOfWeek = (dayIndex) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayIndex];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Group Expenses</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#8b0000" />
      ) : errorMessage && errorMessage.includes("not yet created") ? (
        <View style={styles.noExpenseContainer}>
          <Image source={require('../../../assets/images/expense.png')} style={styles.noExpenseImage} />
          <Text style={styles.noExpenseText}>{errorMessage}</Text>
          { /* Your button or any other UI element goes here */ }
        </View>
      ) : (
        groupExpenses.length > 0 ? (
          <FlatList
            data={groupExpenses}
            keyExtractor={(item, index) => (item.expenseId ? item.expenseId.toString() : index.toString())}
            renderItem={renderExpenseItem}
          />
        ) : (
          <View style={styles.noExpenseContainer}>
            <Image source={require('../../../assets/images/expense.png')} style={styles.noExpenseImage} />
            <Text style={styles.noExpenseText}>No expenses found for this group.</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddExpense")}>
              <Text style={styles.addButtonLabel}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </View>
  );
};

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
  card: {
    backgroundColor: 'white',
    elevation: 10,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderColor: 'green',
    borderTopWidth: 3.5,
    borderWidth: 1,
    width: '100%',
    alignSelf: 'center',
  },
  icon: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dateTimeText: {
    fontSize: 14,
  },
  noExpenseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noExpenseImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  noExpenseText: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#3E7EB0',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  addButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardTouchable: {
    marginBottom: 16,
  },
});

export default ShowExpense;
