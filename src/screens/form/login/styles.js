import {StyleSheet} from 'react-native'
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    card: {
      width: '80%',
      backgroundColor: 'white',
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
      borderWidth: 1,
      borderColor: 'lightgray',
    },
    title: {
      fontSize: 24,
      marginBottom: 16,
      textAlign: 'center',
    },
    loginButton: {
      backgroundColor: 'blue',
      borderRadius: 4,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop:15
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
    errorMessage: {
      color: 'red',
      marginBottom: 12,
      textAlign: 'center',
    },
    signupContainer: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    signupText: {
      color: 'blue',
      fontSize: 16,
    },
  });