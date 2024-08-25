"use client";
import { useState, useEffect } from "react";
import MintTokenModal from "./components/Mint-token";
import TransferTokenModal from "./components/Transfer-token"
import PrescriptionTable from "./components/View-transactions";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);

  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [tokens, setTokens] = useState([]);

  const openMintModal = () => {
    setIsMintModalOpen(true);
  };

  const closeMintModal = () => {
    setIsMintModalOpen(false);
  };

  const openTransferModal = () => {
    setIsTransferModalOpen(true);
  };

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  useEffect(() => {
    const storedWalletAddress = sessionStorage.getItem("walletAddress");
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  const clearWalletAddress = () => {
    sessionStorage.removeItem("walletAddress");
    setWalletAddress(null);
  };

  console.log(tokens)
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-[#14F195] via-blue-400 to-[#9945FF]">
      <h1 className="font-extrabold text-4xl lg:text-6xl text-center text-white drop-shadow-lg z-0">
        The future of prescriptions.
      </h1>
      <div className="text-base lg:text-lg text-gray-100 font-medium mt-6">
        {walletAddress ? (
          <>
            {`Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(
              -4
            )}`}
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={clearWalletAddress}
                className="w-full mt-4 border-2 border-white rounded-md py-2 px-6 text-lg lg:text-xl font-semibold text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                Disconnect Wallet
              </button>
              <button
                onClick={openMintModal}
                className="mt-4 border-2 w-full rounded-md py-2 px-6 text-lg lg:text-xl font-semibold text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                New Prescription
              </button>
              <button
                onClick={openTransferModal}
                className="mt-4 border-2 w-full rounded-md py-2 px-6 text-lg lg:text-xl font-semibold text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                View Prescriptions
              </button>
            </div>
          </>
        ) : (
          "Hi Dr! Link a wallet to get started"
        )}
      </div>
      <AnimatePresence>
        {isMintModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <MintTokenModal
              // onSubmit={handleMintSubmit}
              onClose={closeMintModal}
              tokens={tokens}
              setTokens={setTokens}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isTransferModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <TransferTokenModal
              // onSubmit={handleMintSubmit}
              onClose={closeTransferModal}
              tokens={tokens}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <PrescriptionTable />
      <div className="flex items-center mt-8">
        <span className="text-white font-semibold mr-2">Powered by</span>
        <img
          src="https://cryptologos.cc/logos/solana-sol-logo.png"
          alt="Solana Logo"
          className="w-6 h-6"
        />
        <span className="text-white font-semibold ml-2">Solana</span>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </main>
  );  
}
