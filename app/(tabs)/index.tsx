import { StyleSheet, TextInput, Button, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../config';
import { ref, set, onValue } from 'firebase/database';

interface Post {
  id: string;
  itemName: string;
  stock: string;
  brand: string;
}

const AddData = () => {
  const [itemName, setItemName] = useState('');
  const [stock, setStock] = useState('');
  const [brand, setBrand] = useState('');
  const [todoData, setTodoData] = useState<Post[]>([]);

  const dataAddOn = () => {
    // Combine itemName and brand to create a unique key
    const uniqueKey = `${itemName}_${brand}`;

    set(ref(db, 'items/' + uniqueKey), {
      itemName: itemName,
      stock: stock,
      brand: brand
    });

    // Clear input fields
    setItemName('');
    setStock('');
    setBrand('');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Realtime Db & Expo</Text>
      <TextInput
        placeholder="Item Name"
        value={itemName}
        onChangeText={(text) => setItemName(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Stock"
        value={stock}
        onChangeText={(text) => setStock(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Brand"
        value={brand}
        onChangeText={(text) => setBrand(text)}
        style={styles.input}
      />
      <Button title="Add Data" onPress={dataAddOn} />

      {/* Data retrieve display (for check) */}
      {/* <Text style={styles.header}>Realtime Data fetching</Text> */}
      {/* {todoData.map((item) => (
        <View key={item.id}>
          <Text>{item.itemName}</Text>
          <Text>{item.stock}</Text>
          <Text>{item.brand}</Text>
        </View>
      ))} */}
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
  input: {
    borderWidth: 1,
    borderColor: 'black',
    margin: 10,
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
  },
});











