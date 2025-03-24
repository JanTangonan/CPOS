import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    getTransactionsByBranch, 
    getTransactionsByDate, 
    getTransactionsByBranchAndDate,
    getLatestTransactions
} from "../firebase";

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [branchFilter, setBranchFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFilteredTransactions = async () => {
            setLoading(true);

            try {
                if (branchFilter && dateFilter) {
                    const data = await getTransactionsByBranchAndDate(branchFilter, dateFilter);
                    setTransactions(data);
                } else if (branchFilter) {
                    const data = await getTransactionsByBranch(branchFilter);
                    setTransactions(data);
                } else if (dateFilter) {
                    const data = await getTransactionsByDate(dateFilter);  // Pass raw date (YYYY-MM-DD)
                    setTransactions(data);
                } else {
                    const data = await getLatestTransactions(15);
                    setTransactions(data);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }

            setLoading(false);
        };

        fetchFilteredTransactions();
    }, [branchFilter, dateFilter]);

    return (
        <div className="container mt-5">
            <button className="btn btn-primary mb-3" onClick={() => navigate("/landingpage")}>
                ← Back to Home
            </button>

            <h2 className="mb-4">Transaction History</h2>

            {/* Filters */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Filter by Branch ID"
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="date"
                        className="form-control"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                </div>
            </div>

            {/* Transactions Table */}
            {loading ? (
                <div className="text-center">
                    <span className="spinner-border text-primary" role="status"></span>
                    <p>Loading transactions...</p>
                </div>
            ) : (
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Branch ID</th>
                            <th>Date</th>
                            <th>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map((tx) => (
                                <tr key={tx.id} style={{ cursor: "pointer" }} onClick={() => setSelectedTransaction(tx)}>
                                    <td>{tx.branchID}</td>
                                    <td>{tx.date}</td>
                                    <td>{tx.totalAmount}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {/* Modal for Transaction Details */}
            {selectedTransaction && (
                <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Transaction Details</h5>
                                <button className="btn-close" onClick={() => setSelectedTransaction(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Branch ID:</strong> {selectedTransaction.branchID}</p>
                                <p><strong>Date and Time:</strong> {selectedTransaction.readableTimestamp}</p>
                                <p><strong>Total Amount:</strong> {selectedTransaction.totalAmount}</p>
                                
                                {/* Purchase Breakdown */}
                                <h6>Items Purchased:</h6>
                                <ul>
                                    {selectedTransaction.items?.map((item, index) => (
                                        <li key={index}>
                                            {item.productName} - {item.quantity} x {item.price} = {(item.quantity * item.price).toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setSelectedTransaction(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;
