import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    headerView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#3E7EB0',
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: 'white',
    },
    addGroupIcon: {
      width: 50,
      height: 50,
    },
    groupItem: {
      marginVertical: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    groupImgIcon: {
      width: 30,
      height: 30,
    },
    groupInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '83%',
    },
    groupName: {
      fontSize: 20,
      // fontWeight: 'bold',
      marginBottom: 8,
      marginLeft:17
    },
    groupDeleteIcon: {
      width: 20,
      height: 20,
      marginTop: 5,
      
    },
    noGroupContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noGroupImage: {
      width: 100,
      height: 100,
    },
    noGroupText: {
      fontSize: 18,
      marginBottom: 20,
    },
  });
  