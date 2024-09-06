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
  price: string;
}

const AddData = () => {
  const [itemName, setItemName] = useState('');
  const [stock, setStock] = useState('');
  const [brand, setBrand] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');
  const [todoData, setTodoData] = useState<Post[]>([]);

  const hardcodedData = [
    { "itemName": "Apple", "brand": "Fresh Picks", "stock": "100", "weight": "500 g", "price": "250 LKR" },

    { "itemName": "Carrots", "brand": "Fresh Picks", "stock": "150", "weight": "500 g", "price": "150 LKR" },
    { "itemName": "Carrots", "brand": "Organic Harvest", "stock": "200", "weight": "500 g", "price": "180 LKR" },
    { "itemName": "Carrots", "brand": "Farm Fresh", "stock": "180", "weight": "500 g", "price": "170 LKR" },
    
    { "itemName": "Tomatoes", "brand": "Fresh Picks", "stock": "100", "weight": "1 kg", "price": "220 LKR" },
    { "itemName": "Tomatoes", "brand": "Nature’s Best", "stock": "120", "weight": "1 kg", "price": "250 LKR" },
    { "itemName": "Tomatoes", "brand": "Green Valley", "stock": "150", "weight": "1 kg", "price": "240 LKR" },

    { "itemName": "Spinach", "brand": "Organic Harvest", "stock": "80", "weight": "200 g", "price": "100 LKR" },
    { "itemName": "Spinach", "brand": "Farm Fresh", "stock": "60", "weight": "200 g", "price": "90 LKR" },
    { "itemName": "Spinach", "brand": "Green Valley", "stock": "90", "weight": "200 g", "price": "110 LKR" },

    { "itemName": "Potatoes", "brand": "Fresh Picks", "stock": "70", "weight": "1 kg", "price": "280 LKR" },
    { "itemName": "Potatoes", "brand": "Farm Fresh", "stock": "65", "weight": "1 kg", "price": "300 LKR" },
    { "itemName": "Potatoes", "brand": "Organic Harvest", "stock": "85", "weight": "1 kg", "price": "290 LKR" },

    { "itemName": "Bell Peppers", "brand": "Green Valley", "stock": "110", "weight": "500 g", "price": "185 LKR" },
    { "itemName": "Bell Peppers", "brand": "Fresh Picks", "stock": "95", "weight": "500 g", "price": "180 LKR" },
    { "itemName": "Bell Peppers", "brand": "Organic Harvest", "stock": "120", "weight": "500 g", "price": "190 LKR" },

    { "itemName": "Apples", "brand": "Fresh Picks", "stock": "150", "weight": "1 kg", "price": "350 LKR" },
    { "itemName": "Apples", "brand": "Organic Harvest", "stock": "200", "weight": "1 kg", "price": "380 LKR" },
    { "itemName": "Apples", "brand": "Farm Fresh", "stock": "180", "weight": "1 kg", "price": "370 LKR" },

    { "itemName": "Oranges", "brand": "Fresh Picks", "stock": "100", "weight": "1 kg", "price": "320 LKR" },
    { "itemName": "Oranges", "brand": "Nature’s Best", "stock": "120", "weight": "1 kg", "price": "350 LKR" },
    { "itemName": "Oranges", "brand": "Green Valley", "stock": "150", "weight": "1 kg", "price": "340 LKR" },

    { "itemName": "Bananas", "brand": "Organic Harvest", "stock": "80", "weight": "1 kg", "price": "150 LKR" },
    { "itemName": "Bananas", "brand": "Farm Fresh", "stock": "60", "weight": "1 kg", "price": "140 LKR" },
    { "itemName": "Bananas", "brand": "Green Valley", "stock": "90", "weight": "1 kg", "price": "160 LKR" },

    { "itemName": "Mangoes", "brand": "Fresh Picks", "stock": "70", "weight": "1 kg", "price": "300 LKR" },
    { "itemName": "Mangoes", "brand": "Farm Fresh", "stock": "65", "weight": "1 kg", "price": "320 LKR" },
    { "itemName": "Mangoes", "brand": "Organic Harvest", "stock": "85", "weight": "1 kg", "price": "310 LKR" },

    { "itemName": "Grapes", "brand": "Green Valley", "stock": "110", "weight": "500 g", "price": "250 LKR" },
    { "itemName": "Grapes", "brand": "Fresh Picks", "stock": "95", "weight": "500 g", "price": "240 LKR" },
    { "itemName": "Grapes", "brand": "Organic Harvest", "stock": "120", "weight": "500 g", "price": "260 LKR" },
    
    
    { "itemName": "Chicken Breast", "brand": "Keells", "stock": "120", "weight": "1 kg", "price": "1600 LKR" },
    { "itemName": "Chicken Breast", "brand": "Cargills", "stock": "150", "weight": "1 kg", "price": "1550 LKR" },
    { "itemName": "Chicken Breast", "brand": "Laugfs", "stock": "100", "weight": "1 kg", "price": "1580 LKR" },
    { "itemName": "Beef Steak", "brand": "Keells", "stock": "80", "weight": "500 g", "price": "2200 LKR" },
    { "itemName": "Beef Steak", "brand": "Cargills", "stock": "100", "weight": "500 g", "price": "2150 LKR" },
    { "itemName": "Beef Steak", "brand": "Laugfs", "stock": "70", "weight": "500 g", "price": "2180 LKR" },
    { "itemName": "Pork Chops", "brand": "Keells", "stock": "60", "weight": "1 kg", "price": "1800 LKR" },
    { "itemName": "Pork Chops", "brand": "Cargills", "stock": "90", "weight": "1 kg", "price": "1750 LKR" },
    { "itemName": "Pork Chops", "brand": "Laugfs", "stock": "80", "weight": "1 kg", "price": "1780 LKR" },
    { "itemName": "Mutton", "brand": "Keells", "stock": "50", "weight": "1 kg", "price": "3000 LKR" },
    { "itemName": "Mutton", "brand": "Cargills", "stock": "70", "weight": "1 kg", "price": "2950 LKR" },
    { "itemName": "Mutton", "brand": "Laugfs", "stock": "60", "weight": "1 kg", "price": "2980 LKR" },
    { "itemName": "Turkey Breast", "brand": "Keells", "stock": "40", "weight": "1 kg", "price": "2500 LKR" },
    { "itemName": "Turkey Breast", "brand": "Cargills", "stock": "30", "weight": "1 kg", "price": "2450 LKR" },
    { "itemName": "Turkey Breast", "brand": "Laugfs", "stock": "35", "weight": "1 kg", "price": "2480 LKR" },
    { "itemName": "Salmon", "brand": "Keells", "stock": "90", "weight": "500 g", "price": "2600 LKR" },
    { "itemName": "Salmon", "brand": "Cargills", "stock": "100", "weight": "500 g", "price": "2550 LKR" },
    { "itemName": "Salmon", "brand": "Laugfs", "stock": "80", "weight": "500 g", "price": "2580 LKR" },
    { "itemName": "Tuna", "brand": "Keells", "stock": "120", "weight": "1 kg", "price": "1500 LKR" },
    { "itemName": "Tuna", "brand": "Cargills", "stock": "150", "weight": "1 kg", "price": "1450 LKR" },
    { "itemName": "Tuna", "brand": "Laugfs", "stock": "110", "weight": "1 kg", "price": "1480 LKR" },
    { "itemName": "Mackerel", "brand": "Keells", "stock": "60", "weight": "1 kg", "price": "1400 LKR" },
    { "itemName": "Mackerel", "brand": "Cargills", "stock": "70", "weight": "1 kg", "price": "1350 LKR" },
    { "itemName": "Mackerel", "brand": "Laugfs", "stock": "50", "weight": "1 kg", "price": "1380 LKR" },
    { "itemName": "Prawns", "brand": "Keells", "stock": "80", "weight": "500 g", "price": "1800 LKR" },
    { "itemName": "Prawns", "brand": "Cargills", "stock": "100", "weight": "500 g", "price": "1750 LKR" },
    { "itemName": "Prawns", "brand": "Laugfs", "stock": "90", "weight": "500 g", "price": "1780 LKR" },
    { "itemName": "Crab", "brand": "Keells", "stock": "40", "weight": "500 g", "price": "2400 LKR" },
    { "itemName": "Crab", "brand": "Cargills", "stock": "60", "weight": "500 g", "price": "2350 LKR" },
    { "itemName": "Crab", "brand": "Laugfs", "stock": "50", "weight": "500 g", "price": "2380 LKR" },


    { "itemName": "Orange Juice", "brand": "Elephant House", "stock": "200", "weight": "1 liter", "price": "450 LKR" },
    { "itemName": "Orange Juice", "brand": "MD", "stock": "180", "weight": "1 liter", "price": "420 LKR" },
    { "itemName": "Orange Juice", "brand": "Cargills", "stock": "210", "weight": "1 liter", "price": "430 LKR" },
    { "itemName": "Green Tea", "brand": "Dilmah", "stock": "150", "weight": "100 g", "price": "600 LKR" },
    { "itemName": "Green Tea", "brand": "Lipton", "stock": "130", "weight": "100 g", "price": "550 LKR" },
    { "itemName": "Green Tea", "brand": "Twinings", "stock": "140", "weight": "100 g", "price": "650 LKR" },
    { "itemName": "Coffee Beans", "brand": "Nescafe", "stock": "110", "weight": "250 g", "price": "800 LKR" },
    { "itemName": "Coffee Beans", "brand": "Starbucks", "stock": "130", "weight": "250 g", "price": "1000 LKR" },
    { "itemName": "Coffee Beans", "brand": "Lavazza", "stock": "120", "weight": "250 g", "price": "950 LKR" },
    { "itemName": "Rice", "brand": "Maha", "stock": "150", "weight": "5 kg", "price": "700 LKR" },
    { "itemName": "Rice", "brand": "Shan", "stock": "120", "weight": "5 kg", "price": "680 LKR" },
    { "itemName": "Rice", "brand": "Sun", "stock": "130", "weight": "5 kg", "price": "720 LKR" },
    { "itemName": "Flour", "brand": "Golden Flour", "stock": "200", "weight": "1 kg", "price": "150 LKR" },
    { "itemName": "Flour", "brand": "Harvest", "stock": "180", "weight": "1 kg", "price": "140 LKR" },
    { "itemName": "Flour", "brand": "Pure", "stock": "190", "weight": "1 kg", "price": "160 LKR" },
    { "itemName": "Sugar", "brand": "White", "stock": "170", "weight": "1 kg", "price": "120 LKR" },
    { "itemName": "Sugar", "brand": "Brown", "stock": "160", "weight": "1 kg", "price": "110 LKR" },
    { "itemName": "Sugar", "brand": "Raw", "stock": "150", "weight": "1 kg", "price": "130 LKR" },
    { "itemName": "Salt", "brand": "Sea Salt", "stock": "220", "weight": "500 g", "price": "60 LKR" },
    { "itemName": "Salt", "brand": "Table Salt", "stock": "210", "weight": "500 g", "price": "50 LKR" },
    { "itemName": "Salt", "brand": "Himalayan Salt", "stock": "230", "weight": "500 g", "price": "150 LKR" },
    { "itemName": "Butter", "brand": "Dairy", "stock": "140", "weight": "250 g", "price": "550 LKR" },
    { "itemName": "Butter", "brand": "Farm", "stock": "120", "weight": "250 g", "price": "500 LKR" },
    { "itemName": "Butter", "brand": "Organic", "stock": "130", "weight": "250 g", "price": "600 LKR" },
    { "itemName": "Cheese", "brand": "Cheddar", "stock": "90", "weight": "200 g", "price": "400 LKR" },
    { "itemName": "Cheese", "brand": "Mozzarella", "stock": "100", "weight": "200 g", "price": "450 LKR" },
    { "itemName": "Cheese", "brand": "Parmesan", "stock": "110", "weight": "200 g", "price": "500 LKR" },
    { "itemName": "Milk", "brand": "Full Cream", "stock": "150", "weight": "1 liter", "price": "200 LKR" },
    { "itemName": "Milk", "brand": "Skimmed", "stock": "120", "weight": "1 liter", "price": "180 LKR" },
    { "itemName": "Milk", "brand": "Soy", "stock": "130", "weight": "1 liter", "price": "220 LKR" },
    { "itemName": "Yogurt", "brand": "Greek", "stock": "70", "weight": "500 g", "price": "300 LKR" },
    { "itemName": "Yogurt", "brand": "Regular", "stock": "80", "weight": "500 g", "price": "280 LKR" },
    { "itemName": "Yogurt", "brand": "Low Fat", "stock": "90", "weight": "500 g", "price": "320 LKR" },
    { "itemName": "Juice", "brand": "Apple", "stock": "180", "weight": "1 liter", "price": "450 LKR" },
    { "itemName": "Juice", "brand": "Grape", "stock": "150", "weight": "1 liter", "price": "500 LKR" },
    { "itemName": "Juice", "brand": "Pineapple", "stock": "160", "weight": "1 liter", "price": "480 LKR" },
       
    { "itemName": "Ice Cream", "brand": "Elephant House", "stock": "150", "weight": "1 liter", "price": "600 LKR" },
    { "itemName": "Ice Cream", "brand": "Cargills Magic", "stock": "120", "weight": "1 liter", "price": "550 LKR" },
    { "itemName": "Ice Cream", "brand": "Baskin Robbins", "stock": "100", "weight": "1 liter", "price": "1200 LKR" }, 
    { "itemName": "Milk", "brand": "Anchor", "stock": "200", "weight": "1 liter", "price": "350 LKR" },
    { "itemName": "Milk", "brand": "Pelwatte", "stock": "180", "weight": "1 liter", "price": "330 LKR" },
    { "itemName": "Milk", "brand": "Kotmale", "stock": "150", "weight": "1 liter", "price": "320 LKR" },
    { "itemName": "Chicken Nuggets", "brand": "Keells", "stock": "120", "weight": "500 g", "price": "750 LKR" },
    { "itemName": "Chicken Nuggets", "brand": "Cargills", "stock": "150", "weight": "500 g", "price": "700 LKR" },
    { "itemName": "Chicken Nuggets", "brand": "McCain", "stock": "100", "weight": "500 g", "price": "800 LKR" },
    { "itemName": "Frozen Peas", "brand": "Harischandra", "stock": "80", "weight": "500 g", "price": "320 LKR" },
    { "itemName": "Frozen Peas", "brand": "Keells", "stock": "100", "weight": "500 g", "price": "350 LKR" },
    { "itemName": "Frozen Peas", "brand": "Cargills", "stock": "70", "weight": "500 g", "price": "300 LKR" },
    { "itemName": "French Fries", "brand": "McCain", "stock": "60", "weight": "1 kg", "price": "950 LKR" },
    { "itemName": "French Fries", "brand": "Keells", "stock": "90", "weight": "1 kg", "price": "900 LKR" },
    { "itemName": "French Fries", "brand": "Cargills", "stock": "80", "weight": "1 kg", "price": "880 LKR" },
    { "itemName": "Fish Fingers", "brand": "Keells", "stock": "50", "weight": "500 g", "price": "700 LKR" },
    { "itemName": "Fish Fingers", "brand": "Cargills", "stock": "70", "weight": "500 g", "price": "750 LKR" },
    { "itemName": "Fish Fingers", "brand": "McCain", "stock": "60", "weight": "500 g", "price": "780 LKR" },
    { "itemName": "Pizza", "brand": "Domino’s", "stock": "40", "weight": "400 g", "price": "1100 LKR" },
    { "itemName": "Pizza", "brand": "Pizza Hut", "stock": "30", "weight": "400 g", "price": "1050 LKR" },
    { "itemName": "Pizza", "brand": "Cargills", "stock": "35", "weight": "400 g", "price": "950 LKR" },
    
    { "itemName": "Rice", "brand": "Araliya", "stock": "200", "weight": "1 kg", "price": "180 LKR" },
    { "itemName": "Rice", "brand": "Nipuna", "stock": "180", "weight": "1 kg", "price": "190 LKR" },
    { "itemName": "Rice", "brand": "Keells", "stock": "220", "weight": "1 kg", "price": "200 LKR" },
    { "itemName": "Noodles", "brand": "Maggi", "stock": "150", "weight": "200 g", "price": "120 LKR" },
    { "itemName": "Noodles", "brand": "Prima", "stock": "170", "weight": "200 g", "price": "110 LKR" },
    { "itemName": "Noodles", "brand": "Elephant House", "stock": "160", "weight": "200 g", "price": "130 LKR" },
    { "itemName": "Biscuits", "brand": "Munchee", "stock": "300", "weight": "200 g", "price": "180 LKR" },
    { "itemName": "Biscuits", "brand": "Maliban", "stock": "280", "weight": "200 g", "price": "170 LKR" },
    { "itemName": "Biscuits", "brand": "Ritzbury", "stock": "260", "weight": "200 g", "price": "160 LKR" },
    { "itemName": "Spices", "brand": "MD", "stock": "100", "weight": "50 g", "price": "90 LKR" },
    { "itemName": "Spices", "brand": "Harischandra", "stock": "120", "weight": "50 g", "price": "85 LKR" },
    { "itemName": "Spices", "brand": "Ruhunu", "stock": "150", "weight": "50 g", "price": "80 LKR" },
    { "itemName": "Flour", "brand": "Prima", "stock": "220", "weight": "1 kg", "price": "150 LKR" },
    { "itemName": "Flour", "brand": "Harischandra", "stock": "200", "weight": "1 kg", "price": "140 LKR" },
    { "itemName": "Flour", "brand": "Elephant House", "stock": "190", "weight": "1 kg", "price": "145 LKR" },
    
    
      { "itemName": "Plates", "brand": "Noritake", "stock": "150", "weight": "Standard", "price": "450 LKR" },
      { "itemName": "Plates", "brand": "Dankotuwa", "stock": "120", "weight": "Standard", "price": "400 LKR" },
      { "itemName": "Plates", "brand": "Lanka Ceramic", "stock": "100", "weight": "Standard", "price": "350 LKR" },
      { "itemName": "Cups", "brand": "Noritake", "stock": "200", "weight": "Standard", "price": "250 LKR" },
      { "itemName": "Cups", "brand": "Dankotuwa", "stock": "180", "weight": "Standard", "price": "230 LKR" },
      { "itemName": "Cups", "brand": "Lanka Ceramic", "stock": "150", "weight": "Standard", "price": "220 LKR" },
      { "itemName": "Cutlery Set", "brand": "Arpico", "stock": "100", "weight": "24 Pieces", "price": "1200 LKR" },
      { "itemName": "Cutlery Set", "brand": "Keells", "stock": "120", "weight": "24 Pieces", "price": "1100 LKR" },
      { "itemName": "Cutlery Set", "brand": "Cargills", "stock": "90", "weight": "24 Pieces", "price": "1000 LKR" },
      { "itemName": "Kitchen Towels", "brand": "Arpico", "stock": "70", "weight": "2 Pieces", "price": "200 LKR" },
      { "itemName": "Kitchen Towels", "brand": "Keells", "stock": "60", "weight": "2 Pieces", "price": "180 LKR" },
      { "itemName": "Kitchen Towels", "brand": "Cargills", "stock": "85", "weight": "2 Pieces", "price": "170 LKR" },
      { "itemName": "Pots & Pans", "brand": "Meyer", "stock": "50", "weight": "Standard", "price": "3500 LKR" },
      { "itemName": "Pots & Pans", "brand": "Prestige", "stock": "70", "weight": "Standard", "price": "3000 LKR" },
      { "itemName": "Pots & Pans", "brand": "Tefal", "stock": "60", "weight": "Standard", "price": "3200 LKR" },
      { "itemName": "Dishwashing Liquid", "brand": "Sunlight", "stock": "300", "weight": "500 ml", "price": "250 LKR" },
      { "itemName": "Dishwashing Liquid", "brand": "Vim", "stock": "280", "weight": "500 ml", "price": "240 LKR" },
      { "itemName": "Dishwashing Liquid", "brand": "Cif", "stock": "260", "weight": "500 ml", "price": "230 LKR" },
      { "itemName": "Laundry Detergent", "brand": "Ariel", "stock": "400", "weight": "1 kg", "price": "850 LKR" },
      { "itemName": "Laundry Detergent", "brand": "Surf Excel", "stock": "380", "weight": "1 kg", "price": "800 LKR" },
      { "itemName": "Laundry Detergent", "brand": "Rin", "stock": "360", "weight": "1 kg", "price": "750 LKR" },
      { "itemName": "Floor Cleaner", "brand": "Harpic", "stock": "500", "weight": "1 liter", "price": "300 LKR" },
      { "itemName": "Floor Cleaner", "brand": "Muscle", "stock": "480", "weight": "1 liter", "price": "280 LKR" },
      { "itemName": "Floor Cleaner", "brand": "Domex", "stock": "460", "weight": "1 liter", "price": "270 LKR" },
      { "itemName": "Toilet Cleaner", "brand": "Harpic", "stock": "220", "weight": "500 ml", "price": "200 LKR" },
      { "itemName": "Toilet Cleaner", "brand": "Domex", "stock": "200", "weight": "500 ml", "price": "190 LKR" },
      { "itemName": "Toilet Cleaner", "brand": "Muscle", "stock": "190", "weight": "500 ml", "price": "180 LKR" },
  
      { "itemName": "Turmeric", "brand": "MD", "stock": "80", "weight": "50 g", "price": "150 LKR" },
      { "itemName": "Turmeric", "brand": "Harischandra", "stock": "90", "weight": "50 g", "price": "140 LKR" },
      { "itemName": "Chili Powder", "brand": "MD", "stock": "100", "weight": "50 g", "price": "160 LKR" },
      { "itemName": "Chili Powder", "brand": "Harischandra", "stock": "120", "weight": "50 g", "price": "150 LKR" },
      { "itemName": "Pepper", "brand": "MD", "stock": "70", "weight": "50 g", "price": "180 LKR" },
      { "itemName": "Pepper", "brand": "Harischandra", "stock": "85", "weight": "50 g", "price": "170 LKR" },
      { "itemName": "Garlic Powder", "brand": "MD", "stock": "60", "weight": "50 g", "price": "200 LKR" },
      { "itemName": "Garlic Powder", "brand": "Harischandra", "stock": "70", "weight": "50 g", "price": "190 LKR" },
      { "itemName": "Cinnamon", "brand": "MD", "stock": "50", "weight": "50 g", "price": "250 LKR" },
      { "itemName": "Cinnamon", "brand": "Harischandra", "stock": "60", "weight": "50 g", "price": "240 LKR" },
      { "itemName": "Chocolate Biscuit", "brand": "Munchee", "stock": "300", "weight": "200 g", "price": "450 LKR" },
      { "itemName": "Chocolate Biscuit", "brand": "Maliban", "stock": "280", "weight": "200 g", "price": "440 LKR" },
      { "itemName": "Hawaiian Cookies", "brand": "Ritzbury", "stock": "260", "weight": "200 g", "price": "430 LKR" },
      { "itemName": "Lemon Puff", "brand": "Munchee", "stock": "220", "weight": "200 g", "price": "400 LKR" },
      { "itemName": "Mari", "brand": "Maliban", "stock": "240", "weight": "200 g", "price": "380 LKR" },
      { "itemName": "Nice", "brand": "Ritzbury", "stock": "230", "weight": "200 g", "price": "390 LKR" },
      { "itemName": "Necto", "brand": "Elephant House", "stock": "150", "weight": "500 ml", "price": "120 LKR" },
      { "itemName": "Mirinda", "brand": "Pepsi", "stock": "120", "weight": "500 ml", "price": "110 LKR" },
      { "itemName": "Sprite", "brand": "Coca-Cola", "stock": "100", "weight": "500 ml", "price": "130 LKR" },
      { "itemName": "Pepsi", "brand": "Pepsi", "stock": "110", "weight": "500 ml", "price": "115 LKR" },
      { "itemName": "Coca-Cola", "brand": "Coca-Cola", "stock": "130", "weight": "500 ml", "price": "135 LKR" }      
  


  ];
  

  const addHardcodedData = () => {
    hardcodedData.forEach((product) => {
      const uniqueKey = `${product.itemName}_${product.brand}`;
      set(ref(db, 'items/' + uniqueKey), {
        itemName: product.itemName,
        stock: product.stock,
        brand: product.brand,
        weight: product.weight,
        price: product.price,
      }).catch(error => console.error("Error adding data: ", error));
    });
  };


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
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={(text) => setPrice(text)}
        style={styles.input}
      />
      <Button title="Add Data" onPress={addHardcodedData} />
      {/* Uncomment below to see data for checking */}
      {/* {todoData.map((item) => (
        <View key={item.id}>
          <Text>{item.itemName}</Text>
          <Text>{item.stock}</Text>
          <Text>{item.brand}</Text>
          <Text>{item.weight}</Text>
          <Text>{item.price}</Text>
        </View>
      ))} */}
    </View>
  );
};

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

export default AddData;