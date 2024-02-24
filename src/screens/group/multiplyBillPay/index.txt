import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_SERVER_IP} from '../../../ip_address/ipconfig';
import {InputField} from '../../../components/inputFiled';
import {RadioButton} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker'; // Import Picker

const MultiplyBillPay = ({navigation}) => {
  // State variables
  const [members, setMembers] = useState([]);
  const [groupId, setGroupId] = useState('');
  const [userId, setUserId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [totalExpenseAmount, setTotalExpenseAmount] = useState('');
  const [expenseType, setExpenseType] = useState('equal');
  const [memberToBePaid, setMemberToBePaid] = useState({});
  const [memberPaid, setMemberPaid] = useState({});
  const [remainingAmounts, setRemainingAmounts] = useState({});
  const [selectedMemberIds, setSelectedMemberIds] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch group information
  const fetchGroupInfo = async () => {
    try {
      const storedGroupId = await AsyncStorage.getItem('selectedGroupId');
      const storedUserId = await AsyncStorage.getItem('userId');
      setGroupId(storedGroupId);
      setUserId(storedUserId);

      const apiUrl = `http://${API_SERVER_IP}/FundsFriendlyApi/api/Group/onlyGroupMembers?gid=${storedGroupId}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.length === 0) {
        console.log('No members found.');
      } else {
        setMembers(data);

        const firstMember = data[0];
        setGroupName(firstMember.GroupName);

        const initialRemainingAmounts = {};
        data.forEach(member => {
          initialRemainingAmounts[member.UserId] = '0';
        });
        setRemainingAmounts(initialRemainingAmounts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect to fetch group information on component mount
  useEffect(() => {
    fetchGroupInfo();
  }, []);

  // useEffect to refetch group information on focus
  useFocusEffect(
    React.useCallback(() => {
      fetchGroupInfo();
    }, []),
  );

  // Handle change in total expense amount
  const handleExpenseAmountChange = amount => {
    setTotalExpenseAmount(amount);

    if (expenseType === 'equal') {
      const perMemberAmount = amount / members.length;
      const initialMemberToBePaid = {};
      const initialMemberPaid = {};
      members.forEach(member => {
        initialMemberToBePaid[member.UserId] = perMemberAmount.toFixed(2);
        initialMemberPaid[member.UserId] = '0';
      });
      setMemberToBePaid(initialMemberToBePaid);
      setMemberPaid(initialMemberPaid);
    }
  };

  // Handle change in amount to be paid by a member
  const handleMemberToBePaidChange = (memberId, amount) => {
    setMemberToBePaid(prevToBePaid => ({
      ...prevToBePaid,
      [memberId]: amount,
    }));
  };

  // Handle change in amount paid by a member
  // Handle change in amount paid by a member
  const handleMemberPaidChange = (memberId, amount) => {
    const toBePaidAmount = parseFloat(memberToBePaid[memberId]) || 0;

    if (parseFloat(amount) > toBePaidAmount) {
      // If paid amount is greater than to be paid amount, show an alert
      Alert.alert(
        'Invalid Amount',
        'Paid amount cannot be greater than the amount to be paid.',
      );
    } else {
      // Set the paid amount if it is valid
      setMemberPaid(prevPaid => ({
        ...prevPaid,
        [memberId]: amount,
      }));
    }
  };

  // Calculate remaining amounts after each change
  const calculateRemainingAmounts = () => {
    const updatedRemainingAmounts = {};
    members.forEach(member => {
      const toBePaidAmount = parseFloat(memberToBePaid[member.UserId]) || 0;
      const paidAmount = parseFloat(memberPaid[member.UserId]) || 0;

      const remainingAmount = toBePaidAmount - paidAmount;
      updatedRemainingAmounts[member.UserId] = remainingAmount.toFixed(2);
    });
    setRemainingAmounts(updatedRemainingAmounts);
  };

  // useEffect to recalculate remaining amounts on relevant changes
  useEffect(() => {
    calculateRemainingAmounts();
  }, [totalExpenseAmount, memberToBePaid, memberPaid]);

  // Fetch expense details based on expense name
  const fetchExpense = async expName => {
    try {
      const response = await fetch(
        `http://${API_SERVER_IP}/FundsFriendlyApi/api/GroupExpense/getExp?expName=${expName}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();

      if (
        Array.isArray(data) &&
        data.length > 0 &&
        data[0].expenseId !== undefined
      ) {
        // Store expenseId in AsyncStorage
        await AsyncStorage.setItem('expenseId', data[0].expenseId.toString());
      } else {
        console.log(
          'ExpenseId is undefined or not present in the data object.',
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Create group expense
  const createGroupExpense = async () => {
    setErrorMessage('');
    if (!expenseName || !totalExpenseAmount) {
      setErrorMessage('Both fields are required to be filled');
      setTimeout(() => setErrorMessage(''), 1000);
      return;
    }

    try {
      const currentDate = new Date();

      const response = await fetch(
        `http://${API_SERVER_IP}/FundsFriendlyApi/api/GroupExpense/createGroupExpense?`,
        {
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
            TotalPaidBy: await AsyncStorage.getItem('selectedMemberId'),
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setErrorMessage('Expense created successfully!');
        setExpenseName('');
        setTotalExpenseAmount('');
        setTimeout(() => setErrorMessage(''), 3000);

        // Fetch the expense details after creating the expense
        await fetchExpense(expenseName);
        // Create group expense details
        await handleCreateGroupExpenseDetails();
      } else {
        setErrorMessage('Expense Created .');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred while creating the expense.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Create group expense details
  const handleCreateGroupExpenseDetails = async () => {
    try {
      const storedExpenseId = await AsyncStorage.getItem('expenseId');

      if (storedExpenseId) {
        console.log('Retrieved Expense ID from AsyncStorage:', storedExpenseId);

        for (const member of members) {
          const expenseDetailData = {
            paidBy: parseFloat(member.UserId),
            toBePaid: parseFloat(memberToBePaid[member.UserId]) || 0,
            paid: parseFloat(memberPaid[member.UserId]) || 0,
            remainingAmount: parseFloat(remainingAmounts[member.UserId]),
            expenseId: storedExpenseId,
            otherPaidById: selectedMemberIds[member.UserId] || null, // Use selected member ID
          };

          const response = await fetch(
            `http://${API_SERVER_IP}/BackUpApi/api/MultipleExpenseDetail/createMultipleExpenseDetail`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(expenseDetailData),
            },
          );

          const detailData = await response.json();

          if (detailData.success) {
            console.log('Expense detail created successfully!');
          } else {
            console.log('expense created .');
          }
        }
      } else {
        console.log('Expense ID not found in AsyncStorage.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Utility function for delaying
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  // Handle button click (create group expense)
  const handleButtonClick = async () => {
    try {
      setErrorMessage('');

      if (!expenseName || !totalExpenseAmount) {
        Alert.alert('Fill the Fields First');
        return;
      }

      // Additional checks for preventing paid amount greater than remaining amount
      const exceededPaidAmount = Object.keys(remainingAmounts).find(
        key =>
          parseFloat(memberPaid[key] || 0) >
          parseFloat(remainingAmounts[key] || 0),
      );

      if (
        exceededPaidAmount !== undefined &&
        parseFloat(exceededPaidAmount) < 0
      ) {
        // Check if the exceededPaidAmount is defined and less than 0
        Alert.alert(
          'Invalid Amount',
          'Paid amount cannot be greater than the remaining amount or less than 0.',
        );
        return;
      }

      console.log('Creating group expense...');
      await createGroupExpense();
      console.log('Group expense created successfully!');

      // Fetch the group expense details after creating the group expense (if needed)
      console.log('Fetching expense details...');
      await fetchExpense(expenseName);
      console.log('Expense details fetched successfully!');

      // Create group expense details
      console.log('Creating group expense details...');
      await handleCreateGroupExpenseDetails();
      console.log('Group expense details created successfully!');
    } catch (error) {
      console.error('An error occurred:', error);
      setErrorMessage('An error occurred while creating the expense.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // JSX rendering
  return (
    <View>
      <View style={styles.headerView}>
        {groupName && (
          <Text style={styles.groupNameText}>Add Expense With {groupName}</Text>
        )}
      </View>
      <View style={styles.container}>
        <InputField
          label="Expense description"
          value={expenseName}
          onChangeText={setExpenseName}
        />
        <InputField
          label="Expense Amount"
          value={totalExpenseAmount}
          onChangeText={handleExpenseAmountChange}
          keyboardType="numeric"
        />
        <Text>Total Amount: {parseFloat(totalExpenseAmount).toFixed(0)}</Text>
        <View style={styles.radioButtonContainer}>
          <View style={styles.radioButtonItem}>
            <Text>Equal</Text>
            <RadioButton
              value="equal"
              status={expenseType === 'equal' ? 'checked' : 'unchecked'}
              onPress={() => setExpenseType('equal')}
            />
          </View>
          <View style={styles.radioButtonItem}>
            <Text>Unequal</Text>
            <RadioButton
              value="unequal"
              status={expenseType === 'unequal' ? 'checked' : 'unchecked'}
              onPress={() => setExpenseType('unequal')}
            />
          </View>
        </View>
        <View style={styles.heading}>
          <Text style={styles.headingText}>Members</Text>
          <Text style={styles.headingText}>To be Paid</Text>
          <Text style={styles.headingText}>Paid</Text>
          <Text style={styles.headingText}>Remaining</Text>
        </View>
        <FlatList
          style={styles.memberList}
          data={members}
          keyExtractor={item => item.UserId.toString()}
          renderItem={({item}) => (
            <View>
              <View style={styles.detail}>
                <View>
                  <Text style={styles.memberName}>{item.UserName}</Text>
                </View>

                <TextInput
                  style={styles.paymentInput}
                  keyboardType="numeric"
                  placeholder="0"
                  value={memberToBePaid[item.UserId]}
                  onChangeText={amount =>
                    handleMemberToBePaidChange(item.UserId, amount)
                  }
                  editable={
                    expenseType !== 'equal'
                  } /* Set editable prop conditionally */
                />
                <TextInput
                  style={styles.paymentInput}
                  keyboardType="numeric"
                  placeholder={`${memberPaid[item.UserId]}`}
                  value={memberPaid[item.UserId]}
                  onChangeText={amount =>
                    handleMemberPaidChange(item.UserId, amount)
                  }
                />
                <TextInput
                  style={styles.paymentInput}
                  keyboardType="numeric"
                  placeholder={`Remaining: ${
                    remainingAmounts[item.UserId] || 0
                  }`}
                  value={remainingAmounts[item.UserId] || 0}
                  editable={false}
                />
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  width: '50%',
                  alignSelf: 'baseline',
                  backgroundColor: 'green',
                }}>
               <Picker
  selectedValue={selectedMemberIds[item.UserId] || members[0].UserId.toString()} // Set default value to the UserId of the first member
  onValueChange={value => {
    setSelectedMemberIds(prevIds => ({
      ...prevIds,
      [item.UserId]: value,
    }));
  }}>
  <Picker.Item label="Select Member" value="" />
  {members.map(member => (
    <Picker.Item
      key={member.UserId.toString()}
      label={member.UserName}
      value={member.UserId.toString()}
    />
  ))}
</Picker>

              </View>
            </View>
          )}
        />

        <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
          <Text style={styles.buttonText}>Create Expense</Text>
        </TouchableOpacity>

        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    // borderWidth:1,
    // backgroundColor:'white',
    // elevation:50
  },
  headerView: {
    // borderWidth:.2,
    width: '100%',
    height: 60,
    backgroundColor: '#3E7EB0',

    // elevation:50,
    // borderRadius:10
  },
  groupNameText: {
    alignSelf: 'center',
    fontSize: 20,
    // marginBottom: 10,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 10,
  },
  radioButtonItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  headingText: {
    fontWeight: 'bold',
    // marginTop: '30%',
  },
  memberList: {
    borderWidth: 1,
    width: '100%',
    height: '50%',
    backgroundColor: 'white',
    elevation: 10,
    borderRadius: 10,
    // padding: 4,
  },
  paymentContainer: {
    borderWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
  },
  detail: {
    flexDirection: 'row',
    width: '65%',
    // marginRight: '2%',
    justifyContent: 'space-between',
  },
  memberName: {
    marginVertical: 10,
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  paymentInput: {
    height: '80%',
    width: '26%',
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
    borderRadius: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#8b0000',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    margin: 5,
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

export default MultiplyBillPay;
