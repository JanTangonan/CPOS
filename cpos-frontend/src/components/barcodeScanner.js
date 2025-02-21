import React, { useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { getProductByBarcode, saveSaleToFirestore } from "../firebase";
import "../styles/barcodeScanner.css";

const BarcodeScanner = () => {
  const [scannedProduct, setScannedProduct] = useState(null);
  const [scanner, setScanner] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [manualBarcode, setManualBarcode] = useState("");
  const [checkoutModal, setCheckoutModal] = useState(false);

  const startScanner = () => {
    if (!scanner) {
      const newScanner = new Html5QrcodeScanner("reader", { fps: 15, qrbox: 250 });
      setScanner(newScanner);
      newScanner.render((decodedText) => onScanSuccess(decodedText, newScanner));
    }
  };

  const onScanSuccess = async (decodedText, currentScanner) => {
    console.log("Scanned Barcode:", decodedText);
    await handleProductLookup(decodedText);

    const product = await getProductByBarcode(decodedText);
    if (product) {
      setScannedProduct(product);
      addToCart(product, decodedText);
    } else {
      alert("Product not found in database!");
    }

    if (currentScanner) {
      try {
        await currentScanner.clear();
        setScanner(null);
      } catch (error) {
        console.error("Error clearing scanner:", error);
      }
    }
  };

  const handleProductLookup = async (barcode) => {
    const product = await getProductByBarcode(barcode);
    if (product) {
      addToCart(product, barcode);
    } else {
      alert("Product not found in database!");
    }
  };

  const addToCart = (product, barcode) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item.barcode === barcode);
      if (existingItem) {
        return prevCart.map((item) =>
          item.barcode === barcode ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, barcode, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (barcode, amount) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.barcode === barcode
          ? { ...item, quantity: Math.max(item.quantity + amount, 1) }
          : item
      )
    );
  };

  const removeFromCart = (barcode) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.barcode !== barcode));
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleManualEntry = async () => {
    if (manualBarcode.trim() !== "") {
      await handleProductLookup(manualBarcode.trim());
      setManualBarcode("");
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Cart is empty. Please add products first.");
      return;
    }

    try {
      const branchID = "BR001"; // This should be dynamically set if needed
      await saveSaleToFirestore(cartItems, branchID);
  
      alert("Checkout successful! Sale has been recorded.");
      setCartItems([]);  
      setCheckoutModal(false);  
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to record sale. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>📷 Scan a Product</h2>
      <button className="button" onClick={startScanner}>Start Scanner</button>
      <div id="reader"></div>

      {scannedProduct && (
        <div className="card">
          <h3>Scanned Product</h3>
          <p><strong>Barcode:</strong> {scannedProduct.barcode}</p>
          <p><strong>Name:</strong> {scannedProduct.productName}</p>
          <p><strong>Price:</strong> PHP {scannedProduct.price}</p>
          <p><strong>Stock:</strong> {scannedProduct.stockQuantity}</p>
        </div>
      )}

      <h2>🛒 Virtual Cart</h2>
      <div className="cart-container">
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item) => (
              <div className="cart-item" key={item.barcode}>
                <span>{item.productName} ({item.quantity})</span>
                <span>PHP {item.price * item.quantity}</span>
                <button className="button" onClick={() => updateQuantity(item.barcode, -1)}>-</button>
                <button className="button" onClick={() => updateQuantity(item.barcode, 1)}>+</button>
                <button className="button" onClick={() => removeFromCart(item.barcode)}>Remove</button>
              </div>
            ))}
            <div className="cart-total">Total: PHP {calculateTotal()}</div>
            <button className="button" onClick={() => setCheckoutModal(true)}>Checkout</button>
          </>
        ) : (
          <p>Cart is empty</p>
        )}
      </div>

      <h2>📌 Manual Barcode Entry</h2>
      <input className="input-barcode" type="text" placeholder="Enter barcode" value={manualBarcode} onChange={(e) => setManualBarcode(e.target.value)} />
      <button className="button" onClick={() => addToCart({ productName: "Manual Product", price: 100 }, manualBarcode)}>Add Product</button>

      {checkoutModal && (
        <div className="modal">
          <h3>Confirm Checkout</h3>
          <p>Total: PHP {calculateTotal()}</p>
          <button className="button" onClick={handleCheckout}>Confirm</button>
          <button className="button" onClick={() => setCheckoutModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
