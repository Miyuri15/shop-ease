import { StyleSheet, TextInput, Button, Text, Alert, View } from 'react-native';
import React, { useState } from 'react';
import { db } from '../config';
import { set ,ref, onValue } from 'firebase/database';

const RetrieveData = () => {
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(''); // State for item quantity
  const [brand, setBrand] = useState(''); // State for item brand
  const [discount, setDiscount] = useState('');
  const [promotion, setPromotion] = useState('');

  const dataAddOn = () => {
    const uniqueKey = `${itemName}_${brand}`;
  set(ref(db, 'promotions/' + uniqueKey), {
    itemName: itemName,
    discount: discount,
    promotion: promotion,
    brand: brand
  });
  setItemName('');
  setDiscount('');
  setPromotion('');
  setBrand('');
  }

  const fetchItemData = () => {

    // Generate a unique key for promotions and items based on itemName and brand
    const itemRef = ref(db, 'promotions/');
    onValue(itemRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const matchingItems = Object.keys(data).filter(key => {
          const item = data[key];
          return item.itemName === itemName && (brand === '' || item.brand === brand);
        });

        if (matchingItems.length > 0) {
          const item = data[matchingItems[0]]; // Get the first matching item
          setDiscount(item.discount);
          setPromotion(item.promotion);

          // Check stock only if itemQuantity is provided
          if (itemQuantity.trim() !== '') {
            checkItemStock();
          }
        } else {
          Alert.alert('Item not found', 'The entered item name and brand do not exist in the database.');
          setDiscount('');
          setPromotion('');
        }
      } else {
        Alert.alert('Error', 'Unable to retrieve data.');
      }
    });
  };

  const checkItemStock = () => {
    const itemStockRef = ref(db, 'items/');
    onValue(itemStockRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const matchingItems = Object.keys(data).filter(key => {
          const item = data[key];
          return item.itemName === itemName && (brand === '' || item.brand === brand);
        });

        if (matchingItems.length > 0) {
          const item = data[matchingItems[0]]; // Get the first matching item
          if (parseInt(itemQuantity) <= item.stock) {
            Alert.alert('Item available', 'The required quantity is available in stock.');
          } else {
            // If stock is insufficient for the specified brand, find alternatives
            findAlternativeBrands();
          }
        } else {
          // If specified brand not found, check for alternative brands
          findAlternativeBrands();
        }
      } else {
        Alert.alert('Item not found', 'This item is not available in stock.');
      }
    });
  };

  const findAlternativeBrands = () => {
    const allItemsRef = ref(db, 'items/');
    onValue(allItemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const availableBrands = Object.keys(data).filter(key => {
          const item = data[key];
          return item.itemName === itemName && parseInt(itemQuantity) <= item.stock;
        });

        if (availableBrands.length > 0) {
          const suggestedBrands = availableBrands.map(key => data[key].brand).join(', ');
          Alert.alert('Out of Stock', `The required quantity for the specified brand is not available. Items are available with the following brands: ${suggestedBrands}`);
        } else {
          Alert.alert('Out of Stock', 'The required quantity is not available for any brand.');
        }
      } else {
        Alert.alert('Item not found', 'This item is not available in stock.');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Retrieve Item Data</Text>
      <TextInput
        placeholder="Enter Item Name"
        value={itemName}
        onChangeText={(text) => setItemName(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter Item Brand (optional)"
        value={brand}
        onChangeText={(text) => setBrand(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter Item Quantity (optional)"
        value={itemQuantity}
        onChangeText={(text) => setItemQuantity(text)}
        style={styles.input}
        keyboardType="numeric" // Ensure numeric input
      />
      <Button title="Fetch Data" onPress={fetchItemData} />

      {discount ? (
        <View style={styles.result}>
          <Text>Discount: {discount}</Text>
          <Text>Promotion: {promotion}</Text>
        </View>
      ) : null}

<Text style={styles.header}>Realtime Db & Expo</Text>
      <TextInput
        placeholder="Item Name"
        value={itemName}
        onChangeText={(text) => setItemName(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Discount"
        value={discount}
        onChangeText={(text) => setDiscount(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Promotion"
        value={promotion}
        onChangeText={(text) => setPromotion(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Brand"
        value={brand}
        onChangeText={(text) => setBrand(text)}
        style={styles.input}
      />
      <Button title="Add Data" onPress={dataAddOn} />


    </View>
  );
};

export default RetrieveData;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    margin: 5,
    padding: 6,
    fontSize: 18,
    borderRadius: 6,
  },
  result: {
    marginTop: 20,
  },
});










