import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Button, TouchableOpacity } from 'react-native';
import { db } from '../config';
import { ref, onValue } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';

interface CartItem {
  id: string;
  itemName: string;
  price: number;
  stock: string;
  brand: string;
  discount: number;
  quantity: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  // Fetch cart data from Firebase
  useEffect(() => {
    const cartRef = ref(db, 'userCart/');
    onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedCart = Object.values(data).flatMap((cart) => cart.items);
        setCartItems(fetchedCart);

        // Calculate total price
        const totalPrice = fetchedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(totalPrice);
      }
    });
  }, []);

  // Handle removing items from the cart
  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Handle increasing/decreasing quantity
  const updateQuantity = (id: string, type: 'increase' | 'decrease') => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: type === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.cartTableContainer}>
          <Text style={styles.header}>Cart</Text>
          <ScrollView>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.tableHeaderItemName]}>Product Name</Text>
                <Text style={styles.tableHeaderText}>Price</Text>
                <Text style={styles.tableHeaderText}>Qty</Text>
                <Text style={styles.tableHeaderText}>Discount</Text>
                <Text style={styles.tableHeaderText}>Total</Text>
                <Text style={styles.tableHeaderText}>Action</Text>
              </View>
              {cartItems.length === 0 ? (
                <Text style={styles.emptyText}>Your cart is empty</Text>
              ) : (
                cartItems.map((item) => (
                  <View key={item.id} style={styles.tableRow}>
                    <Text style={[styles.tableRowText, styles.tableRowItemName]}>{item.itemName}</Text>
                    <Text style={styles.tableRowText}>Rs. {item.price}</Text>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity onPress={() => updateQuantity(item.id, 'decrease')}>
                        <Ionicons name="remove-circle" size={24} color="red" />
                      </TouchableOpacity>
                      <Text style={styles.tableRowText}>{item.quantity}</Text>
                      <TouchableOpacity onPress={() => updateQuantity(item.id, 'increase')}>
                        <Ionicons name="add-circle" size={24} color="green" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.tableRowText}>Rs. {item.discount || 0}</Text>
                    <Text style={styles.tableRowText}>Rs. {item.price * item.quantity - item.discount}</Text>
                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                      <Ionicons name="trash" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        </View>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Item Count: {cartItems.length}</Text>
          <Text style={styles.summaryText}>Subtotal: Rs. {total}</Text>
          <Text style={styles.summaryText}>Discounts: Rs. {cartItems.reduce((sum, item) => sum + item.discount, 0)}</Text>
          <Text style={styles.summaryText}>Total: Rs. {total - cartItems.reduce((sum, item) => sum + item.discount, 0)}</Text>
          <Button title="Proceed to Checkout" onPress={() => alert('Proceed to checkout')} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  cartTableContainer: {
    flex: 2,
    marginRight: 20,
  },
  summaryContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 5,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Center align text
  },
  tableHeaderItemName: {
    width: '30%',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 5,
  },
  tableRowText: {
    fontSize: 16,
    textAlign: 'center', // Center align text
  },
  tableRowItemName: {
    width: '30%',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '20%',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Cart;
