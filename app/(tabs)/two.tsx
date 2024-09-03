
import { StyleSheet, TextInput, Button, Text, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../config';
import { ref, set, onValue, get } from 'firebase/database';
import Voice from 'react-native-voice';
import * as Speech from 'expo-speech';


interface Post {
  id: string;
  itemName: string;
  discount: string;
  promotion: string;
  stock: string;
  brand: string;
}

const AddData = () => {
  const [itemName, setItemName] = useState('');
  const [stock, setStock] = useState('');
  const [brand, setBrand] = useState('');
  const [todoData, setTodoData] = useState<Post[]>([]);
  const [isListening, setIsListening] = useState(false);

  const hardcodedData = [
    {
        "itemName": "Carrots",
        "discount": "15%",
        "promotion": "Fresh Veggie Special",
        "brand": "Fresh Picks"
    },
    {
        "itemName": "Carrots",
        "discount": "20%",
        "promotion": "Organic Crunch Deal",
        "brand": "Organic Harvest"
    },
    // {
    //     "itemName": "Carrots",
    //     "discount ": "10%",
    //     "promotion": "Farm Fresh Savings",
    //     "brand": "Farm Fresh"
    // },
    {
        "itemName": "Tomatoes",
        "discount": "10%",
        "promotion": "Tomato Lover's discount",
        "brand": "Fresh Picks"
    },
    {
        "itemName": "Tomatoes",
        "discount": "15%",
        "promotion": "Nature Fresh Offer",
        "brand": "Nature’s Best"
    },
    {
        "itemName": "Tomatoes",
        "discount": "12%",
        "promotion": "Green Valley Special",
        "brand": "Green Valley"
    },
    {
        "itemName": "Spinach",
        "discount": "20%",
        "promotion": "Green Goodness Deal",
        "brand": "Organic Harvest"
    },
    {
        "itemName": "Spinach",
        "discount": "15%",
        "promotion": "Farm Fresh Greens",
        "brand": "Farm Fresh"
    },
    {
        "itemName": "Spinach",
        "discount": "18%",
        "promotion": "Valley Fresh Offer",
        "brand": "Green Valley"
    },
    {
        "itemName": "Potatoes",
        "discount": "12%",
        "promotion": "Spud Special",
        "brand": "Fresh Picks"
    },
    {
        "itemName": "Potatoes",
        "discount": "10%",
        "promotion": "Farm Fresh Potato discount",
        "brand": "Farm Fresh"
    },
    {
        "itemName": "Potatoes",
        "discount": "15%",
        "promotion": "Organic Potato Savings",
        "brand": "Organic Harvest"
    },
    {
        "itemName": "Bell Peppers",
        "discount": "10%",
        "promotion": "Bell Pepper Bonanza",
        "brand": "Green Valley"
    },
    {
        "itemName": "Bell Peppers",
        "discount": "12%",
        "promotion": "Fresh Picks Special",
        "brand": "Fresh Picks"
    },
    {
        "itemName": "Bell Peppers",
        "discount": "15%",
        "promotion": "Organic Harvest Deal",
        "brand": "Organic Harvest"
    },
    {
        "itemName": "Apples",
        "discount": "10%",
        "promotion": "Apple Delight Offer",
        "brand": "Fresh Picks"
    },
    {
        "itemName": "Apples",
        "discount": "12%",
        "promotion": "Organic Harvest Savings",
        "brand": "Organic Harvest"
    },
    {
        "itemName": "Apples",
        "discount": "15%",
        "promotion": "Farm Fresh Apple Deal",
        "brand": "Farm Fresh"
    },
    {
        "itemName": "Oranges",
        "discount": "15%",
        "promotion": "Orange Juice Fiesta",
        "brand": "Fresh Picks"
    },
    {
        "itemName": "Oranges",
        "discount": "10%",
        "promotion": "Nature’s Best Citrus Sale",
        "brand": "Nature’s Best"
    },
    {
        "itemName": "Oranges",
        "discount": "12%",
        "promotion": "Green Valley Citrus discount",
        "brand": "Green Valley"
    },
    {
        "itemName": "Bananas",
        "discount": "10%",
        "promotion": "Banana Bonanza",
        "brand": "Organic Harvest"
    },
    {
        "itemName": "Bananas",
        "discount": "12%",
        "promotion": "Farm Fresh Banana Offer",
        "brand": "Farm Fresh"
    },
    {
        "itemName": "Bananas",
        "discount": "15%",
        "promotion": "Green Valley Banana Deal",
        "brand": "Green Valley"
    },
    {
        "itemName": "Mangoes",
        "discount": "12%",
        "promotion": "Mango Madness",
        "brand": "Fresh Picks"
    },
    {
        "itemName": "Mangoes",
        "discount": "15%",
        "promotion": "Farm Fresh Mango Sale",
        "brand": "Farm Fresh"
    },
    {
        "itemName": "Mangoes",
        "discount": "10%",
        "promotion": "Organic Mango Special",
        "brand": "Organic Harvest"
    },
    {
        "itemName": "Grapes",
        "discount": "10%",
        "promotion": "Grape Goodness",
        "brand": "Green Valley"
    },
    {
        "itemName": "Grapes",
        "discount": "12%",
        "promotion": "Fresh Picks Grape Deal",
        "brand": "Fresh Picks"
    },
    {
        "itemName": "Grapes",
        "discount": "15%",
        "promotion": "Organic Harvest Grape Offer",
        "brand": "Organic Harvest"
    },
    {
        "itemName": "Chicken Breast",
        "discount": "15%",
        "promotion": "Chicken Breast discount",
        "brand": "Keells"
    },
    {
        "itemName": "Chicken Breast",
        "discount": "10%",
        "promotion": "Cargills Chicken Offer",
        "brand": "Cargills"
    },
    {
        "itemName": "Chicken Breast",
        "discount": "12%",
        "promotion": "Laugfs Chicken Deal",
        "brand": "Laugfs"
    },
    // {
    //     "itemName": "Beef Steak",
    //     "discount ": "20%",
    //     "promotion": "Beef Steak Bonanza",
    //     "brand": "Keells"
    // },
    {
        "itemName": "Beef Steak",
        "discount": "15%",
        "promotion": "Cargills Beef Special",
        "brand": "Cargills"
    },
    {
        "itemName": "Beef Steak",
        "discount": "18%",
        "promotion": "Laugfs Beef Deal",
        "brand": "Laugfs"
    },
    {
        "itemName": "Pork Chops",
        "discount": "15%",
        "promotion": "Pork Chops Special",
        "brand": "Keells"
    },
    {
        "itemName": "Pork Chops",
        "discount": "10%",
        "promotion": "Cargills Pork Offer",
        "brand": "Cargills"
    },
    {
        "itemName": "Pork Chops",
        "discount": "12%",
        "promotion": "Laugfs Pork Deal",
        "brand": "Laugfs"
    },
    {
        "itemName": "Mutton",
        "discount": "10%",
        "promotion": "Mutton Special Offer",
        "brand": "Keells"
    },
    {
        "itemName": "Mutton",
        "discount": "12%",
        "promotion": "Cargills Mutton Deal",
        "brand": "Cargills"
    },
    {
        "itemName": "Mutton",
        "discount": "15%",
        "promotion": "Laugfs Mutton discount",
        "brand": "Laugfs"
    },
    {
        "itemName": "Turkey Breast",
        "discount": "10%",
        "promotion": "Turkey Breast Offer",
        "brand": "Keells"
    },
    {
        "itemName": "Turkey Breast",
        "discount": "15%",
        "promotion": "Cargills Turkey Special",
        "brand": "Cargills"
    },
    {
        "itemName": "Turkey Breast",
        "discount": "12%",
        "promotion": "Laugfs Turkey Deal",
        "brand": "Laugfs"
    },
    {
        "itemName": "Salmon",
        "discount": "15%",
        "promotion": "Salmon Sale",
        "brand": "Keells"
    },
    {
        "itemName": "Salmon",
        "discount": "12%",
        "promotion": "Cargills Salmon Special",
        "brand": "Cargills"
    },
    {
        "itemName": "Salmon",
        "discount": "18%",
        "promotion": "Laugfs Salmon Deal",
        "brand": "Laugfs"
    },
    {
        "itemName": "Tuna",
        "discount": "10%",
        "promotion": "Tuna discount",
        "brand": "Keells"
    },
    {
        "itemName": "Tuna",
        "discount": "12%",
        "promotion": "Cargills Tuna Offer",
        "brand": "Cargills"
    },
    {
        "itemName": "Tuna",
        "discount": "15%",
        "promotion": "Laugfs Tuna Deal",
        "brand": "Laugfs"
    },
    {
        "itemName": "Shrimp",
        "discount": "20%",
        "promotion": "Shrimp Special",
        "brand": "Keells"
    },
    {
        "itemName": "Shrimp",
        "discount": "18%",
        "promotion": "Cargills Shrimp Deal",
        "brand": "Cargills"
    },
    {
        "itemName": "Shrimp",
        "discount": "15%",
        "promotion": "Laugfs Shrimp Offer",
        "brand": "Laugfs"
    }
];


useEffect(() => {
  // Initialize Text-to-Speech
  Speech.getAvailableVoicesAsync().then(voices => {
    console.log('Available voices:', voices);
  });

  // Add hardcoded data to the database when the component mounts
  // addHardcodedData();

  const starCountRef = ref(db, 'promotions/');
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const newPosts: Post[] = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setTodoData(newPosts);
    }
  });
  const addHardcodedData = () => {
    hardcodedData.forEach((product) => {
      const uniqueKey = `${product.itemName}_${product.brand}`;
      set(ref(db, 'promotions/' + uniqueKey), {
        itemName: product.itemName,
        promotion: product.promotion,
        brand: product.brand,
        discount: product.discount,
      });
    });
  };
  
return () => {
      Speech.stop();
    };
  }, []);
  
  const speak = (message: string) => {
    Speech.speak(message, { language: 'en', rate: 1 });
  };

  const findAlternativeBrands = async (itemName: string) => {
    const alternativeBrands: string[] = [];
    try {
      const itemsRef = ref(db, 'items/');
      const snapshot = await get(itemsRef);
  
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Items data:', data);  // Debug log
        for (const key in data) {
          if (data[key].itemName === itemName && parseInt(data[key].stock) > 0) {
            const brand = key.split('_')[1]; // Extract brand from key
            if (!alternativeBrands.includes(brand)) {
              alternativeBrands.push(brand);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
    console.log('Alternative Brands:', alternativeBrands); // Debug log
    return alternativeBrands;
  };
  

  const searchPromotion = async () => {
    try {
      const uniqueKey = `${itemName}_${brand}`;
      const promotionRef = ref(db, 'promotions/' + uniqueKey);
      const stockRef = ref(db, 'items/' + uniqueKey);
      
      const promotionSnapshot = await get(promotionRef);
      const stockSnapshot = await get(stockRef);
  
      if (promotionSnapshot.exists() && stockSnapshot.exists()) {
        const promoData = promotionSnapshot.val();
        const stockData = stockSnapshot.val();
  
        if (parseInt(stockData.stock) > 0) {
          const message = `Item: ${promoData.itemName}, Promotion: ${promoData.promotion}, Discount: ${promoData.discount}, Stock: ${stockData.stock}`;
          Alert.alert('Promotion Found', message);
          speak(message);
        } else {
          const alternativeBrands = await findAlternativeBrands(itemName);
          if (alternativeBrands.length > 0) {
            const alternativeMessage = `Item: ${promoData.itemName} is out of stock with ${brand}. Alternative brands with sufficient stock are: ${alternativeBrands.join(', ')}.`;
            Alert.alert('Stock Insufficient', alternativeMessage);
            speak(alternativeMessage);
          } else {
            const noStockMessage = `Sorry, ${promoData.itemName} is out of stock across all brands.`;
            Alert.alert('Out of Stock', noStockMessage);
            speak(noStockMessage);
          }
        }
      } else {
        const notFoundMessage = `No promotion or stock information found for ${itemName} from brand ${brand}.`;
        Alert.alert('Not Found', notFoundMessage);
        speak(notFoundMessage);
      }
    } catch (error) {
      console.error("Error fetching promotion or stock:", error);
      Alert.alert('Error', 'An error occurred while searching for promotion and stock information.');
    }
  };
      
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Data</Text>
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        style={styles.input}
        placeholder="Brand"
        value={brand}
        onChangeText={setBrand}
      />
      <TextInput
        style={styles.input}
        placeholder="Stock"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />
      <Button title="Search Promotion" onPress={searchPromotion} />
      <View style={styles.listContainer}>
        {todoData.map((post) => (
          <View key={post.id} style={styles.listItem}>
            <Text>{`Item: ${post.itemName}, Brand: ${post.brand}, Discount: ${post.discount}, Promotion: ${post.promotion}`}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    color:'white'
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  listContainer: {
    marginTop: 20,
  },
  listItem: {
    marginBottom: 10,
  },
});

export default AddData;






// import { StyleSheet, TextInput, Button, Text, View , Alert } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { db } from '../config';
// import { ref, set, onValue, get } from 'firebase/database';


// interface Post {
//   id: string;
//   itemName: string;
//   discount: string;
//   promotion: string;
//   stock: string;
//   brand: string;
// }

// const AddData = () => {
//   const [itemName, setItemName] = useState('');
//   const [stock, setStock] = useState('');
//   const [brand, setBrand] = useState('');
//   const [todoData, setTodoData] = useState<Post[]>([]);

//   const hardcodedData = [
//     {
//         "itemName": "Carrots",
//         "discount": "15%",
//         "promotion": "Fresh Veggie Special",
//         "brand": "Fresh Picks"
//     },
//     {
//         "itemName": "Carrots",
//         "discount": "20%",
//         "promotion": "Organic Crunch Deal",
//         "brand": "Organic Harvest"
//     },
//     // {
//     //     "itemName": "Carrots",
//     //     "discount ": "10%",
//     //     "promotion": "Farm Fresh Savings",
//     //     "brand": "Farm Fresh"
//     // },
//     {
//         "itemName": "Tomatoes",
//         "discount": "10%",
//         "promotion": "Tomato Lover's discount",
//         "brand": "Fresh Picks"
//     },
//     {
//         "itemName": "Tomatoes",
//         "discount": "15%",
//         "promotion": "Nature Fresh Offer",
//         "brand": "Nature’s Best"
//     },
//     {
//         "itemName": "Tomatoes",
//         "discount": "12%",
//         "promotion": "Green Valley Special",
//         "brand": "Green Valley"
//     },
//     {
//         "itemName": "Spinach",
//         "discount": "20%",
//         "promotion": "Green Goodness Deal",
//         "brand": "Organic Harvest"
//     },
//     {
//         "itemName": "Spinach",
//         "discount": "15%",
//         "promotion": "Farm Fresh Greens",
//         "brand": "Farm Fresh"
//     },
//     {
//         "itemName": "Spinach",
//         "discount": "18%",
//         "promotion": "Valley Fresh Offer",
//         "brand": "Green Valley"
//     },
//     {
//         "itemName": "Potatoes",
//         "discount": "12%",
//         "promotion": "Spud Special",
//         "brand": "Fresh Picks"
//     },
//     {
//         "itemName": "Potatoes",
//         "discount": "10%",
//         "promotion": "Farm Fresh Potato discount",
//         "brand": "Farm Fresh"
//     },
//     {
//         "itemName": "Potatoes",
//         "discount": "15%",
//         "promotion": "Organic Potato Savings",
//         "brand": "Organic Harvest"
//     },
//     {
//         "itemName": "Bell Peppers",
//         "discount": "10%",
//         "promotion": "Bell Pepper Bonanza",
//         "brand": "Green Valley"
//     },
//     {
//         "itemName": "Bell Peppers",
//         "discount": "12%",
//         "promotion": "Fresh Picks Special",
//         "brand": "Fresh Picks"
//     },
//     {
//         "itemName": "Bell Peppers",
//         "discount": "15%",
//         "promotion": "Organic Harvest Deal",
//         "brand": "Organic Harvest"
//     },
//     {
//         "itemName": "Apples",
//         "discount": "10%",
//         "promotion": "Apple Delight Offer",
//         "brand": "Fresh Picks"
//     },
//     {
//         "itemName": "Apples",
//         "discount": "12%",
//         "promotion": "Organic Harvest Savings",
//         "brand": "Organic Harvest"
//     },
//     {
//         "itemName": "Apples",
//         "discount": "15%",
//         "promotion": "Farm Fresh Apple Deal",
//         "brand": "Farm Fresh"
//     },
//     {
//         "itemName": "Oranges",
//         "discount": "15%",
//         "promotion": "Orange Juice Fiesta",
//         "brand": "Fresh Picks"
//     },
//     {
//         "itemName": "Oranges",
//         "discount": "10%",
//         "promotion": "Nature’s Best Citrus Sale",
//         "brand": "Nature’s Best"
//     },
//     {
//         "itemName": "Oranges",
//         "discount": "12%",
//         "promotion": "Green Valley Citrus discount",
//         "brand": "Green Valley"
//     },
//     {
//         "itemName": "Bananas",
//         "discount": "10%",
//         "promotion": "Banana Bonanza",
//         "brand": "Organic Harvest"
//     },
//     {
//         "itemName": "Bananas",
//         "discount": "12%",
//         "promotion": "Farm Fresh Banana Offer",
//         "brand": "Farm Fresh"
//     },
//     {
//         "itemName": "Bananas",
//         "discount": "15%",
//         "promotion": "Green Valley Banana Deal",
//         "brand": "Green Valley"
//     },
//     {
//         "itemName": "Mangoes",
//         "discount": "12%",
//         "promotion": "Mango Madness",
//         "brand": "Fresh Picks"
//     },
//     {
//         "itemName": "Mangoes",
//         "discount": "15%",
//         "promotion": "Farm Fresh Mango Sale",
//         "brand": "Farm Fresh"
//     },
//     {
//         "itemName": "Mangoes",
//         "discount": "10%",
//         "promotion": "Organic Mango Special",
//         "brand": "Organic Harvest"
//     },
//     {
//         "itemName": "Grapes",
//         "discount": "10%",
//         "promotion": "Grape Goodness",
//         "brand": "Green Valley"
//     },
//     {
//         "itemName": "Grapes",
//         "discount": "12%",
//         "promotion": "Fresh Picks Grape Deal",
//         "brand": "Fresh Picks"
//     },
//     {
//         "itemName": "Grapes",
//         "discount": "15%",
//         "promotion": "Organic Harvest Grape Offer",
//         "brand": "Organic Harvest"
//     },
//     {
//         "itemName": "Chicken Breast",
//         "discount": "15%",
//         "promotion": "Chicken Breast discount",
//         "brand": "Keells"
//     },
//     {
//         "itemName": "Chicken Breast",
//         "discount": "10%",
//         "promotion": "Cargills Chicken Offer",
//         "brand": "Cargills"
//     },
//     {
//         "itemName": "Chicken Breast",
//         "discount": "12%",
//         "promotion": "Laugfs Chicken Deal",
//         "brand": "Laugfs"
//     },
//     // {
//     //     "itemName": "Beef Steak",
//     //     "discount ": "20%",
//     //     "promotion": "Beef Steak Bonanza",
//     //     "brand": "Keells"
//     // },
//     {
//         "itemName": "Beef Steak",
//         "discount": "15%",
//         "promotion": "Cargills Beef Special",
//         "brand": "Cargills"
//     },
//     {
//         "itemName": "Beef Steak",
//         "discount": "18%",
//         "promotion": "Laugfs Beef Deal",
//         "brand": "Laugfs"
//     },
//     {
//         "itemName": "Pork Chops",
//         "discount": "15%",
//         "promotion": "Pork Chops Special",
//         "brand": "Keells"
//     },
//     {
//         "itemName": "Pork Chops",
//         "discount": "10%",
//         "promotion": "Cargills Pork Offer",
//         "brand": "Cargills"
//     },
//     {
//         "itemName": "Pork Chops",
//         "discount": "12%",
//         "promotion": "Laugfs Pork Deal",
//         "brand": "Laugfs"
//     },
//     {
//         "itemName": "Mutton",
//         "discount": "10%",
//         "promotion": "Mutton Special Offer",
//         "brand": "Keells"
//     },
//     {
//         "itemName": "Mutton",
//         "discount": "12%",
//         "promotion": "Cargills Mutton Deal",
//         "brand": "Cargills"
//     },
//     {
//         "itemName": "Mutton",
//         "discount": "15%",
//         "promotion": "Laugfs Mutton discount",
//         "brand": "Laugfs"
//     },
//     {
//         "itemName": "Turkey Breast",
//         "discount": "10%",
//         "promotion": "Turkey Breast Offer",
//         "brand": "Keells"
//     },
//     {
//         "itemName": "Turkey Breast",
//         "discount": "15%",
//         "promotion": "Cargills Turkey Special",
//         "brand": "Cargills"
//     },
//     {
//         "itemName": "Turkey Breast",
//         "discount": "12%",
//         "promotion": "Laugfs Turkey Deal",
//         "brand": "Laugfs"
//     },
//     {
//         "itemName": "Salmon",
//         "discount": "15%",
//         "promotion": "Salmon Sale",
//         "brand": "Keells"
//     },
//     {
//         "itemName": "Salmon",
//         "discount": "12%",
//         "promotion": "Cargills Salmon Special",
//         "brand": "Cargills"
//     },
//     {
//         "itemName": "Salmon",
//         "discount": "18%",
//         "promotion": "Laugfs Salmon Deal",
//         "brand": "Laugfs"
//     },
//     {
//         "itemName": "Tuna",
//         "discount": "10%",
//         "promotion": "Tuna discount",
//         "brand": "Keells"
//     },
//     {
//         "itemName": "Tuna",
//         "discount": "12%",
//         "promotion": "Cargills Tuna Offer",
//         "brand": "Cargills"
//     },
//     {
//         "itemName": "Tuna",
//         "discount": "15%",
//         "promotion": "Laugfs Tuna Deal",
//         "brand": "Laugfs"
//     },
//     {
//         "itemName": "Shrimp",
//         "discount": "20%",
//         "promotion": "Shrimp Special",
//         "brand": "Keells"
//     },
//     {
//         "itemName": "Shrimp",
//         "discount": "18%",
//         "promotion": "Cargills Shrimp Deal",
//         "brand": "Cargills"
//     },
//     {
//         "itemName": "Shrimp",
//         "discount": "15%",
//         "promotion": "Laugfs Shrimp Offer",
//         "brand": "Laugfs"
//     }
// ];

  

//   const addHardcodedData = () => {
//     hardcodedData.forEach((product) => {
//       const uniqueKey = `${product.itemName}_${product.brand}`;
//       set(ref(db, 'promotions/' + uniqueKey), {
//         itemName: product.itemName,
//         promotion: product.promotion,
//         brand: product.brand,
//         discount: product.discount,
//       });
//     });
//   };


//   const searchPromotion = async () => {
//     try {
//       const uniqueKey = `${itemName}_${brand}`;
//       const promotionRef = ref(db, 'promotions/' + uniqueKey);
//       const stockRef = ref(db, 'items/' + uniqueKey);
//       const promotionSnapshot = await get(promotionRef);
//       const stockSnapshot = await get(stockRef);

//       if (promotionSnapshot.exists() && stockSnapshot.exists()) {
//         const promoData = promotionSnapshot.val();
//         const stockData = stockSnapshot.val();
        
//         const requestedStock = parseInt(stock);
//         const availableStock = parseInt(stockData.stock);

//         if (availableStock >= requestedStock) {
//           Alert.alert(
//             'Promotion Details',
//             `Discount: ${promoData.discount}\nPromotion: ${promoData.promotion}\nStock: ${availableStock}`
//           );
//         } else {
//           // Find alternatives with sufficient stock
//           const alternatives = [];
//           const itemsRef = ref(db, 'items/');
//           const itemsSnapshot = await get(itemsRef);
//           const itemsData = itemsSnapshot.val();

//           for (const key in itemsData) {
//             if (itemsData[key].itemName === itemName && itemsData[key].stock >= requestedStock && itemsData[key].brand !== brand) {
//               alternatives.push({
//                 brand: itemsData[key].brand,
//                 stock: itemsData[key].stock
//               });
//             }
//           }

//           if (alternatives.length > 0) {
//             const alternativeBrands = alternatives.map(alt => `${alt.brand} (${alt.stock} in stock)`).join(', ');
//             Alert.alert(
//               'Stock Alert',
//               `Not enough stock for ${itemName} from ${brand}. Only ${availableStock} in stock.\n\nAlternative brands with sufficient stock: ${alternativeBrands}`
//             );
//           } else {
//             Alert.alert(
//               'Stock Alert',
//               `Not enough stock for ${itemName} from ${brand}. Only ${availableStock} in stock.\nNo alternative brands available with sufficient stock.`
//             );
//           }
//         }
//       } else {
//         Alert.alert('No Promotion Found', 'No promotions available for the entered item name and brand.');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'An error occurred while searching for promotions.');
//     }
//   };

//   useEffect(() => {
//     // Add hardcoded data to the database when the component mounts
//     addHardcodedData();

//     const starCountRef = ref(db, 'promotions/');
//     onValue(starCountRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const newPosts: Post[] = Object.keys(data).map((key) => ({
//           id: key,
//           ...data[key],
//         }));
//         setTodoData(newPosts);
//       }
//     });
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Realtime Db & Expo</Text>
//       <TextInput
//         placeholder="Item Name"
//         value={itemName}
//         onChangeText={(text) => setItemName(text)}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Brand"
//         value={brand}
//         onChangeText={(text) => setBrand(text)}
//         style={styles.input}
//       />

//       <TextInput
//         placeholder="Stock"
//         value={stock}
//         onChangeText={(text) => setStock(text)}
//         style={styles.input}
//       />
//       <Button title="Search Promotion" onPress={searchPromotion} />


//     </View>
//   );
// };

// export default AddData;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 30,
//     textAlign: 'center',
//     marginTop: 20,
//     fontWeight: 'bold',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: 'black',
//     margin: 10,
//     padding: 10,
//     fontSize: 18,
//     borderRadius: 6,
//   },
// });

