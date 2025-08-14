import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./styles.css";

export const Tracker = () => {
  const { addTransaction } = useAddTransaction();
  const { transactions, transactionsTotal } = useGetTransactions();
  const { userName, profilePhoto } = useGetUserInfo();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("expense");

  const { balance, income, expenses } = transactionsTotal;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!description || !transactionAmount) return;

    addTransaction({
      description,
      transactionAmount: parseFloat(transactionAmount),
      transactionType,
    });

    setDescription("");
    setTransactionAmount("");
  };

  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-gray-300 text-gray-900">
      {/* Header */}
      <div className="w-full h-20 bg-gray-800 text-gray-200 flex items-center justify-between px-10 shadow-md">
        <div className="flex items-center gap-4">
          {profilePhoto && (
            <img
              src={profilePhoto}
              alt="profile"
              className="w-12 h-12 rounded-full border border-gray-300 object-cover"
            />
          )}
          <h1 className="text-2xl font-semibold">{userName}'s Expense Tracker</h1>
        </div>
        <button
          onClick={signUserOut}
          className="bg-white text-gray-800 px-6 py-2 rounded-full font-semibold shadow-md hover:bg-gray-200 transition"
        >
          Sign Out
        </button>
      </div>

      {/* Summary */}
      <div className="flex justify-center items-center flex-wrap gap-6 px-8 py-10">
        <div className="w-64 bg-white rounded-lg shadow-md p-6 text-center border border-green-100">
          <h4 className="text-xl font-medium mb-2">Income</h4>
          <p className="text-2xl font-bold text-green-600">₹ {income}</p>
        </div>
        <div className="w-64 bg-white rounded-lg shadow-md p-6 text-center border border-blue-100">
          <h4 className="text-xl font-medium mb-2">Balance</h4>
          <p
            className={`text-2xl font-bold ${
              balance < 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            ₹ {balance}
          </p>
        </div>
        <div className="w-64 bg-white rounded-lg shadow-md p-6 text-center border border-red-100">
          <h4 className="text-xl font-medium mb-2">Expenses</h4>
          <p className="text-2xl font-bold text-red-600">₹ {expenses}</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex justify-center my-10">
        <form className="space-y-6 w-96" onSubmit={onSubmit}>
          {/* Description */}
          <label className="block">
            <span className="block text-sm font-medium mb-1">Description</span>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Groceries"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </label>

          {/* Amount */}
          <label className="block">
            <span className="block text-sm font-medium mb-1">Amount</span>
            <input
              type="number"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
              placeholder="e.g., 500"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </label>

          {/* Transaction Type */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={transactionType === "expense"}
                onChange={(e) => setTransactionType(e.target.value)}
              />
              Expense
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="income"
                checked={transactionType === "income"}
                onChange={(e) => setTransactionType(e.target.value)}
              />
              Income
            </label>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-full font-semibold hover:bg-blue-600 transition"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>

      {/* Transactions List */}
      <div className="mx-6 mb-10 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-center">Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-center text-gray-500">No transactions yet.</p>
        ) : (
          <ul className="space-y-3">
            {transactions.map((transaction) => (
              <li
                key={transaction.id}
                className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-lg"
              >
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <p
                    className={`text-sm ${
                      transaction.transactionType === "expense"
                        ? "text-red-600"
                        : "text-green-700"
                    }`}
                  >
                    ₹ {transaction.transactionAmount}
                  </p>
                </div>
                <span className="text-xs font-medium text-gray-600 capitalize">
                  {transaction.transactionType}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
