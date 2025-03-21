import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  // Mock transaction data (replace with API call later)
  const transactions = [
    { branchID: 1, date: "Item A", readableTimestamp: "2024-02-21", totalAmount: "Completed" },
    { branchID: 2, date: "date B", readableTimestamp: "2024-02-20", totalAmount: "Pending" },
    { branchID: 3, date: "date C", readableTimestamp: "2024-02-19", totalAmount: "Completed" },
    { branchID: 4, date: "date D", readableTimestamp: "2024-02-18", totalAmount: "Pending" },
    { branchID: 5, date: "Item F", readableTimestamp: "2024-02-17", totalAmount: "Completed" },
  ];
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">CPOS</h1>
        <p className="text-muted">Centralized Point of Sale System</p>
      </div>

      {/* Recent Transactions */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Recent Transactions</h5>
        </div>
        <div className="card-body">
          {transactions.length > 0 ? (
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
                {transactions.map((tx) => (
                  <tr key={tx.branchID}>
                    <td>{tx.branchID}</td>
                    <td>{tx.date}</td>
                    <td>{tx.readableTimestamp}</td>
                    <td>{tx.totalAmount}</td>
                    {/* <td>
                      <span
                        className={`badge ${
                          tx.status === "Completed"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td> */}
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
            📷 Start Scanning
          </button>
        </div>
        <div className="col-md-6 mb-3">
          <button
            className="btn btn-secondary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
            style={{ height: "100px" }}
            onClick={() => navigate("/history")}
          >
            📜 View Transaction History
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
