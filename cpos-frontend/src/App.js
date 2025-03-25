import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from "./components/loginPage";
import LandingPage from "./components/landingPage";
import BarcodeScanner from "./components/barcodeScanner";
import TransactionHistory from "./components/transactionHistory";
import Dashboard from "./components/dashboard";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/barcodescanner" element={<BarcodeScanner />} />
        <Route path="/transactionhistory" element={<TransactionHistory />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
