import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLatestTransactions } from "../firebase"; 

const LandingPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]); // Store transactions
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const latestTransactions = await getLatestTransactions(); // Fetch from Firestore
        setTransactions(latestTransactions);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="container mt-5">
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">CPOS</h1>
        <p className="text-muted">Clinic Point of Sale System</p>
      </div>

      {/* Recent Transactions */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Recent Transactions</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <p className="text-center text-muted">Loading transactions...</p>
          ) : error ? (
            <p className="text-center text-danger">{error}</p>
          ) : transactions.length > 0 ? (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Branch ID</th>
                  <th>Date</th>
                  <th>Time Stamp</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index}>
                    <td>{tx.branchID}</td>
                    <td>{tx.date}</td>
                    <td>{tx.readableTimestamp}</td>
                    <td>{tx.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-muted">No recent transactions available.</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <button
            className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
            style={{ height: "100px" }}
            onClick={() => navigate("/barcodescanner")}
          >
            Start Scanning
          </button>
        </div>
        <div className="col-md-6 mb-3">
          <button
            className="btn btn-secondary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
            style={{ height: "100px" }}
            onClick={() => navigate("/transactionhistory")}
          >
            View Transaction History
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
