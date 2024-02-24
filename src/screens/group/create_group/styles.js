import {StyleSheet} from 'react-native'
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#f0f0f0',
    },
    title: {
      fontSize: 24,
      marginBottom: 16,
      fontWeight: 'bold',
    },
    formContainer: {
      width: '100%',
      // backgroundColor: 'white',
      padding: 16,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3.84,
      elevation: 5,
    },
    loadingIndicator: {
      marginTop: 20,
    },
    errorMessage: {
      color: 'red',
      marginBottom: 12,
      textAlign: 'center',
    },
    groupImage: {
      width: "auto", // Set your image width
      height: 250, // Set your image height
      marginTop: 10,
    },
  });