import firebase from 'firebase/compat/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyD1Uafqnox5Y2-PD6p4pVRCHhrBmKKh2Oo",
    authDomain: "shop-ease-17283.firebaseapp.com",
    databaseURL: "https://shop-ease-17283-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "shop-ease-17283",
    storageBucket: "shop-ease-17283.appspot.com",
    messagingSenderId: "561924901123",
    appId: "1:561924901123:web:75f0c5b30cc7131c1dc136",
    measurementId: "G-J01716K39C"
  };

  if(firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig);
  }

  const db = getDatabase()

  export {db}