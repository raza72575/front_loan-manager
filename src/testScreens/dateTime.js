// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Platform,Button } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const DateTime = () => {
//   const [showStartDatePicker, setShowStartDatePicker] = useState(false);
//   const [showEndDatePicker, setShowEndDatePicker] = useState(false);
//   const [selectedStartDate, setSelectedStartDate] = useState(new Date());
//   const [selectedEndDate, setSelectedEndDate] = useState(new Date());

//   const handleStartDateChange = (event, date) => {
//     setShowStartDatePicker(Platform.OS === 'ios');
//     if (date) {
//       setSelectedStartDate(date);
//     }
//   };

//   const handleEndDateChange = (event, date) => {
//     setShowEndDatePicker(Platform.OS === 'ios');
//     if (date) {
//       setSelectedEndDate(date);
//     }
//   };
//   const [isLoggedIn, setLoggedIn] = useState(false);

//   // Function to toggle login status
//   const toggleLogin = () => {
//     setLoggedIn(!isLoggedIn);
//   };

//   return (
//     <View style={styles.container}>
//       <View>
//       <Text>{isLoggedIn ? ('Welcome back!') : ('please log in.')}</Text>

//       {isLoggedIn ? (
//         <Button title="Log out" onPress={toggleLogin} />
//       ) : (
//         <Button title="Log in" onPress={toggleLogin} />
//       )}
//     </View>
//       <Text style={styles.title}>Select Start and End Dates</Text>
//       <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.datePickerButton}>
//         <Text>Select Start Date: {selectedStartDate.toLocaleDateString()}</Text>
//       </TouchableOpacity>
//       {showStartDatePicker && (
//         <DateTimePicker
//           value={selectedStartDate}
//           mode="date"
//           is24Hour={true}
//           display="default"
//           onChange={handleStartDateChange}
//         />
//       )}
//       <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.datePickerButton}>
//         <Text>Select End Date: {selectedEndDate.toLocaleDateString()}</Text>
//       </TouchableOpacity>
//       {showEndDatePicker && (
//         <DateTimePicker
//           value={selectedEndDate}
//           mode="date"
//           is24Hour={true}
//           display="default"
//           onChange={handleEndDateChange}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   datePickerButton: {
//     padding: 16,
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
// });

// export default DateTime;
// =============================================
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const DateTime = () => {
  // State to track error status
  const [isError, setError] = useState(false);

  // Function to toggle error status
  const toggleError = () => {
    setError(!isError);
  };

  // Dynamic styles based on isError state
  const dynamicStyles = {
    container: {
      padding: 20,
      backgroundColor: isError ? 'red' : 'green',
    },
    text: {
      color: 'white',
      fontSize: 18,
    },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={dynamicStyles.text}>
        {isError ? 'Error occurred!' : 'No errors so far.'}
      </Text>

      <Button title="Toggle Error" onPress={toggleError} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DateTime;
