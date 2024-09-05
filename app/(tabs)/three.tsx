import { StyleSheet, TextInput, Button, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../config';
import { ref, set, onValue, push } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface Post {
  id: string;
  itemName: string;
  discount?: string;
  promotion?: string;
  stock: string;
  brand: string;
  quantity?: number; // Add quantity to Post interface
}

const AddData = () => {
  const [itemName, setItemName] = useState('');
  const [stock, setStock] = useState('');
  const [brand, setBrand] = useState('');
  const [todoData, setTodoData] = useState<Post[]>([]);
  const [cartItems, setCartItems] = useState<Post[]>([]);

  const navigation = useNavigation();

  // Function to add items to Firebase database
  const dataAddOn = () => {
    const uniqueKey = `${itemName}_${brand}`.replace(/[.#$/[\]]/g, '_');
    set(ref(db, 'items/' + uniqueKey), {
      itemName: itemName,
      stock: stock,
      brand: brand,
    });
    setItemName('');
    setStock('');
    setBrand('');
  };

  // Listen for changes in items stored in the database
  useEffect(() => {
    const starCountRef = ref(db, 'items/');
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
  }, []);

  // Function to handle adding items to cart
  const handleAddToCart = (item: Post) => {
    const itemExists = cartItems.find((cartItem) => cartItem.id === item.id);
    if (!itemExists) {
      setCartItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]);
    }
  };

  // Function to handle increasing the quantity
  const increaseQuantity = (item: Post) => {
    setCartItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: (cartItem.quantity || 0) + 1 }
          : cartItem
      )
    );
  };

  // Function to handle decreasing the quantity
  const decreaseQuantity = (item: Post) => {
    setCartItems((prevItems) =>
      prevItems
        .map((cartItem) =>
          cartItem.id === item.id && cartItem.quantity! > 1
            ? { ...cartItem, quantity: cartItem.quantity! - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity! > 0)
    );
  };

  // Save the entire cart to Firebase
  const saveCart = () => {
    if (cartItems.length > 0) {
      const cartRef = push(ref(db, 'userCart/'));
      set(cartRef, {
        items: cartItems,
        createdAt: new Date().toISOString(),
      })
        .then(() => {
          setCartItems([]); // Clear cart items after saving
          navigation.navigate('cart'); // Navigate to Cart screen
        })
        .catch((error) => {
          console.error("Error saving cart:", error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Realtime Db & Expo</Text>
        <TouchableOpacity onPress={saveCart} style={styles.cartIcon}>
          <Ionicons name="cart" size={30} color="black" />
          {cartItems.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <Text style={styles.header}>Available Items</Text>
      <ScrollView>
        {todoData.map((item) => {
          const inCart = cartItems.find((cartItem) => cartItem.id === item.id);
          return (
            <View key={item.id} style={styles.itemContainer}>
              <Text style={styles.itemText}>Item: {item.itemName}</Text>
              <Text style={styles.itemText}>Stock: {item.stock}</Text>
              <Text style={styles.itemText}>Brand: {item.brand}</Text>
              {item.discount && <Text style={styles.itemText}>Discount: {item.discount}</Text>}
              {item.promotion && <Text style={styles.itemText}>Promotion: {item.promotion}</Text>}
              {!inCart ? (
                <TouchableOpacity style={styles.cartButton} onPress={() => handleAddToCart(item)}>
                  <Text style={styles.cartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.quantitySelector}>
                  <TouchableOpacity onPress={() => decreaseQuantity(item)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{inCart.quantity}</Text>
                  <TouchableOpacity onPress={() => increaseQuantity(item)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
      {cartItems.length > 0 && (
        <Button title="Save Cart" onPress={saveCart} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cartIcon: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 2,
    paddingHorizontal: 5,
  },
  cartBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  itemText: {
    fontSize: 18,
    marginBottom: 5,
  },
  cartButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
});

export default AddData;
