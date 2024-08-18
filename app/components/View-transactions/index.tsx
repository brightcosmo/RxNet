import React, { useState } from "react";

// Example local storage structure for prescriptions
const localPrescriptions = [
  {
    transactionHash: "0xf519ba69ba0...",
    doctor: "0x0ae987d1c8a16ea4f2d2686754230121992b790348cc4eb579d524dcdac03392",
    prescribedPatient: "0xcced8df47922d1f44edcec1dc6c61ec5ed9a66b56f754fd4e7f54b9a2ad251ef",
    pzn: "12345678",
    medicationName: "Test Medication",
    dosage: "500",
    dosageUnit: "mg",
    numPills: "30",
    dateFilled: "2023-01-01",
    expirationTime: "2023-12-31"
  },
  // Add more sample data here as needed
];

const PrescriptionTable = () => {
  const [transactionHash, setTransactionHash] = useState("");
  const [filteredPrescription, setFilteredPrescription] = useState(null);

  const handleSearch = () => {
    const prescription = localPrescriptions.find(
      (prescription) => prescription.transactionHash === transactionHash
    );
    setFilteredPrescription(prescription || null);
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
      {filteredPrescription && (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Attribute</th>
              <th className="border border-gray-300 px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(filteredPrescription).map(([key, value]) => (
              <tr key={key}>
                <td className="border border-gray-300 px-4 py-2 font-bold">{key}</td>
                <td className="border border-gray-300 px-4 py-2">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!filteredPrescription && transactionHash && (
        <p className="mt-4 text-red-500">No prescription found for this transaction hash.</p>
      )}
    </div>
  );
};

export default PrescriptionTable;
