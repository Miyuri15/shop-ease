import { StyleSheet, TextInput, Button, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../config';
import { ref, set, onValue } from 'firebase/database';

interface Post {
  id: string;
  itemName: string;
  stock: string;
  brand: string;
  weight: string;
}

const AddData = () => {
  const [itemName, setItemName] = useState('');
  const [stock, setStock] = useState('');
  const [brand, setBrand] = useState('');
  const [weight, setWeight] = useState('');
  const [todoData, setTodoData] = useState<Post[]>([]);

  const hardcodedData = [
    { "itemName": "Carrots", "brand": "Fresh Picks", "stock": "150", "weight": "500 g" },
    { "itemName": "Carrots", "brand": "Organic Harvest", "stock": "200", "weight": "500 g" },
    { "itemName": "Carrots", "brand": "Farm Fresh", "stock": "180", "weight": "500 g" },
    { "itemName": "Tomatoes", "brand": "Fresh Picks", "stock": "100", "weight": "1 kg" },
    { "itemName": "Tomatoes", "brand": "Nature’s Best", "stock": "120", "weight": "1 kg" },
    { "itemName": "Tomatoes", "brand": "Green Valley", "stock": "150", "weight": "1 kg" },
    { "itemName": "Spinach", "brand": "Organic Harvest", "stock": "80", "weight": "200 g" },
    { "itemName": "Spinach", "brand": "Farm Fresh", "stock": "60", "weight": "200 g" },
    { "itemName": "Spinach", "brand": "Green Valley", "stock": "90", "weight": "200 g" },
    { "itemName": "Potatoes", "brand": "Fresh Picks", "stock": "70", "weight": "1 kg" },
    { "itemName": "Potatoes", "brand": "Farm Fresh", "stock": "65", "weight": "1 kg" },
    { "itemName": "Potatoes", "brand": "Organic Harvest", "stock": "85", "weight": "1 kg" },
    { "itemName": "Bell Peppers", "brand": "Green Valley", "stock": "110", "weight": "500 g" },
    { "itemName": "Bell Peppers", "brand": "Fresh Picks", "stock": "95", "weight": "500 g" },
    { "itemName": "Bell Peppers", "brand": "Organic Harvest", "stock": "120", "weight": "500 g" },
    { "itemName": "Apples", "brand": "Fresh Picks", "stock": "150", "weight": "1 kg" },
    { "itemName": "Apples", "brand": "Organic Harvest", "stock": "200", "weight": "1 kg" },
    { "itemName": "Apples", "brand": "Farm Fresh", "stock": "180", "weight": "1 kg" },
    { "itemName": "Oranges", "brand": "Fresh Picks", "stock": "100", "weight": "1 kg" },
    { "itemName": "Oranges", "brand": "Nature’s Best", "stock": "120", "weight": "1 kg" },
    { "itemName": "Oranges", "brand": "Green Valley", "stock": "150", "weight": "1 kg" },
    { "itemName": "Bananas", "brand": "Organic Harvest", "stock": "80", "weight": "1 kg" },
    { "itemName": "Bananas", "brand": "Farm Fresh", "stock": "60", "weight": "1 kg" },
    { "itemName": "Bananas", "brand": "Green Valley", "stock": "90", "weight": "1 kg" },
    { "itemName": "Mangoes", "brand": "Fresh Picks", "stock": "70", "weight": "1 kg" },
    { "itemName": "Mangoes", "brand": "Farm Fresh", "stock": "65", "weight": "1 kg" },
    { "itemName": "Mangoes", "brand": "Organic Harvest", "stock": "85", "weight": "1 kg" },
    { "itemName": "Grapes", "brand": "Green Valley", "stock": "110", "weight": "500 g" },
    { "itemName": "Grapes", "brand": "Fresh Picks", "stock": "95", "weight": "500 g" },
    { "itemName": "Grapes", "brand": "Organic Harvest", "stock": "120", "weight": "500 g" },
    { "itemName": "Chicken Breast", "brand": "Keells", "stock": "120", "weight": "1 kg" },
    { "itemName": "Chicken Breast", "brand": "Cargills", "stock": "150", "weight": "1 kg" },
    { "itemName": "Chicken Breast", "brand": "Laugfs", "stock": "100", "weight": "1 kg" },
    { "itemName": "Beef Steak", "brand": "Keells", "stock": "80", "weight": "500 g" },
    { "itemName": "Beef Steak", "brand": "Cargills", "stock": "100", "weight": "500 g" },
    { "itemName": "Beef Steak", "brand": "Laugfs", "stock": "70", "weight": "500 g" },
    { "itemName": "Pork Chops", "brand": "Keells", "stock": "60", "weight": "1 kg" },
    { "itemName": "Pork Chops", "brand": "Cargills", "stock": "90", "weight": "1 kg" },
    { "itemName": "Pork Chops", "brand": "Laugfs", "stock": "80", "weight": "1 kg" },
    { "itemName": "Mutton", "brand": "Keells", "stock": "50", "weight": "1 kg" },
    { "itemName": "Mutton", "brand": "Cargills", "stock": "70", "weight": "1 kg" },
    { "itemName": "Mutton", "brand": "Laugfs", "stock": "60", "weight": "1 kg" },
    { "itemName": "Turkey Breast", "brand": "Keells", "stock": "40", "weight": "1 kg" },
    { "itemName": "Turkey Breast", "brand": "Cargills", "stock": "30", "weight": "1 kg" },
    { "itemName": "Turkey Breast", "brand": "Laugfs", "stock": "35", "weight": "1 kg" },
    { "itemName": "Salmon", "brand": "Keells", "stock": "90", "weight": "500 g" },
    { "itemName": "Salmon", "brand": "Cargills", "stock": "100", "weight": "500 g" },
    { "itemName": "Salmon", "brand": "Laugfs", "stock": "80", "weight": "500 g" },
    { "itemName": "Tuna", "brand": "Keells", "stock": "120", "weight": "1 kg" },
    { "itemName": "Tuna", "brand": "Cargills", "stock": "150", "weight": "1 kg" },
    { "itemName": "Tuna", "brand": "Laugfs", "stock": "110", "weight": "1 kg" },
    { "itemName": "Mackerel", "brand": "Keells", "stock": "60", "weight": "1 kg" },
    { "itemName": "Mackerel", "brand": "Cargills", "stock": "70", "weight": "1 kg" },
    { "itemName": "Mackerel", "brand": "Laugfs", "stock": "50", "weight": "1 kg" },
    { "itemName": "Prawns", "brand": "Keells", "stock": "80", "weight": "500 g" },
    { "itemName": "Prawns", "brand": "Cargills", "stock": "100", "weight": "500 g" },
    { "itemName": "Prawns", "brand": "Laugfs", "stock": "90", "weight": "500 g" },
    { "itemName": "Crab", "brand": "Keells", "stock": "40", "weight": "500 g" },
    { "itemName": "Crab", "brand": "Cargills", "stock": "60", "weight": "500 g" },
    { "itemName": "Crab", "brand": "Laugfs", "stock": "50", "weight": "500 g" },
    { "itemName": "Orange Juice", "brand": "Elephant House", "stock": "200", "weight": "1 liter" },
    { "itemName": "Orange Juice", "brand": "MD", "stock": "180", "weight": "1 liter" },
    { "itemName": "Orange Juice", "brand": "Cargills", "stock": "210", "weight": "1 liter" },
    { "itemName": "Green Tea", "brand": "Dilmah", "stock": "150", "weight": "100 g" },
    { "itemName": "Green Tea", "brand": "Lipton", "stock": "130", "weight": "100 g" },
    { "itemName": "Green Tea", "brand": "Twinings", "stock": "140", "weight": "100 g" },
    { "itemName": "Coffee Beans", "brand": "Nescafe", "stock": "110", "weight": "250 g" },
    { "itemName": "Coffee Beans", "brand": "Starbucks", "stock": "130", "weight": "250 g" },
    { "itemName": "Coffee Beans", "brand": "Lavazza", "stock": "120", "weight": "250 g" },
    { "itemName": "Rice", "brand": "Maha", "stock": "150", "weight": "5 kg" },
    { "itemName": "Rice", "brand": "Shan", "stock": "120", "weight": "5 kg" },
    { "itemName": "Rice", "brand": "Sun", "stock": "130", "weight": "5 kg" },
    { "itemName": "Flour", "brand": "Golden Flour", "stock": "200", "weight": "1 kg" },
    { "itemName": "Flour", "brand": "Harvest", "stock": "180", "weight": "1 kg" },
    { "itemName": "Flour", "brand": "Pure", "stock": "190", "weight": "1 kg" },
    { "itemName": "Sugar", "brand": "White", "stock": "170", "weight": "1 kg" },
    { "itemName": "Sugar", "brand": "Brown", "stock": "160", "weight": "1 kg" },
    { "itemName": "Sugar", "brand": "Raw", "stock": "150", "weight": "1 kg" },
    { "itemName": "Salt", "brand": "Sea Salt", "stock": "220", "weight": "500 g" },
    { "itemName": "Salt", "brand": "Table Salt", "stock": "210", "weight": "500 g" },
    { "itemName": "Salt", "brand": "Himalayan Salt", "stock": "230", "weight": "500 g" },
    { "itemName": "Butter", "brand": "Dairy", "stock": "140", "weight": "250 g" },
    { "itemName": "Butter", "brand": "Farm", "stock": "120", "weight": "250 g" },
    { "itemName": "Butter", "brand": "Organic", "stock": "130", "weight": "250 g" },
    { "itemName": "Cheese", "brand": "Cheddar", "stock": "90", "weight": "200 g" },
    { "itemName": "Cheese", "brand": "Mozzarella", "stock": "100", "weight": "200 g" },
    { "itemName": "Cheese", "brand": "Parmesan", "stock": "110", "weight": "200 g" },
    { "itemName": "Milk", "brand": "Full Cream", "stock": "150", "weight": "1 liter" },
    { "itemName": "Milk", "brand": "Skimmed", "stock": "120", "weight": "1 liter" },
    { "itemName": "Milk", "brand": "Soy", "stock": "130", "weight": "1 liter" },
    { "itemName": "Yogurt", "brand": "Greek", "stock": "70", "weight": "500 g" },
    { "itemName": "Yogurt", "brand": "Regular", "stock": "80", "weight": "500 g" },
    { "itemName": "Yogurt", "brand": "Low Fat", "stock": "90", "weight": "500 g" },
    { "itemName": "Juice", "brand": "Apple", "stock": "180", "weight": "1 liter" },
    { "itemName": "Juice", "brand": "Grape", "stock": "150", "weight": "1 liter" },
    { "itemName": "Juice", "brand": "Pineapple", "stock": "160", "weight": "1 liter" },
   
        { "itemName": "Ice Cream", "brand": "Elephant House", "stock": "150", "weight": "1 liter" },
        { "itemName": "Ice Cream", "brand": "Cargills Magic", "stock": "120", "weight": "1 liter" },
        { "itemName": "Ice Cream", "brand": "Baskin Robbins", "stock": "100", "weight": "1 liter" }, 
        { "itemName": "Milk", "brand": "Anchor", "stock": "200", "weight": "1 liter" },
        { "itemName": "Milk", "brand": "Pelwatte", "stock": "180", "weight": "1 liter" },
        { "itemName": "Milk", "brand": "Kotmale", "stock": "150", "weight": "1 liter" },
        { "itemName": "Chicken Nuggets", "brand": "Keells", "stock": "120", "weight": "500 g" },
        { "itemName": "Chicken Nuggets", "brand": "Cargills", "stock": "150", "weight": "500 g" },
        { "itemName": "Chicken Nuggets", "brand": "McCain", "stock": "100", "weight": "500 g" },
        { "itemName": "Frozen Peas", "brand": "Harischandra", "stock": "80", "weight": "500 g" },
        { "itemName": "Frozen Peas", "brand": "Keells", "stock": "100", "weight": "500 g" },
        { "itemName": "Frozen Peas", "brand": "Cargills", "stock": "70", "weight": "500 g" },
        { "itemName": "French Fries", "brand": "McCain", "stock": "60", "weight": "1 kg" },
        { "itemName": "French Fries", "brand": "Keells", "stock": "90", "weight": "1 kg" },
        { "itemName": "French Fries", "brand": "Cargills", "stock": "80", "weight": "1 kg" },
        { "itemName": "Fish Fingers", "brand": "Keells", "stock": "50", "weight": "500 g" },
        { "itemName": "Fish Fingers", "brand": "Cargills", "stock": "70", "weight": "500 g" },
        { "itemName": "Fish Fingers", "brand": "McCain", "stock": "60", "weight": "500 g" },
        { "itemName": "Pizza", "brand": "Domino’s", "stock": "40", "weight": "400 g" },
        { "itemName": "Pizza", "brand": "Pizza Hut", "stock": "30", "weight": "400 g" },
        { "itemName": "Pizza", "brand": "Cargills", "stock": "35", "weight": "400 g" },
        { "itemName": "Rice", "brand": "Araliya", "stock": "200", "weight": "1 kg" },
        { "itemName": "Rice", "brand": "Nipuna", "stock": "180", "weight": "1 kg" },
        { "itemName": "Rice", "brand": "Keells", "stock": "220", "weight": "1 kg" },
        { "itemName": "Noodles", "brand": "Maggi", "stock": "150", "weight": "200 g" },
        { "itemName": "Noodles", "brand": "Prima", "stock": "170", "weight": "200 g" },
        { "itemName": "Noodles", "brand": "Elephant House", "stock": "160", "weight": "200 g" },
        { "itemName": "Biscuits", "brand": "Munchee", "stock": "300", "weight": "200 g" },
        { "itemName": "Biscuits", "brand": "Maliban", "stock": "280", "weight": "200 g" },
        { "itemName": "Biscuits", "brand": "Ritzbury", "stock": "260", "weight": "200 g" },
        { "itemName": "Spices", "brand": "MD", "stock": "100", "weight": "50 g" },
        { "itemName": "Spices", "brand": "Harischandra", "stock": "120", "weight": "50 g" },
        { "itemName": "Spices", "brand": "Ruhunu", "stock": "150", "weight": "50 g" },
        { "itemName": "Flour", "brand": "Prima", "stock": "220", "weight": "1 kg" },
        { "itemName": "Flour", "brand": "Harischandra", "stock": "200", "weight": "1 kg" },
        { "itemName": "Flour", "brand": "Elephant House", "stock": "190", "weight": "1 kg" },
        { "itemName": "Plates", "brand": "Noritake", "stock": "150", "weight": "Standard" },
        { "itemName": "Plates", "brand": "Dankotuwa", "stock": "120", "weight": "Standard" },
        { "itemName": "Plates", "brand": "Lanka Ceramic", "stock": "100", "weight": "Standard" },
        { "itemName": "Cups", "brand": "Noritake", "stock": "200", "weight": "Standard" },
        { "itemName": "Cups", "brand": "Dankotuwa", "stock": "180", "weight": "Standard" },
        { "itemName": "Cups", "brand": "Lanka Ceramic", "stock": "150", "weight": "Standard" },
        { "itemName": "Cutlery Set", "brand": "Arpico", "stock": "100", "weight": "24 Pieces" },
        { "itemName": "Cutlery Set", "brand": "Keells", "stock": "120", "weight": "24 Pieces" },
        { "itemName": "Cutlery Set", "brand": "Cargills", "stock": "90", "weight": "24 Pieces" },
        { "itemName": "Kitchen Towels", "brand": "Arpico", "stock": "70", "weight": "2 Pieces" },
        { "itemName": "Kitchen Towels", "brand": "Keells", "stock": "60", "weight": "2 Pieces" },
        { "itemName": "Kitchen Towels", "brand": "Cargills", "stock": "85", "weight": "2 Pieces" },
        { "itemName": "Pots & Pans", "brand": "Meyer", "stock": "50", "weight": "Standard" },
        { "itemName": "Pots & Pans", "brand": "Prestige", "stock": "70", "weight": "Standard" },
        { "itemName": "Pots & Pans", "brand": "Tefal", "stock": "60", "weight": "Standard" },
        { "itemName": "Dishwashing Liquid", "brand": "Sunlight", "stock": "300", "weight": "500 ml" },
        { "itemName": "Dishwashing Liquid", "brand": "Vim", "stock": "280", "weight": "500 ml" },
        { "itemName": "Dishwashing Liquid", "brand": "Cif", "stock": "260", "weight": "500 ml" },
        { "itemName": "Laundry Detergent", "brand": "Ariel", "stock": "400", "weight": "1 kg" },
        { "itemName": "Laundry Detergent", "brand": "Surf Excel", "stock": "380", "weight": "1 kg" },
        { "itemName": "Laundry Detergent", "brand": "Rin", "stock": "360", "weight": "1 kg" },
        { "itemName": "Floor Cleaner", "brand": "Harpic", "stock": "500", "weight": "1 liter" },
        { "itemName": "Floor Cleaner", "brand": "Muscle", "stock": "480", "weight": "1 liter" },
        { "itemName": "Floor Cleaner", "brand": "Domex", "stock": "460", "weight": "1 liter" },
        { "itemName": "Toilet Cleaner", "brand": "Harpic", "stock": "220", "weight": "500 ml" },
        { "itemName": "Toilet Cleaner", "brand": "Domex", "stock": "200", "weight": "500 ml" },
        { "itemName": "Toilet Cleaner", "brand": "Muscle", "stock": "190", "weight": "500 ml" },
        { "itemName": "Juice", "brand": "Pineapple", "stock": "160", "weight": "1 liter" },
        { "itemName": "Turmeric", "brand": "MD", "stock": "80", "weight": "50 g" },
    { "itemName": "Turmeric", "brand": "Harischandra", "stock": "90", "weight": "50 g" },
    { "itemName": "Chili Powder", "brand": "MD", "stock": "100", "weight": "50 g" },
    { "itemName": "Chili Powder", "brand": "Harischandra", "stock": "120", "weight": "50 g" },
    { "itemName": "Pepper", "brand": "MD", "stock": "70", "weight": "50 g" },
    { "itemName": "Pepper", "brand": "Harischandra", "stock": "85", "weight": "50 g" },
    { "itemName": "Garlic Powder", "brand": "MD", "stock": "60", "weight": "50 g" },
    { "itemName": "Garlic Powder", "brand": "Harischandra", "stock": "70", "weight": "50 g" },
    { "itemName": "Cinnamon", "brand": "MD", "stock": "50", "weight": "50 g" },
    { "itemName": "Cinnamon", "brand": "Harischandra", "stock": "60", "weight": "50 g" },
    { "itemName": "Chocolate Biscuit", "brand": "Munchee", "stock": "300", "weight": "200 g" },
    { "itemName": "Chocolate Biscuit", "brand": "Maliban", "stock": "280", "weight": "200 g" },
    { "itemName": "Hawaiian Cookies", "brand": "Ritzbury", "stock": "260", "weight": "200 g" },
    { "itemName": "Lemon Puff", "brand": "Munchee", "stock": "220", "weight": "200 g" },
    { "itemName": "Mari", "brand": "Maliban", "stock": "240", "weight": "200 g" },
    { "itemName": "Nice", "brand": "Ritzbury", "stock": "230", "weight": "200 g" },
    { "itemName": "Necto", "brand": "Elephant House", "stock": "150", "weight": "500 ml" },
    { "itemName": "Mirinda", "brand": "Pepsi", "stock": "120", "weight": "500 ml" },
    { "itemName": "Sprite", "brand": "Coca-Cola", "stock": "100", "weight": "500 ml" },
    { "itemName": "Pepsi", "brand": "Pepsi", "stock": "110", "weight": "500 ml" },
    { "itemName": "Coca-Cola", "brand": "Coca-Cola", "stock": "130", "weight": "500 ml" }
      
  


  ];
  

  const addHardcodedData = () => {
    hardcodedData.forEach((product) => {
      const uniqueKey = `${product.itemName}_${product.brand}`;
      set(ref(db, 'items/' + uniqueKey), {
        itemName: product.itemName,
        stock: product.stock,
        brand: product.brand,
        weight: product.weight,
      });
    });
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

      <TextInput
        placeholder="Weight"
        value={weight}
        onChangeText={(text) => setWeight(text)}
        style={styles.input}
      />

      <Button title="Add Data" onPress={addHardcodedData} />

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
    padding: 10,
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
