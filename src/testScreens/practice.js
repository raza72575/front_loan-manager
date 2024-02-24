import React, { useState } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet } from 'react-native';
import { CustomButton } from '../components/customButton';

const Practice = () => {
  const [foods, setFoods] = useState([]);
  const [isListVisible, setIsListVisible] = useState(false);

  const fetchFoodList = () => {
    const updatedFoods = [
      {
        title: 'Fruits',
        data: [
          { name: 'Apple', id: 1 },
          { name: 'Banana', id: 2 },
          { name: 'Orange', id: 3 },
        ],
      },
      {
        title: 'Vegetables',
        data: [
          { name: 'Carrot', id: 4 },
          { name: 'Broccoli', id: 5 },
        ],
      },
    ];

    setFoods(updatedFoods);
    setIsListVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Button to fetch and display the food section list */}
      <CustomButton title='Show Food List' onPress={fetchFoodList} />

      {/* Conditional rendering of the food section list based on visibility */}
      {isListVisible && (
        <View style={styles.listContainer}>
          {/* SectionList example for foods */}
          <Text style={styles.sectionTitle}>Food Section List</Text>
          <SectionList
            sections={foods}
            keyExtractor={(item, index) => item.id.toString() + index}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => console.log(item.name, 'with id:', item.id, 'is pressed')}
              >
                <Text style={styles.listItem}>{item.name}</Text>
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3498db',
    flex: 1,
    padding: 20,
  },
  listContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: '#ecf0f1',
  },
  sectionHeader: {
    fontSize: 18,
    backgroundColor: '#e74c3c',
    color: '#ecf0f1',
    padding: 10,
  },
  listItem: {
    fontSize: 16,
    borderWidth: 2,
    margin: 10,
    borderRadius: 10,
    color: '#ecf0f1',
    borderColor: '#2c3e50',
    backgroundColor: '#e74c3c',
    paddingLeft: 10,
  },
});

export default Practice;
