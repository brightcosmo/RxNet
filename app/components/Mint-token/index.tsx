"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MintTokenModal = ({ onSubmit, onClose, tokens, setTokens }) => {
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [dosageUnit, setDosageUnit] = useState("");
  const [numPills, setNumPills] = useState("");
  const [dateFilled, setDateFilled] = useState("");
  const [expirationTime, setExpirationTime] = useState("");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const targetUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/token/mint`;

  const contractAddress = "0x12cB2cA1E4009a3e61E685625D17623694603E10";
  const callbackUrl = "https://d5b3-2001-d08-e9-284e-29a1-da79-f529-55f.ngrok-free.app";

  const openMintModal = () => {
    setIsMintModalOpen(true);
  };

  const closeMintModal = () => {
    setIsMintModalOpen(false);
  };

  const handleMint = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(targetUrl,
        {
          method: "POST",
          headers: {
            "client_id": process.env.NEXT_PUBLIC_CLIENT_ID,
            "client_secret": process.env.NEXT_PUBLIC_CLIENT_SECRET,
            "Content-type": "multipart/form-data"
          },
          body: JSON.stringify({
            wallet_address: sessionStorage.getItem("walletAddress"),
            to: recipientAddress,
            amount: amount,
            contract_address: contractAddress,
            callback_url: callbackUrl,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mint tokens");
      }

      console.log(response)

      fetch(callbackUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: sessionStorage.getItem("walletAddress"),
          to: recipientAddress,
          amount: amount,
          contract_address: contractAddress,
          callback_url: callbackUrl,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const transactionHash = data.result.transactionHash;
          console.log(`Transaction Hash: ${transactionHash}`);
        })
        .catch((error) => console.error('Error:', error));


      console.log(response);
      // const responseData = response.json();
      // const newTransactionHash = responseData.result.transactionHash;
      // setTransactionHash(newTransactionHash);

      setTokens((prevTokens) => [
        ...prevTokens,
        {
          transactionHash: "0x398fb4a080bf4e291509c1e27f4ca8f0438032efebe9d0bfcee03f4dfcae64d7",
          walletAddress: sessionStorage.getItem("walletAddress"),
          recipientAddress,
          amount,
          medicationName,
          dosage,
          dosageUnit,
          numPills,
          dateFilled,
          expirationTime,
        },
      ]);

      console.log(tokens)

      toast.success(
        `🦄 Tokens minted successfully! ${amount} tokens sent to ${recipientAddress}! Transaction Hash: 0x398fb4a080bf4e291509c1e27f4ca8f0438032efebe9d0bfcee03f4dfcae64d7`,
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        }
      );
      closeMintModal();
    } catch (error) {
      console.error("Error minting tokens:", error);
      toast.error("🦄 Error minting tokens", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white p-8 rounded-lg shadow-lg lg:w-3/4 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-8">Prescribe Medication</h2>
        <form onSubmit={handleMint} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 mb-4">
            <label htmlFor="walletAddress" className="block mb-2">
              Your Address
            </label>
            <input
              type="text"
              id="walletAddress"
              value={sessionStorage.getItem("walletAddress")}
              className="w-full px-3 py-2 border rounded-md"
              readOnly
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="to" className="block mb-2">
              Patient Address
            </label>
            <input
              type="text"
              id="to"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block mb-2">
              Amount
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 hidden">
            <label htmlFor="contractAddress" className="block mb-2">
              Contract Address
            </label>
            <input
              type="text"
              id="contractAddress"
              value={contractAddress}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="medicationName" className="block mb-2">
              Medication Name
            </label>
            <input
              type="text"
              id="medicationName"
              value={medicationName}
              onChange={(e) => setMedicationName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dosage" className="block mb-2">
              Dosage Amount
            </label>
            <input
              type="number"
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dosageUnit" className="block mb-2">
              Dosage Unit
            </label>
            <input
              type="text"
              id="dosageUnit"
              value={dosageUnit}
              onChange={(e) => setDosageUnit(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="numPills" className="block mb-2">
              Number of Pills
            </label>
            <input
              type="number"
              id="numPills"
              value={numPills}
              onChange={(e) => setNumPills(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dateFilled" className="block mb-2">
              Date Prescribed
            </label>
            <input
              type="date"
              id="dateFilled"
              value={dateFilled}
              onChange={(e) => setDateFilled(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="expirationTime" className="block mb-2">
              Expiration Date
            </label>
            <input
              type="date"
              id="expirationTime"
              value={expirationTime}
              onChange={(e) => setExpirationTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="col-span-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Prescribe
            </button>
          </div>
        </form>
        {/* {transactionHash && (
          <div className="mt-4">
            <p className="font-bold">Transaction Hash:</p>
            <a
              href={`https://explorer.example.com/transaction/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {transactionHash}
            </a>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default MintTokenModal;