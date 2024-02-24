import {StyleSheet} from 'react-native'
export const styles = StyleSheet.create({
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
      borderColor:'green',
      borderTopWidth:3.5,
      // borderRightWidth:1,
      borderWidth:1,
      width:'100%',
      alignSelf:'center'
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    cardText: {
      fontSize: 16,
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
    },
    addButton: {
      backgroundColor: '#3E7EB0',
      padding: 16,
      borderRadius: 8,
    },
    addButtonLabel: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  