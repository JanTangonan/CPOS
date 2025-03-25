import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <h1 className="mb-4 fw-bold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <div className="card-body">
              <h5 className="card-title fw-semibold">Total Sales</h5>
              <p className="fs-4 fw-bold">$10,000</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <div className="card-body">
              <h5 className="card-title fw-semibold">Total Transactions</h5>
              <p className="fs-4 fw-bold">120</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <div className="card-body">
              <h5 className="card-title fw-semibold">Top-Selling Product</h5>
              <p className="fs-4 fw-bold">Product A</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <h2 className="mb-3 fw-semibold">Recent Transactions</h2>
      <div className="table-responsive shadow-sm">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#001</td>
              <td>March 1, 2025</td>
              <td>$500</td>
            </tr>
            <tr>
              <td>#002</td>
              <td>March 2, 2025</td>
              <td>$320</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-4 d-flex gap-3">
        <button className="btn btn-primary" onClick={() => navigate("/transactions")}>
          View Transaction History
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/products")}>
          Manage Products
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
