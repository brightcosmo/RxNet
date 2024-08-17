"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MintTokenModal = ({ onSubmit, onClose }) => {
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const contractAddress = "0x12cB2cA1E4009a3e61E685625D17623694603E10";
  const callbackUrl = "https://postman-echo.com/post?";

  const openMintModal = () => {
    setIsMintModalOpen(true);
  };

  const closeMintModal = () => {
    setIsMintModalOpen(false);
  };

  const handleMint = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/token/mint`,
        {
          method: "POST",
          headers: {
            "client_id": process.env.NEXT_PUBLIC_CLIENT_ID,
            "client_secret": process.env.NEXT_PUBLIC_CLIENT_SECRET,
            "Content-Type": "multipart/form-data",
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

      toast.success(
        `🦄 Tokens minted successfully! ${amount} tokens sent to ${recipientAddress}`,
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
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
      <div className="bg-white p-8 rounded-lg shadow-lg lg:w-96 w-3/4">
        <h2 className="text-2xl font-bold mb-8">Mint Token</h2>
        <form onSubmit={handleMint}>
          <div className="mb-4 disabled">
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
          <div className="flex justify-end">
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
      </div>
    </div>
  );
};

export default MintTokenModal;