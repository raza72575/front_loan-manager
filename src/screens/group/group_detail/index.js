import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GroupDetail = ({ route, navigation }) => {
  const {
    groupName,
    groupDate,
    groupDescription,
    groupMembers,
  } = route.params;

  const [refreshing, setRefreshing] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const toggleMembers = () => {
    setShowMembers(!showMembers);
    if (!showMembers) {
      console.log('Group Members:', groupMembers);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setRefreshing(true);
      // Simulate fetching data from a server (replace with your actual data fetching logic)
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const renderMemberItem = ({ item }) => (
    <View style={styles.memberItem}>
      <Text style={styles.memberName}>{item.UserName}</Text>
    </View>
  );

  const handleAddMember = () => {
    navigation.navigate("AddMembers");
  };

  const handleAddExpense = () => {
    navigation.navigate("GroupExpense");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../../assets/images/goback1.png')} style={styles.buttonIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{groupName}</Text>
        <TouchableOpacity onPress={handleAddMember}>
          <Image source={require('../../../assets/images/af.png')} style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.groupInfo}>
        <Text style={styles.label}>Group Description:</Text>
        <Text style={styles.text}>{groupDescription}</Text>
      </View>
      <View style={styles.groupInfo}>
        <Text style={styles.label}>Group created:</Text>
        <Text style={styles.text}>{groupDate}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={toggleMembers}
        >
          <Text style={styles.buttonText}>{showMembers ? 'Hide Members' : 'Show Members'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ShowExpense")}
        >
          <Text style={styles.buttonText}>Show Expense</Text>
        </TouchableOpacity>
      </View>

      {showMembers && (
        <FlatList
          data={groupMembers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMemberItem}
          style={styles.memberList}
          maxToRenderPerBatch={5}
          initialNumToRender={5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                setTimeout(() => {
                  setRefreshing(false);
                }, 1000);
              }}
            />
          }
        />
      )}

      <TouchableOpacity
        style={styles.addExpenseButton}
        onPress={handleAddExpense}
      >
        <Text style={styles.buttonText}>Add Expense</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3E7EB0',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  buttonIcon: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  groupInfo: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#3E7EB0',
  },
  text: {
    color: '#666',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#3E7EB0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberList: {
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    marginTop: 16,
    maxHeight: 300,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  memberName: {
    fontSize: 16,
    marginLeft: 8,
  },
  addExpenseButton: {
    backgroundColor: '#3E7EB0',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default GroupDetail;
