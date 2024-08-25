"use client";
import React from "react";

const TransferTokenModal = ({ onClose, tokens }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white p-8 rounded-lg shadow-lg lg:w-3/4 w-11/12 max-h-90vh overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Prescription Data</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Transaction Hash</th>
              <th className="py-2 px-4 border-b">Doctor Address</th>
              <th className="py-2 px-4 border-b">Patient Address</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Medication</th>
              <th className="py-2 px-4 border-b">Dosage</th>
              <th className="py-2 px-4 border-b">Number of Pills</th>
              <th className="py-2 px-4 border-b">Date Prescribed</th>
              <th className="py-2 px-4 border-b">Expiration Date</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{token.transactionHash.slice(0, 6)}...{token.transactionHash.slice(-4)}</td>
                <td className="py-2 px-4 border-b">{token.walletAddress.slice(0, 6)}...{token.walletAddress.slice(-4)}</td>
                <td className="py-2 px-4 border-b">{token.recipientAddress.slice(0, 6)}...{token.recipientAddress.slice(-4)}</td>
                <td className="py-2 px-4 border-b">{token.amount}</td>
                <td className="py-2 px-4 border-b">{token.medicationName}</td>
                <td className="py-2 px-4 border-b">{`${token.dosage} ${token.dosageUnit}`}</td>
                <td className="py-2 px-4 border-b">{token.numPills}</td>
                <td className="py-2 px-4 border-b">{token.dateFilled}</td>
                <td className="py-2 px-4 border-b">{token.expirationTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferTokenModal;