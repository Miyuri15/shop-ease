import { StyleSheet, TextInput, Button, Text, View } from 'react-native';
import React from 'react';
// import { db } from '../config';
// import { ref, set, onValue } from 'firebase/database';


const AddData = () => {


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add to cart</Text>

    </View>
  );
};

export default AddData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
});











