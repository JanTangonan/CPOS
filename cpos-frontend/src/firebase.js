import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, addDoc, orderBy, limit, Timestamp  } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRZkvDC-7t4K1CYeFK1LPd3jIJdcXRWFU",
  authDomain: "cpos-afc17.firebaseapp.com",
  projectId: "cpos-afc17",
  storageBucket: "cpos-afc17.firebasestorage.app",
  messagingSenderId: "759557425052",
  appId: "1:759557425052:web:44af75d5f31952e33a6a59",
  measurementId: "G-85FX17Z7XN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch product by barcode
const getProductByBarcode = async (barcode) => {
  const productsRef = collection(db, "products");
  const q = query(productsRef, where("barcode", "==", barcode));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data(); // Return first matching product
  }
  return null; // No product found
};

// Function to save sale transaction
const saveSaleToFirestore = async (cartItems, branchID) => {
  try {
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty. Cannot save sale.");
    }

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const now = new Date();
    const options = { timeZone: "Asia/Manila", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true };
    const readableTimestamp = new Intl.DateTimeFormat("en-US", options).format(now);

    const saleData = {
      branchID: branchID || "BR001", // Default or passed branchID
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      timestamp: Date.now(), // Unix timestamp for sorting
      readableTimestamp: readableTimestamp, // Readable timestamp in PHT
      totalAmount: totalAmount.toFixed(2),
      items: cartItems.map((item) => ({
        barcode: item.barcode,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        subtotal: (item.price * item.quantity).toFixed(2),
      })),
    };

    const salesCollection = collection(db, "sales");
    const docRef = await addDoc(salesCollection, saleData);

    console.log("Sale saved to Firestore:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving sale:", error);
    throw error;
  }
};

// Function to fetch the latest transactions
const getLatestTransactions = async (limitCount = 5) => {
  try {
    const transactionsRef = collection(db, "sales");
    const q = query(transactionsRef, orderBy("timestamp", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id, ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching latest transactions:", error);
    return [];
  }
};

// Function to fetch transactions by branch ID
const getTransactionsByBranch = async (branchID) => {
  try {
    const salesCollection = collection(db, "sales");
    const q = query(salesCollection, where("branchID", "==", branchID), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching transactions by branch:", error);
    return [];
  }
};

// Function to fetch transactions by date
const getTransactionsByDate = async (date) => {
  try {
    const salesCollection = collection(db, "sales");

    // Convert the date (YYYY-MM-DD) to a timestamp range
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59

    const q = query(
      salesCollection,
      where("timestamp", ">=", startOfDay.getTime()),
      where("timestamp", "<=", endOfDay.getTime()),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);

    console.log("Number of transactions fetched:", querySnapshot.docs.length);
    
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching transactions by date:", error);
    return [];
  }
};

// Function to fetch transactions by date
const getTransactionsByBranchAndDate = async (branchID, date) => {
  try {
    const salesCollection = collection(db, "sales");

    // Convert the date (YYYY-MM-DD) to a timestamp range
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59

    const q = query(
      salesCollection,
      where("branchID", "==", branchID),
      where("timestamp", ">=", startOfDay.getTime()),
      where("timestamp", "<=", endOfDay.getTime()),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);

    console.log("Number of transactions fetched:", querySnapshot.docs.length);
    
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching transactions by date:", error);
    return [];
  }
};

export {
  db,
  getProductByBarcode,
  saveSaleToFirestore,
  getLatestTransactions,
  getTransactionsByBranch,
  getTransactionsByDate,
  getTransactionsByBranchAndDate
};