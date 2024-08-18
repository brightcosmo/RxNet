import React, { useState } from "react";

const PrescriptionTable = () => {
  const [transactionHash, setTransactionHash] = useState("");

  const handleSearch = () => {
    // Construct the URL using the transactionHash
    const externalUrl = `https://explorer-testnet.maschain.com/${transactionHash}`;
    
    // Open the external URL in a new tab or window
    window.open(externalUrl, '_blank');
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="transactionHash" className="block mb-2 text-base lg:text-lg text-black-100 font-medium mt-6">
          Enter Transaction Hash
        </label>
        <input
          type="text"
          id="transactionHash"
          value={transactionHash}
          onChange={(e) => setTransactionHash(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default PrescriptionTable;
