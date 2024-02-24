import {StyleSheet} from 'react-native'
export const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: 'white',
    },
    headerView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#3E7EB0',
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: 'white',
    },
    friendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 20,
      borderWidth: 0.1,
      margin: 5,
      justifyContent:'flex-start'
      
    },
    profileIcon: {
      width: 50,
      height: 50,
  },
  });
  