import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

import WelcomeScreen from './src/screens/welcome';
import Login from './src/screens/form/login';
import Signup from './src/screens/form/signup';
import Dashboard from './src/screens/dashboard';
import CreateGroup from './src/screens/group/create_group';
import GroupDetail from './src/screens/group/group_detail';
import AddMembers from './src/screens/group/add_members';
import GroupExpense from './src/screens/group/group_expense';
import ShowExpense from './src/screens/group/show_expense';
import TestMember from './src/testScreens/testMember';
import UpdateExpenseDetail from './src/screens/group/updateGroupExpense';
import MyReceivables from './src/screens/payments/my_recieveables';
import MyPayable from './src/screens/payments/my_payable';
import MyCustomDropDown from './src/components/customDropdown/myCustomDropDown';
import SendRemainingAmount from './src/screens/payments/sendAmount';
import Receipt from './src/screens/payments/receipt';
import MultiplyBillPay from './src/screens/group/multiplyBillPay';
import ContactList from './src/screens/my_contactList';
import SplashScreen from './src/screens/splashScreen';
import PaymentConfirmation from './src/screens/payments/paymentConfirmation';
import ExpenseAlert from './src/screens/account/expeneAlert';
import Setting from './src/screens/account/setting/settingscreen';




const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup}/>
        <Stack.Screen name="Dashboard" component={Dashboard}/>
        <Stack.Screen name="CreateGroup" component={CreateGroup}/>
        <Stack.Screen name="GroupDetail" component={GroupDetail}/>
        <Stack.Screen name="AddMembers" component={AddMembers}/>
        <Stack.Screen name="GroupExpense" component={GroupExpense}/>
        <Stack.Screen name="ShowExpense" component={ShowExpense}/>
        <Stack.Screen name="TestMember" component={TestMember}/>
        <Stack.Screen name="UpdateExpenseDetail" component={UpdateExpenseDetail}/>
        <Stack.Screen name="MyReceivables" component={MyReceivables}/>
        <Stack.Screen name="MyPayable" component={MyPayable}/>
        <Stack.Screen name="MyCustomDropDown" component={MyCustomDropDown}/>
        <Stack.Screen name="SendRemainingAmount" component={SendRemainingAmount}/>
        <Stack.Screen name="Receipt" component={Receipt}/>
        <Stack.Screen name="MultiplyBillPay" component={MultiplyBillPay}/>
        <Stack.Screen name="ContactList" component={ContactList}/>
        <Stack.Screen name="SplashScreen" component={SplashScreen}/>
        <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmation}/>
        <Stack.Screen name="ExpenseAlert" component={ExpenseAlert}/>
        <Stack.Screen name="Setting" component={Setting}/>
















       


      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({});
