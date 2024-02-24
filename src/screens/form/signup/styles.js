import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f2f2f2',
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    registrationContainer: {
      width: '80%',
      padding: 20,
      backgroundColor: '#ffffff',
      borderRadius: 10,
      elevation: 5,
    },
    registrationText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#333',
    },
    inputContainer: {
      marginBottom: 5,
    },
    inputLabel: {
      fontSize: 15,
      fontWeight: 'bold',
    },
    input: {
      height: 40,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: 8,
      marginBottom: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      color: '#333',
      borderWidth: 1,
    },
    registrationButton: {
      backgroundColor: '#007bff',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
    registrationButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    errorText: {
      color: 'red',
      marginBottom: 12,
      fontSize: 14,
    },
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    loginText: {
      fontSize: 16,
      marginRight: 5,
      color: '#666',
    },
    loginButton: {
      alignSelf: 'center',
    },
    loginButtonText: {
      color: '#007bff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  