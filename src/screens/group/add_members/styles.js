import {StyleSheet} from 'react-native'
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    friendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    addButton: {
      width: '50%',
      borderWidth: 2,
      alignItems: 'center',
      borderRadius: 15,
      backgroundColor: 'black',
      elevation: 10,
      borderColor: 'red',
    },
    addButtonText: {
      color: 'white',
    },
    successMessage: {
      color: 'green',
      fontSize: 16,
      textAlign: 'center',
    },
  });
  