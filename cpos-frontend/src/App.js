import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from "./components/loginPage";
import LandingPage from "./components/landingPage";
import BarcodeScanner from "./components/barcodeScanner";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/barcodescanner" element={<BarcodeScanner />} />
      </Routes>
    </Router>
  );
}

export default App;
