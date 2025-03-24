import React, { useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { getProductByBarcode, saveSaleToFirestore } from "../firebase";
import "../styles/barcodeScanner.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


const BarcodeScanner = () => {
  const [scannedProduct, setScannedProduct] = useState(null);
  const [scanner, setScanner] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [manualBarcode, setManualBarcode] = useState("");
  const [checkoutModal, setCheckoutModal] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, type = "info") => {
    toast(message, {
      type, // "success", "error", "info", "warning"
      position: "top-right",
      autoClose: 3000, // Closes after 3s
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored", // Options: light, dark, colored
    });
  };

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
      setScannedProduct(product);
      addToCart(product, barcode);
      showToast(`Product Added: ${product.productName}`, "success");
    } else {
      showToast("Product not found in database!", "error");
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
      const branchID = "BR002"; // This should be dynamically set if needed
      await saveSaleToFirestore(cartItems, branchID);

      showToast("Checkout successful! Sale recorded.", "success");
      setCartItems([]);
      setCheckoutModal(false);
    } catch (error) {
      console.error("Checkout error:", error);
      showToast("Failed to record sale. Please try again.", "error");
    }
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-primary mb-3" onClick={() => navigate("/landingpage")}>
        ← Back to Home
      </button>

      <h1>Clinic POS - Barcode Scanner</h1>
      {/* Toast Notification */}
      <ToastContainer />

      {/* Scanner Section */}
      <div className="card p-3">
        <h2>Scan a Product</h2>
        <button className="btn btn-light mt-2" onClick={startScanner}>
          Start Scanner
        </button>
        <div id="reader" className="mt-3 border p-2 rounded"></div>
      </div>

      {/* Scanned Product */}
      {scannedProduct && (
        <div className="card p-3 mt-3">
          <h3>Scanned Product</h3>
          <p><strong>Barcode:</strong> {scannedProduct.barcode}</p>
          <p><strong>Name:</strong> {scannedProduct.productName}</p>
          <p><strong>Price:</strong> PHP {scannedProduct.price}</p>
          <p><strong>Stock:</strong> {scannedProduct.stockQuantity}</p>
        </div>
      )}

      {/* Virtual Cart */}
      <div className="card p-3 mt-3">
        <h2>Virtual Cart</h2>
        {cartItems.length > 0 ? (
          <>
            <ul className="list-group">
              {cartItems.map((item) => (
                <li key={item.barcode} className="list-group-item d-flex justify-content-between align-items-center">
                  {item.productName} - PHP {item.price}
                  <div>
                    <button className="btn btn-sm btn-secondary me-1" onClick={() => updateQuantity(item.barcode, -1)}>-</button>
                    {item.quantity}
                    <button className="btn btn-sm btn-secondary ms-1" onClick={() => updateQuantity(item.barcode, 1)}>+</button>
                    <button className="btn btn-sm btn-danger ms-2" onClick={() => removeFromCart(item.barcode)}>🗑</button>
                  </div>
                </li>
              ))}
            </ul>
            <h3 className="mt-3">Total: PHP {calculateTotal()}</h3>
            <button className="btn btn-success w-100 mt-2" onClick={() => setCheckoutModal(true)}>Checkout</button>
          </>
        ) : (
          <p className="text-muted text-center">Cart is empty</p>
        )}
      </div>

      {/* Manual Barcode Entry */}
      <div className="card p-3 mt-3">
        <h2> Manual Barcode Entry</h2>
        <div className="input-group">
          <input type="text" className="form-control" value={manualBarcode} onChange={(e) => setManualBarcode(e.target.value)} placeholder="Enter barcode manually" />
          <button className="btn btn-primary" onClick={handleManualEntry}>Add</button>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutModal && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Confirm Checkout</h3>
                <button className="btn-close" onClick={() => setCheckoutModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Total: PHP {calculateTotal()}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleCheckout}>Confirm</button>
                <button className="btn btn-secondary" onClick={() => setCheckoutModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
