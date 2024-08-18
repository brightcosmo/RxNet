"use client";
import React, { useState } from "react";
import CreateWalletModal from "../Create-wallet";
import ConnectWalletModal from "../Connect-wallet";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openConnectModal = () => {
    setIsConnectModalOpen(true);
  };

  const closeConnectModal = () => {
    setIsConnectModalOpen(false);
  };

  const handleConnect = async (walletAddress) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/wallet/${walletAddress}`,
        {
          method: "GET",
          headers: {
            "client_id": process.env.NEXT_PUBLIC_CLIENT_ID,
            "client_secret": process.env.NEXT_PUBLIC_CLIENT_SECRET,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch wallet");
      }

      sessionStorage.setItem("walletAddress", walletAddress);

      toast.success(
        `🦄 Wallet connected successfully!
        Wallet address: ${walletAddress}`,
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
      closeConnectModal();
    } catch (error) {
      console.error("Error fetching wallet:", error);
      toast.error("🦄 Error fetching wallet", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  };

  const handleSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/create-user`,
        {
          method: "POST",
          headers: {
            "client_id": process.env.NEXT_PUBLIC_CLIENT_ID,
            "client_secret": process.env.NEXT_PUBLIC_CLIENT_SECRET,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const result = await response.json();
      const walletAddress = result.result.wallet.wallet_address;
      sessionStorage.setItem("walletAddress", walletAddress);

      if (!walletAddress) {
        throw new Error("Wallet address not found in the response");
      }

      toast.success(
        `🦄 User created successfully!
        Wallet address: ${walletAddress}`,
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
      closeModal();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("🦄 Error creating user", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  };

  return (
    <header className="w-full py-8 lg:py-6 relative border-b">
      <div className="container mx-auto px-8 lg:px-4 flex items-center justify-between">
        <div className="flex items-center">
        <img 
            src="/rxnet_cropped.png" 
            alt="Maschain Logo" 
            className="h-10 lg:h-12" 
          />        
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={openModal}
            className="border rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300"
          >
            {typeof window !== "undefined" &&
            window.sessionStorage.getItem("walletAddress") ? (
              <span className="text-sm">
                {`${window.sessionStorage
                  .getItem("walletAddress")
                  .slice(0, 6)}...${window.sessionStorage
                  .getItem("walletAddress")
                  .slice(-4)}`}
              </span>
            ) : (
              "Create Wallet"
            )}
          </button>
          <button
            onClick={openConnectModal}
            className="border rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300"
          >
            Connect Wallet
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <CreateWalletModal onSubmit={handleSubmit} onClose={closeModal} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isConnectModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <ConnectWalletModal onSubmit={handleConnect} onClose={closeConnectModal} />
          </motion.div>
        )}
      </AnimatePresence>
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
    </header>
  );
};

export default Header;
