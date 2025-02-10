import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const BarcodeScanner = () => {
  const [data, setData] = useState("No result");

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Scan a Barcode</h2>
      <BarcodeScannerComponent
        width={300}
        height={300}
        onUpdate={(err, result) => {
          if (result) setData(result.text);
        }}
      />
      <h3>Scanned Code: {data}</h3>
    </div>
  );
};

export default BarcodeScanner;
