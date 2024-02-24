import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_SERVER_IP } from '../../../ip_address/ipconfig';

const Receipt = () => {
  const [expenseId, setExpenseId] = useState(null);
  const [expenseDetail, setExpenseDetail] = useState([]);
  const [expenseDate, setExpenseDate] = useState('');
  const [expenseTotalAmount, setExpenseTotalAmount] = useState('');
  const [expenseName, setExpenseName] = useState('');

  const fetchGroupExpenseDetail = async () => {
    try {
      console.log("expenseId:", expenseId);
      const apiUrl = `http://${API_SERVER_IP}/FundsFriendlyApi/api/groupexpense/getgroupexpensedetail?groupExpenseId=${expenseId}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.length === 0) {
        console.log("No data found");
      } else {
        setExpenseDetail(data);
        setExpenseDate(data[0].ExpenseDate); // Assuming ExpenseDate is a property in your data
        setExpenseTotalAmount(data[0].ExpenseTotalAmount); // Assuming ExpenseTotalAmount is a property in your data
        setExpenseName(data[0].ExpenseName); // Assuming ExpenseName is a property in your data
      }
    } catch (error) {
      console.log("Error in getting group expense detail:", error);
    }
  };

  useEffect(() => {
    const fetchExpenseId = async () => {
      try {
        const storedExpenseId = await AsyncStorage.getItem('selectedExpenseId');
        setExpenseId(storedExpenseId);
      } catch (error) {
        console.error('Error retrieving expense ID:', error);
        // Handle the error as needed
      }
    };

    fetchExpenseId();
    fetchGroupExpenseDetail();
  }, [expenseId]);

  const renderMemberItem = ({ item }) => (
    
      <View style={styles.memberRow}>
        
      <Text style={styles.memberText}>{item.MemberName}</Text>
      <Text style={styles.toBePaidText}>{item.ToBePaid}</Text>
      <Text style={styles.paidText}>{item.Paid}</Text>
      <Text style={styles.remainingText}>{item.Remaining}</Text>
        </View>
      
  
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipt </Text>
      <View>
        
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Recipient</Text>
        <Text style={styles.headerText}>ToBePaid</Text>
        <Text style={styles.headerText}>Paid</Text>
        <Text style={styles.headerText}>Remaining</Text>
      </View>
      <FlatList
        data={expenseDetail}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMemberItem}
      />
      {expenseDate && (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Expense Name:   {expenseName}</Text>
          <Text style={styles.footerText}>Total Amount:  {expenseTotalAmount}</Text>
          <Text style={styles.footerText}>Expense Date:   {expenseDate.split('T')[0]}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    margin:20,
    borderWidth: 2,
    // borderColor: '#4CAF50',
    borderRadius: 10,
    // backgroundColor: '#E0F2F1',
    backgroundColor:'white',
    elevation:10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#4CAF50',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4CAF50',
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginBottom: 8,
    borderWidth: 1,
    // borderColor: '#4CAF50',
    borderRadius: 5,
    paddingVertical: 20,
    borderColor:'black'
    
    
  },
  memberText: {
    flex: 2,
    textAlign: 'center',
    borderRightWidth: 1,
    paddingRight: 8,
  },
  toBePaidText: {
    flex: 1,
    textAlign: 'center',
    borderRightWidth: 1,
    paddingRight: 8,
  },
  paidText: {
    flex: 1,
    textAlign: 'center',
    borderRightWidth: 1,
    paddingRight: 8,
  },
  remainingText: {
    flex: 1,
    textAlign: 'center',
    paddingRight: 8,
  },
  footerContainer: {
    // marginTop: 10,
    // alignSelf: 'center',
  },
  footerText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#8b0000',
    // marginVertical: 5,
  },
});

export default Receipt;
