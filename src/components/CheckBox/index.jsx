import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Checkbox = ({ label, isChecked, toggleCheckbox }) => {
  return (
    <TouchableOpacity onPress={toggleCheckbox}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 24,
            height: 24,
            borderWidth: 2,
            borderColor: 'black',
            marginRight: 10,
            backgroundColor: isChecked ? 'blue' : 'white', // Change the color based on isChecked state
          }}
        />
        <Text>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Checkbox;
