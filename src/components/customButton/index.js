import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const CustomButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}  >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 4,
    borderWidth:1,
    elevation:10,
    width:"50%",
    borderRadius:10

  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
});


